import express from 'express';
const router = express.Router();
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';
import { query } from '../config/database.js';
import { generateToken } from '../utils/jwt.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import { sendVerificationEmail } from '../services/email.service.js';

// ============================================
// 1. REGISTER
// ============================================
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, dob, orgName } = req.body;

        if (!name || !email || !password || !dob || !orgName) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: 'Invalid email' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be 6+ characters' });
        }

        const birthDate = new Date(dob);
        const age = (new Date() - birthDate) / (365.25 * 24 * 60 * 60 * 1000);
        if (age < 18) {
            return res.status(400).json({ error: 'You must be 18 or older' });
        }

        const existing = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await hashPassword(password);
        const userId = uuidv4();
        const verifyToken = uuidv4();

        await query(
            `INSERT INTO users (id, email, name, password_hash, dob, verify_token)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [userId, email, name, hashedPassword, dob, verifyToken]
        );

        const orgId = uuidv4();
        const slug = orgName.toLowerCase().replace(/[^a-z0-9]/g, '-');

        await query(
            'INSERT INTO organizations (id, name, slug, created_by) VALUES ($1, $2, $3, $4)',
            [orgId, orgName, slug, userId]
        );

        await query(
            `INSERT INTO org_members (organization_id, user_id, role, invited_by, status)
             VALUES ($1, $2, $3, $4, $5)`,
            [orgId, userId, 'owner', userId, 'active']
        );

        await sendVerificationEmail(email, name, verifyToken);

        const token = generateToken({ id: userId, email });

        res.status(201).json({
            success: true,
            message: 'Registration successful! Check your email.',
            data: {
                user: { id: userId, name, email },
                organization: { id: orgId, name: orgName, role: 'owner' },
                token,
            },
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// ============================================
// 2. VERIFY EMAIL
// ============================================
router.get('/verify/:token', async (req, res) => {
    try {
        const { token } = req.params;

        const result = await query(
            'SELECT * FROM users WHERE verify_token = $1 AND email_verified = $2',
            [token, false]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid or expired link' });
        }

        await query(
            'UPDATE users SET email_verified = $1, verify_token = NULL WHERE id = $2',
            [true, result.rows[0].id]
        );

        res.json({ success: true, message: 'Email verified successfully!' });

    } catch (error) {
        console.error('Verify error:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
});

// ============================================
// 3. LOGIN
// ============================================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const result = await query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        if (!user.email_verified) {
            return res.status(403).json({
                error: 'Email not verified. Please check your inbox.',
            });
        }

        const isValid = await comparePassword(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const orgs = await query(
            `SELECT o.id, o.name, o.slug, m.role
             FROM organizations o
             JOIN org_members m ON m.organization_id = o.id
             WHERE m.user_id = $1 AND m.status = $2`,
            [user.id, 'active']
        );

        const token = generateToken({ id: user.id, email: user.email });

        res.json({
            success: true,
            data: {
                user: { id: user.id, name: user.name, email: user.email },
                organizations: orgs.rows,
                token,
            },
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// ============================================
// 4. RESEND VERIFICATION
// ============================================
router.post('/resend-verification', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const result = await query(
            'SELECT * FROM users WHERE email = $1 AND email_verified = $2',
            [email, false]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found or already verified' });
        }

        const user = result.rows[0];
        const newToken = uuidv4();

        await query(
            'UPDATE users SET verify_token = $1 WHERE id = $2',
            [newToken, user.id]
        );

        await sendVerificationEmail(email, user.name, newToken);

        res.json({ success: true, message: 'Verification email sent again.' });

    } catch (error) {
        console.error('Resend error:', error);
        res.status(500).json({ error: 'Failed to resend' });
    }
});

export default router;
