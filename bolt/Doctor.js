const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  // Normal fee for regular appointments
  normalFee: {
    type: Number,
    required: true,
  },
  // Emergency fee for urgent appointments
  emergencyFee: {
    type: Number,
    required: true,
  },
  // Doctor's available slots (time-based)
  availableSlots: [{
    day: {
      type: String, // e.g., "Monday", "Tuesday", etc.
      required: true,
    },
    startTime: {
      type: String, // e.g., "09:00 AM"
      required: true,
    },
    endTime: {
      type: String, // e.g., "05:00 PM"
      required: true,
    },
    maxBookings: {
      type: Number, // Max number of bookings allowed in that time slot
      required: true,
    },
    bookingsMade: {
      type: Number,
      default: 0, // Keeps track of bookings made in that slot
    }
  }],
  image:{
    type :String,
    default:null,
  },
  degree:{
    type:String,
    required:true
  },
  // Track if the doctor is available for appointments
  isAvailable: {
    type: Boolean,
    default: true,
  },
  // The hospital this doctor is associated with
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
  },
  // Emergency slots management for limited number of urgent appointments per day
  emergencySlotsPerDay: {
    type: Number,
    default: 3, // Default maximum emergency slots per day (can be adjusted)
  },
  // Actual emergency slots booked during the day
  emergencyBookingsToday: {
    type: Number,
    default: 0, // Tracks how many emergency slots are booked today
  },

  isFirstBooking: {  // Added flag to track first-time booking
    type: Boolean,
    default: true,
  }
});

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
