import { verifyToken } from '../utils/jwt.js';
import { query } from '../config/database.js';

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = verifyToken(token);
        const result = await query('SELECT * FROM users WHERE id = $1', [decoded.id]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = result.rows[0];
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

export { authMiddleware };
