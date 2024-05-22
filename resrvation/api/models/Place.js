const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
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
    perks: {
        type: [String],
        default: []
    },
    extraInfo: {
        type: String,
        default: ''
    },
    checkIn: {
        type: Number,
        required: true
    },
    checkOut: {
        type: Number,
        required: true
    },
    maxGuests: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const PlaceModel = mongoose.model('Place', placeSchema);

module.exports = PlaceModel;
