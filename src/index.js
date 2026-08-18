// src/index.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';   // ✅ ADD THIS
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());   // ✅ ADD THIS

// Routes
import authRoutes from './routes/auth.routes.js';
import orgRoutes from './routes/org.routes.js';
import memberRoutes from './routes/member.routes.js';

app.use('/api/auth', authRoutes);
app.use('/api/organizations', orgRoutes);
app.use('/api', memberRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'FlowPilot API is running' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 FlowPilot Backend running on http://localhost:${PORT}`);
});
