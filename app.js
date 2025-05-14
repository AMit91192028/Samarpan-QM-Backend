// app.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const cron = require('node-cron');
const updateStaus = require('./utils/scheduler');

dotenv.config();

const app = express();

// ✅ Required for trusting Render/Vercel proxy headers like X-Forwarded-For
app.set('trust proxy', 1);

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:5173',
  'https://samarpan-qm-fronted.vercel.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || /vercel\.app$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Static image route
app.use('/image', express.static(path.join(__dirname, 'public', 'images')));

// Routes
const hospitalRoutes = require('./routes/hospitalRoutes');
const queueBookingRouter = require('./routes/queueBooking');
const adminRoutes = require('./routes/adminRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

app.use('/api/hospitals', hospitalRoutes);
app.use('/api/queue', queueBookingRouter);
app.use('/api/admin', adminRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/user', userRoutes);
app.use('/api/bookings', bookingRoutes);

// Scheduler (every minute)
cron.schedule('* * * * *', updateStaus);

// MongoDB connection and server start
const PORT = process.env.PORT || 4001;
const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://ay9336148501:5nmSXyOAhHTtKsYm@updatequeue.kboyjfm.mongodb.net/?retryWrites=true&w=majority&appName=UPDATEQueue';

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

module.exports = app;
