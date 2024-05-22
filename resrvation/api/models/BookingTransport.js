const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingTransportSchema = new Schema({
    transport: {
        type: Schema.Types.ObjectId,
        ref: 'Transport',
        required: true,
    },
    checkIn: {
        type: Date,
        required: true,
    },
    checkOut: {
        type: Date,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'validated'],
        default: 'pending',
    },
});

const BookingTransport = mongoose.model('BookingTransport', bookingTransportSchema);

module.exports = BookingTransport;
