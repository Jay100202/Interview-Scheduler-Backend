require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db');
const authRoutes = require('../routes/authRoutes');
const timeslotRoutes = require('../routes/timeslotRoutes');
const errorHandler = require('../middleware/errorHandler');

const app = express();

// Middleware
app.use(express.json());

// Configure CORS
const corsOptions = {
  origin: '*', // Allow all origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/timeslots', timeslotRoutes);

// Error handling
app.use(errorHandler);

// Catch-all error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));