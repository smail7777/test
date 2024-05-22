const mongoose = require('mongoose');

const TransportSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    photos: {
        type: [String],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    extraInfo: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    checkIn: {
        type: Number,
        required: true
    },
    checkOut: {
        type: Number,
        required: true
    }
});

const TransportModel = mongoose.model('Transport', TransportSchema);

module.exports = TransportModel;
