const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'validated'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Method to check for overlapping bookings
bookingSchema.statics.isDateRangeAvailable = async function (placeId, checkIn, checkOut) {
    const existingBookings = await this.find({
        place: placeId,
        $or: [
            { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } }
        ]
    });
    return existingBookings.length === 0;
};

// Pre-save hook to validate date availability
bookingSchema.pre('save', async function (next) {
    if (!await this.constructor.isDateRangeAvailable(this.place, this.checkIn, this.checkOut)) {
        const error = new Error('The place is already booked for the selected dates.');
        return next(error);
    }
    next();
});

const BookingModel = mongoose.model('Booking', bookingSchema);

module.exports = BookingModel;
