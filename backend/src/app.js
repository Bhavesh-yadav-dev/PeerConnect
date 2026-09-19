import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import tutorRoutes from './routes/tutorRoutes.js';
import requestRoutes from './routes/requestRoutes.js';

dotenv.config();

const app = express();

// Allow requests from localhost during dev and from deployed Vercel frontend in production
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL // Set this in Render environment variables
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(null, true); // Permissive CORS for deployed demo
  }
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/requests', requestRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PeerConnect Backend API is running' });
});

export default app;
