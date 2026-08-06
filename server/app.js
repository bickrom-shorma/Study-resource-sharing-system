const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const noteRoutes = require('./routes/noteRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded PDF files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/notes', noteRoutes);

// Direct topic endpoint support for GET /api/topics/:subjectId
app.use('/api/topics', (req, res, next) => {
  if (req.path.startsWith('/')) {
    req.url = '/topics' + req.path;
  }
  return subjectRoutes(req, res, next);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Study Resource Sharing System API is running.' });
});

// 404 API Route Handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found.' });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack || err.message);
  
  if (err.message && err.message.includes('Only PDF files are allowed')) {
    return res.status(400).json({ success: false, message: err.message });
  }

  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
