const mongoose = require('mongoose');

const restaurantRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['CREATE', 'UPDATE', 'DELETE'], required: true },
    target: {
        type: String,
        required: function () { return this.type !== 'CREATE'; }
    },
    data: { type: Object, required: true },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
    adminComments: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('RestaurantRequest', restaurantRequestSchema);
