import mongoose from 'mongoose';

// Restaurant Request schema - for pending restaurant submissions
const restaurantRequestSchema = mongoose.Schema({
    // Restaurant details
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: String },
    address: { type: String, required: true },
    images: [String], // base64 strings
    hours: String,
    description: String,
    menu: [String],
    location: {
        lat: { type: Number },
        lng: { type: Number }
    },

    // Request metadata
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'owners', required: true },
    ownerName: { type: String },
    ownerEmail: { type: String },
    ownerPhone: [String],

    // Approval status
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },

    // Admin response
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admins' },
    reviewedAt: { type: Date },
    rejectionReason: { type: String },

    // Approved restaurant reference
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'restaurants' }
}, { timestamps: true });

const RestaurantRequest = mongoose.model('restaurant_requests', restaurantRequestSchema);
export default RestaurantRequest;
