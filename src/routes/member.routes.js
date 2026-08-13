import express from 'express';
const router = express.Router();
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';
import { sendInviteEmail } from '../services/email.service.js';

// ============================================
// 1. GET ALL MEMBERS
// ============================================
router.get('/:orgId/members', authMiddleware, async (req, res) => {
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

        const result = await query(
            `SELECT u.id, u.email, u.name, m.role, m.joined_at
             FROM org_members m
             JOIN users u ON u.id = m.user_id
             WHERE m.organization_id = $1 AND m.status = $2
             ORDER BY m.joined_at ASC`,
            [orgId, 'active']
        );

        res.json({
            success: true,
            data: {
                members: result.rows,
                total: result.rows.length,
                role: member.rows[0].role,
            },
        });

    } catch (error) {
        console.error('Get members error:', error);
        res.status(500).json({ error: 'Failed to get members' });
    }
});

// ============================================
// 2. INVITE MEMBER (Owner/Admin only)
// ============================================
router.post('/:orgId/invite', authMiddleware, async (req, res) => {
    try {
        const { orgId } = req.params;
        const userId = req.user.id;
        const { email, role } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const member = await query(
            'SELECT role FROM org_members WHERE organization_id = $1 AND user_id = $2 AND status = $3',
            [orgId, userId, 'active']
        );

        if (member.rows.length === 0) {
            return res.status(403).json({ error: 'Not a member' });
        }

        if (!['owner', 'admin'].includes(member.rows[0].role)) {
            return res.status(403).json({ error: 'Only owner/admin can invite' });
        }

        const inviteToken = uuidv4();
        const inviteId = uuidv4();

        await query(
            `INSERT INTO invites (id, organization_id, email, role, token, invited_by)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [inviteId, orgId, email, role || 'member', inviteToken, userId]
        );

        const org = await query('SELECT name FROM organizations WHERE id = $1', [orgId]);
        await sendInviteEmail(email, req.user.name, org.rows[0].name, inviteToken);

        res.json({
            success: true,
            message: `Invite sent to ${email}`,
            data: {
                inviteId,
                email,
                role: role || 'member',
                token: inviteToken,
            },
        });

    } catch (error) {
        console.error('Invite error:', error);
        res.status(500).json({ error: 'Failed to send invite' });
    }
});

// ============================================
// 3. ACCEPT INVITE
// ============================================
router.post('/accept-invite/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const invite = await query(
            'SELECT * FROM invites WHERE token = $1 AND status = $2 AND expires_at > NOW()',
            [token, 'pending']
        );

        if (invite.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid or expired invite' });
        }

        const inviteData = invite.rows[0];

        const user = await query('SELECT * FROM users WHERE id = $1', [userId]);
        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const existingMember = await query(
            'SELECT * FROM org_members WHERE organization_id = $1 AND user_id = $2',
            [inviteData.organization_id, userId]
        );

        if (existingMember.rows.length > 0) {
            return res.status(400).json({ error: 'Already a member' });
        }

        await query(
            `INSERT INTO org_members (organization_id, user_id, role, invited_by, status)
             VALUES ($1, $2, $3, $4, $5)`,
            [inviteData.organization_id, userId, inviteData.role, inviteData.invited_by, 'active']
        );

        await query(
            'UPDATE invites SET status = $1 WHERE id = $2',
            ['accepted', inviteData.id]
        );

        res.json({
            success: true,
            message: 'You have joined the organization!',
            data: {
                organizationId: inviteData.organization_id,
                role: inviteData.role,
            },
        });

    } catch (error) {
        console.error('Accept invite error:', error);
        res.status(500).json({ error: 'Failed to accept invite' });
    }
});

// ============================================
// 4. REMOVE MEMBER (Owner/Admin only)
// ============================================
router.delete('/:orgId/members/:memberId', authMiddleware, async (req, res) => {
    try {
        const { orgId, memberId } = req.params;
        const userId = req.user.id;

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

        const target = await query(
            'SELECT role FROM org_members WHERE organization_id = $1 AND user_id = $2 AND status = $3',
            [orgId, memberId, 'active']
        );

        if (target.rows.length === 0) {
            return res.status(404).json({ error: 'Member not found' });
        }

        if (target.rows[0].role === 'owner') {
            return res.status(403).json({ error: 'Cannot remove owner' });
        }

        await query(
            'UPDATE org_members SET status = $1 WHERE organization_id = $2 AND user_id = $3',
            ['inactive', orgId, memberId]
        );

        res.json({ success: true, message: 'Member removed successfully' });

    } catch (error) {
        console.error('Remove member error:', error);
        res.status(500).json({ error: 'Failed to remove member' });
    }
});

// ============================================
// 5. UPDATE MEMBER ROLE (Owner only)
// ============================================
router.put('/:orgId/members/:memberId/role', authMiddleware, async (req, res) => {
    try {
        const { orgId, memberId } = req.params;
        const userId = req.user.id;
        const { role } = req.body;

        if (!role || !['admin', 'member', 'guest'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const member = await query(
            'SELECT role FROM org_members WHERE organization_id = $1 AND user_id = $2 AND status = $3',
            [orgId, userId, 'active']
        );

        if (member.rows.length === 0) {
            return res.status(403).json({ error: 'Not a member' });
        }

        if (member.rows[0].role !== 'owner') {
            return res.status(403).json({ error: 'Only owner can update roles' });
        }

        await query(
            'UPDATE org_members SET role = $1 WHERE organization_id = $2 AND user_id = $3',
            [role, orgId, memberId]
        );

        res.json({ success: true, message: `Role updated to ${role}` });

    } catch (error) {
        console.error('Update role error:', error);
        res.status(500).json({ error: 'Failed to update role' });
    }
});

export default router;
