import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRY } from '../config/auth.js';

const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

export { generateToken, verifyToken };
