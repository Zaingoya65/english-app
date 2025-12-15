import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import chatRoutes from './routes/chat.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting to prevent abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(cors({
    origin: 'https://shoppingdoor.pk', 
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());
app.use('/api', limiter);

// Routes
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    // console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

app.listen(PORT, () => {
    // console.log(`🚀 Server running on http://localhost:${PORT}`);
});
