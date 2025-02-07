require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const connectDB = require('../config/db');
const authRoutes = require('../routes/authRoutes');
const timeslotRoutes = require('../routes/timeslotRoutes');
const errorHandler = require('../middleware/errorHandler');

const app = express();

// Middleware for parsing JSON
app.use(express.json());

// CORS Configuration
app.use(cors({
    origin: '*', // Consider specifying domains in production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Explicitly handle OPTIONS for CORS preflight requests
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
  } else {
    next();
  }
});

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/timeslots', timeslotRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Generic Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports.handler = serverless(app);
