// src/index.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
import authRoutes from './routes/auth.routes.js';
import orgRoutes from './routes/org.routes.js';
import memberRoutes from './routes/member.routes.js';
import workflowRoutes from './routes/workflow.routes.js';  // ✅ ADD THIS

app.use('/api/auth', authRoutes);
app.use('/api/organizations', orgRoutes);
app.use('/api', memberRoutes);
app.use('/api/workflows', workflowRoutes);  // ✅ ADD THIS

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'FlowPilot API is running' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not fo und' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 FlowPilot Backend running on http://localhost:${PORT}`);
});
