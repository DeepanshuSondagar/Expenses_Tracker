import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import expenseRoutes from './routes/expenses.js';
import incomeRoutes from './routes/income.js';
import userRoutes from './routes/user.js';
import budgetRoutes from './routes/budgets.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://expenses-tracker-1-aymm.onrender.com']
    : 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/user', userRoutes);
app.use('/api/budgets', budgetRoutes);

// Serve static files from frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
}

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
server.on('error', (err) => { if (err && err.code === 'EADDRINUSE') console.error(`Port ${PORT} is already in use.`); });