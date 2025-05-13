// app.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // 🍪 added
const path = require('path');
const cron=require('node-cron')
const updateStaus = require('./utils/scheduler');
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser()); // 🍪 added
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // 🍪 allow cookies cross-origin
}));

// Routes
const hospitalRoutes = require('./routes/hospitalRoutes');
const queueBookingRouter = require('./routes/queueBooking');
const adminRoutes = require('./routes/adminRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
app.use('/image', express.static(path.join(__dirname, 'public', 'images')));
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/queue', queueBookingRouter);
app.use('/api/admin', adminRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/user', userRoutes);
app.use('/api/bookings', bookingRoutes);
cron.schedule('* * * * *', updateStaus)
// MongoDB & Server
const PORT = process.env.PORT || 4001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/queue-management';

mongoose.connect(MONGO_URI, {

})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

// Error handling middleware (place after routes)
app.use((err, req, res, next) => {
    console.error('🔥 Error:', err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// 404 handler (place after routes and error handler)
app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' });
});

module.exports = app; // Export the app for testing or other purposes