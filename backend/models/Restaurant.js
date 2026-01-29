const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    id: { type: String },
    category: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    price: { type: String, required: true },
    address: { type: String, required: true },
    images: [String], // URL strings or paths
    hours: String,
    description: String,
    menu: [String],
    reviews: [
        {
            user: String,
            rating: Number,
            text: String,
            date: String,
            id: String
        }
    ],
    // Adding coordinates for map
    location: {
        lat: { type: Number },
        lng: { type: Number }
    },
    isApproved: { type: Boolean, default: false },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
