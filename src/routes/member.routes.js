// src/routes/member.routes.js
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

        // ✅ Check if user is a member
        const member = await query(
            'SELECT role FROM org_members WHERE organization_id = $1 AND user_id = $2 AND status = $3',
            [orgId, userId, 'active']
        );

        if (member.rows.length === 0) {
            return res.status(403).json({
                success: false,
                error: 'NOT_A_MEMBER',
                message: 'You are not a member of this organization'
            });
        }

        // ✅ Get all active members
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
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Failed to get members'
        });
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

        // ✅ Validation
        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'MISSING_EMAIL',
                message: 'Email is required'
            });
        }

        // ✅ Check if user is a member
        const member = await query(
            'SELECT role FROM org_members WHERE organization_id = $1 AND user_id = $2 AND status = $3',
            [orgId, userId, 'active']
        );

        if (member.rows.length === 0) {
            return res.status(403).json({
                success: false,
                error: 'NOT_A_MEMBER',
                message: 'You are not a member'
            });
        }

        // ✅ Check permission
        if (!['owner', 'admin'].includes(member.rows[0].role)) {
            return res.status(403).json({
                success: false,
                error: 'INSUFFICIENT_PERMISSIONS',
                message: 'Only owner/admin can invite members'
            });
        }

        // ✅ Check if user already exists in org
        const existingMember = await query(
            `SELECT u.id, u.email
             FROM users u
             JOIN org_members m ON m.user_id = u.id
             WHERE m.organization_id = $1 AND u.email = $2`,
            [orgId, email]
        );

        if (existingMember.rows.length > 0) {
            return res.status(409).json({
                success: false,
                error: 'ALREADY_MEMBER',
                message: `User with email "${email}" is already a member`
            });
        }

        // ✅ Check if invite already exists (pending)
        const existingInvite = await query(
            `SELECT id, status FROM invites
             WHERE organization_id = $1 AND email = $2 AND status = $3`,
            [orgId, email, 'pending']
        );

        if (existingInvite.rows.length > 0) {
            return res.status(409).json({
                success: false,
                error: 'INVITE_ALREADY_SENT',
                message: `An invite has already been sent to ${email}`,
                inviteId: existingInvite.rows[0].id
            });
        }

        // ✅ Generate invite
        const inviteToken = uuidv4();
        const inviteId = uuidv4();

        // ✅ Save to database
        await query(
            `INSERT INTO invites (id, organization_id, email, role, token, invited_by)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [inviteId, orgId, email, role || 'member', inviteToken, userId]
        );

        // ✅ Get organization name
        const org = await query('SELECT name FROM organizations WHERE id = $1', [orgId]);
        const orgName = org.rows[0]?.name || 'Organization';

        // ✅ Send invite email
        const emailSent = await sendInviteEmail(email, req.user.name, orgName, inviteToken);

        res.status(201).json({
            success: true,
            message: `Invite sent to ${email}`,
            data: {
                inviteId,
                email,
                role: role || 'member',
                token: inviteToken,
                emailSent,
            },
        });

    } catch (error) {
        console.error('Invite error:', error);
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Failed to send invite'
        });
    }
});

// ============================================
// 3. ACCEPT INVITE
// ============================================
router.post('/accept-invite/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { userId } = req.body;

        // ✅ Validation
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'MISSING_USER_ID',
                message: 'User ID is required'
            });
        }

        // ✅ Validate invite token
        const invite = await query(
            'SELECT * FROM invites WHERE token = $1 AND status = $2 AND expires_at > NOW()',
            [token, 'pending']
        );

        if (invite.rows.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'INVALID_INVITE',
                message: 'Invalid or expired invite'
            });
        }

        const inviteData = invite.rows[0];

        // ✅ Check if user exists
        const user = await query('SELECT * FROM users WHERE id = $1', [userId]);
        if (user.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'USER_NOT_FOUND',
                message: 'User not found'
            });
        }

        // ✅ Check if already a member
        const existingMember = await query(
            'SELECT * FROM org_members WHERE organization_id = $1 AND user_id = $2',
            [inviteData.organization_id, userId]
        );

        if (existingMember.rows.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'ALREADY_MEMBER',
                message: 'You are already a member of this organization'
            });
        }

        // ✅ Add user to organization
        await query(
            `INSERT INTO org_members (organization_id, user_id, role, invited_by, status)
             VALUES ($1, $2, $3, $4, $5)`,
            [inviteData.organization_id, userId, inviteData.role, inviteData.invited_by, 'active']
        );

        // ✅ Update invite status
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
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Failed to accept invite'
        });
    }
});

// ============================================
// 4. REMOVE MEMBER (Owner/Admin only)
// ============================================
router.delete('/:orgId/members/:memberId', authMiddleware, async (req, res) => {
    try {
        const { orgId, memberId } = req.params;
        const userId = req.user.id;

        // ✅ Check if user is a member
        const member = await query(
            'SELECT role FROM org_members WHERE organization_id = $1 AND user_id = $2 AND status = $3',
            [orgId, userId, 'active']
        );

        if (member.rows.length === 0) {
            return res.status(403).json({
                success: false,
                error: 'NOT_A_MEMBER',
                message: 'You are not a member'
            });
        }

        // ✅ Check permission
        if (!['owner', 'admin'].includes(member.rows[0].role)) {
            return res.status(403).json({
                success: false,
                error: 'INSUFFICIENT_PERMISSIONS',
                message: 'Only owner/admin can remove members'
            });
        }

        // ✅ Check if target exists
        const target = await query(
            'SELECT role FROM org_members WHERE organization_id = $1 AND user_id = $2 AND status = $3',
            [orgId, memberId, 'active']
        );

        if (target.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'MEMBER_NOT_FOUND',
                message: 'Member not found'
            });
        }

        // ✅ Cannot remove owner
        if (target.rows[0].role === 'owner') {
            return res.status(403).json({
                success: false,
                error: 'CANNOT_REMOVE_OWNER',
                message: 'Cannot remove the owner of the organization'
            });
        }

        // ✅ Remove member
        await query(
            'UPDATE org_members SET status = $1 WHERE organization_id = $2 AND user_id = $3',
            ['inactive', orgId, memberId]
        );

        res.json({
            success: true,
            message: 'Member removed successfully',
        });

    } catch (error) {
        console.error('Remove member error:', error);
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Failed to remove member'
        });
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

        // ✅ Validation
        if (!role || !['admin', 'member', 'guest'].includes(role)) {
            return res.status(400).json({
                success: false,
                error: 'INVALID_ROLE',
                message: 'Invalid role. Allowed: admin, member, guest'
            });
        }

        // ✅ Check if user is a member
        const member = await query(
            'SELECT role FROM org_members WHERE organization_id = $1 AND user_id = $2 AND status = $3',
            [orgId, userId, 'active']
        );

        if (member.rows.length === 0) {
            return res.status(403).json({
                success: false,
                error: 'NOT_A_MEMBER',
                message: 'You are not a member'
            });
        }

        // ✅ Only owner can update roles
        if (member.rows[0].role !== 'owner') {
            return res.status(403).json({
                success: false,
                error: 'INSUFFICIENT_PERMISSIONS',
                message: 'Only the owner can update member roles'
            });
        }

        // ✅ Check if target exists
        const target = await query(
            'SELECT role FROM org_members WHERE organization_id = $1 AND user_id = $2 AND status = $3',
            [orgId, memberId, 'active']
        );

        if (target.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'MEMBER_NOT_FOUND',
                message: 'Member not found'
            });
        }

        // ✅ Cannot change owner's role
        if (target.rows[0].role === 'owner') {
            return res.status(403).json({
                success: false,
                error: 'CANNOT_CHANGE_OWNER',
                message: 'Cannot change the owner\'s role'
            });
        }

        // ✅ Update role
        await query(
            'UPDATE org_members SET role = $1 WHERE organization_id = $2 AND user_id = $3',
            [role, orgId, memberId]
        );

        res.json({
            success: true,
            message: `Role updated to ${role}`,
        });

    } catch (error) {
        console.error('Update role error:', error);
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Failed to update role'
        });
    }
});

// ============================================
// 6. GET PENDING INVITES
// ============================================
router.get('/:orgId/invites/pending', authMiddleware, async (req, res) => {
    try {
        const { orgId } = req.params;
        const userId = req.user.id;

        // ✅ Check if user is a member
        const member = await query(
            'SELECT role FROM org_members WHERE organization_id = $1 AND user_id = $2 AND status = $3',
            [orgId, userId, 'active']
        );

        if (member.rows.length === 0) {
            return res.status(403).json({
                success: false,
                error: 'NOT_A_MEMBER',
                message: 'You are not a member'
            });
        }

        // ✅ Get pending invites
        const result = await query(
            `SELECT id, email, role, token, invited_by, status, created_at
             FROM invites
             WHERE organization_id = $1 AND status = $2
             ORDER BY created_at DESC`,
            [orgId, 'pending']
        );

        res.json({
            success: true,
            data: {
                invites: result.rows,
                total: result.rows.length,
            },
        });

    } catch (error) {
        console.error('Get pending invites error:', error);
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Failed to get pending invites'
        });
    }
});

// ============================================
// 7. RESEND INVITE
// ============================================
router.post('/:orgId/invites/resend', authMiddleware, async (req, res) => {
    try {
        const { orgId } = req.params;
        const userId = req.user.id;
        const { email } = req.body;

        // ✅ Validation
        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'MISSING_EMAIL',
                message: 'Email is required'
            });
        }

        // ✅ Check if user is a member
        const member = await query(
            'SELECT role FROM org_members WHERE organization_id = $1 AND user_id = $2 AND status = $3',
            [orgId, userId, 'active']
        );

        if (member.rows.length === 0) {
            return res.status(403).json({
                success: false,
                error: 'NOT_A_MEMBER',
                message: 'You are not a member'
            });
        }

        // ✅ Check permission
        if (!['owner', 'admin'].includes(member.rows[0].role)) {
            return res.status(403).json({
                success: false,
                error: 'INSUFFICIENT_PERMISSIONS',
                message: 'Only owner/admin can resend invites'
            });
        }

        // ✅ Check if invite exists and is pending
        const invite = await query(
            `SELECT * FROM invites
             WHERE organization_id = $1 AND email = $2 AND status = $3
             ORDER BY created_at DESC LIMIT 1`,
            [orgId, email, 'pending']
        );

        if (invite.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'INVITE_NOT_FOUND',
                message: `No pending invite found for "${email}"`
            });
        }

        const inviteData = invite.rows[0];

        // ✅ Generate new token
        const newToken = uuidv4();

        // ✅ Update token and timestamp
        await query(
            'UPDATE invites SET token = $1, created_at = NOW() WHERE id = $2',
            [newToken, inviteData.id]
        );

        // ✅ Get organization name
        const org = await query('SELECT name FROM organizations WHERE id = $1', [orgId]);
        const orgName = org.rows[0]?.name || 'Organization';

        // ✅ Resend email
        const emailSent = await sendInviteEmail(email, req.user.name, orgName, newToken);

        res.json({
            success: true,
            message: `Invite resent to ${email}`,
            data: {
                inviteId: inviteData.id,
                email,
                token: newToken,
                emailSent,
            },
        });

    } catch (error) {
        console.error('Resend invite error:', error);
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Failed to resend invite'
        });
    }
});

// ============================================
// 8. CANCEL INVITE
// ============================================
router.delete('/:orgId/invites/:inviteId', authMiddleware, async (req, res) => {
    try {
        const { orgId, inviteId } = req.params;
        const userId = req.user.id;

        // ✅ Check if user is a member
        const member = await query(
            'SELECT role FROM org_members WHERE organization_id = $1 AND user_id = $2 AND status = $3',
            [orgId, userId, 'active']
        );

        if (member.rows.length === 0) {
            return res.status(403).json({
                success: false,
                error: 'NOT_A_MEMBER',
                message: 'You are not a member'
            });
        }

        // ✅ Check permission
        if (!['owner', 'admin'].includes(member.rows[0].role)) {
            return res.status(403).json({
                success: false,
                error: 'INSUFFICIENT_PERMISSIONS',
                message: 'Only owner/admin can cancel invites'
            });
        }

        // ✅ Check if invite exists
        const invite = await query(
            'SELECT id, email FROM invites WHERE id = $1 AND organization_id = $2 AND status = $3',
            [inviteId, orgId, 'pending']
        );

        if (invite.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'INVITE_NOT_FOUND',
                message: 'Invite not found or already processed'
            });
        }

        const email = invite.rows[0].email;

        // ✅ Delete invite
        await query(
            'DELETE FROM invites WHERE id = $1',
            [inviteId]
        );

        res.json({
            success: true,
            message: `Invite to ${email} cancelled successfully`,
            data: {
                inviteId,
                email,
            },
        });

    } catch (error) {
        console.error('Cancel invite error:', error);
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Failed to cancel invite'
        });
    }
});

// ============================================
// 9. GET INVITE DETAILS (Public)
// ============================================
router.get('/invite/:token', async (req, res) => {
    try {
        const { token } = req.params;

        // ✅ Get invite details
        const result = await query(
            `SELECT
                i.id, i.email, i.role, i.token, i.status,
                i.created_at as sent_at, i.expires_at,
                o.id as organization_id, o.name as organization_name,
                u.name as inviter_name
             FROM invites i
             JOIN organizations o ON o.id = i.organization_id
             JOIN users u ON u.id = i.invited_by
             WHERE i.token = $1 AND i.status = $2`,
            [token, 'pending']
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'INVITE_NOT_FOUND',
                message: 'Invalid or expired invite link.'
            });
        }

        const invite = result.rows[0];

        res.json({
            success: true,
            data: {
                organization: invite.organization_name,
                organizationId: invite.organization_id,
                inviter: invite.inviter_name,
                role: invite.role,
                email: invite.email,
                sentAt: invite.sent_at,
                expiresAt: invite.expires_at,
                status: invite.status,
            },
        });

    } catch (error) {
        console.error('Get invite details error:', error);
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Failed to get invite details.'
        });
    }
});

export default router;
