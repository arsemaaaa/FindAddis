import mongoose from 'mongoose';

export const reviewSchema = new mongoose.Schema({
    userId: String,
    rating: Number,
    text: String,
    date: Date
});


const restaurantSchema = mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    price: { type: String },
    address: { type: String, required: true },
    images: [String], // will store base64 strings
    hours: String,
    description: String,
    menu: [String],
    reviews: [reviewSchema],
    // Adding coordinates for map
    location: {
        lat: { type: Number },
        lng: { type: Number }
    }
}, {
    timestamps: true
});

export const Restaurant = mongoose.model('restaurants', restaurantSchema);

