import express from 'express';
const router = express.Router();
import { query } from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';

// ============================================
// 1. GET ORGANIZATION DETAILS
// ============================================
router.get('/:orgId', authMiddleware, async (req, res) => {
    try {
        const { orgId } = req.params;
        const userId = req.user.id;

        const member = await query(
            'SELECT role, status FROM org_members WHERE organization_id = $1 AND user_id = $2',
            [orgId, userId]
        );

        if (member.rows.length === 0 || member.rows[0].status !== 'active') {
            return res.status(403).json({ error: 'Not a member' });
        }

        const result = await query(
            'SELECT id, name, slug, logo, created_by, created_at FROM organizations WHERE id = $1',
            [orgId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        res.json({
            success: true,
            data: {
                organization: result.rows[0],
                role: member.rows[0].role,
            },
        });

    } catch (error) {
        console.error('Get org error:', error);
        res.status(500).json({ error: 'Failed to get organization' });
    }
});

// ============================================
// 2. UPDATE ORGANIZATION (Owner/Admin only)
// ============================================
router.put('/:orgId', authMiddleware, async (req, res) => {
    try {
        const { orgId } = req.params;
        const userId = req.user.id;
        const { name, logo } = req.body;

        const member = await query(
            'SELECT role FROM org_members WHERE organization_id = $1 AND user_id = $2 AND status = $3',
            [orgId, userId, 'active']
        );

        if (member.rows.length === 0) {
            return res.status(403).json({ error: 'Not a member' });
        }

        if (!['owner', 'admin'].includes(member.rows[0].role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        const updates = [];
        const values = [];
        let idx = 1;

        if (name) {
            updates.push(`name = $${idx++}`);
            values.push(name);
        }
        if (logo !== undefined) {
            updates.push(`logo = $${idx++}`);
            values.push(logo);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(orgId);
        await query(`UPDATE organizations SET ${updates.join(', ')} WHERE id = $${idx}`, values);

        res.json({ success: true, message: 'Organization updated successfully' });

    } catch (error) {
        console.error('Update org error:', error);
        res.status(500).json({ error: 'Failed to update organization' });
    }
});

// ============================================
// 3. DELETE ORGANIZATION (Owner only)
// ============================================
router.delete('/:orgId', authMiddleware, async (req, res) => {
    try {
        const { orgId } = req.params;
        const userId = req.user.id;

        const member = await query(
            'SELECT role FROM org_members WHERE organization_id = $1 AND user_id = $2 AND status = $3',
            [orgId, userId, 'active']
        );

        if (member.rows.length === 0) {
            return res.status(403).json({ error: 'Not a member' });
        }

        if (member.rows[0].role !== 'owner') {
            return res.status(403).json({ error: 'Only owner can delete' });
        }

        await query('DELETE FROM organizations WHERE id = $1', [orgId]);

        res.json({ success: true, message: 'Organization deleted successfully' });

    } catch (error) {
        console.error('Delete org error:', error);
        res.status(500).json({ error: 'Failed to delete organization' });
    }
});


// ============================================
// GET USER'S ORGANIZATIONS (Dashboard)
// ============================================
router.get('/my/organizations', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        // ✅ Get all organizations where user is a member
        const result = await query(
            `SELECT
                o.id, o.name, o.slug, o.logo,
                m.role, m.status, m.joined_at,
                o.created_by as owner_id,
                CASE WHEN o.created_by = $1 THEN true ELSE false END as is_owner
             FROM organizations o
             JOIN org_members m ON m.organization_id = o.id
             WHERE m.user_id = $1 AND m.status = $2
             ORDER BY m.joined_at DESC`,
            [userId, 'active']
        );

        console.log(result, "result==========================================================")

        res.json({
            success: true,
            data: {
                organizations: result.rows,
                total: result.rows.length,
            },
        });

    } catch (error) {
        console.error('Get user organizations error:', error);
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Failed to get organizations'
        });
    }
});
export default router;
