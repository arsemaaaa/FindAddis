const mongoose = require('mongoose');

const restaurantRequestSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['create', 'update'], required: true },
    targetRestaurantId: { type: String }, // For updates
    data: { type: Object, required: true }, // The payload (new name, menu etc)
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    adminComments: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('RestaurantRequest', restaurantRequestSchema);
