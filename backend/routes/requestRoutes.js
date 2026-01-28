const express = require('express');
const router = express.Router();
const RestaurantRequest = require('../models/RestaurantRequest');
const Restaurant = require('../models/Restaurant');
const { protect, admin } = require('../middleware/authMiddleware');

// Create a request (Owner/User)
router.post('/', protect, async (req, res) => {
    const { type, targetRestaurantId, data } = req.body;

    // In a real app, verify they own the restaurant if updating

    try {
        const request = await RestaurantRequest.create({
            userId: req.user._id,
            type,
            targetRestaurantId,
            data,
        });
        res.status(201).json(request);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

// List requests (Admin)
router.get('/', protect, admin, async (req, res) => {
    // Populate user info to see who made the request
    const requests = await RestaurantRequest.find({ status: 'pending' }).populate('userId', 'name email');
    res.json(requests);
});

// Approve Request (Admin)
router.post('/:id/approve', protect, admin, async (req, res) => {
    const request = await RestaurantRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.status !== 'pending') return res.status(400).json({ message: 'Request already processed' });

    try {
        if (request.type === 'update') {
            const restaurant = await Restaurant.findOne({ id: request.targetRestaurantId });
            if (restaurant) {
                // Merge top-level updates (simplified)
                Object.assign(restaurant, request.data);
                await restaurant.save();
            } else {
                return res.status(404).json({ message: "Target restaurant not found" });
            }
        } else if (request.type === 'create') {
            await Restaurant.create(request.data);
        }

        request.status = 'approved';
        await request.save();

        res.json({ message: 'Request approved' });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// Reject Request (Admin)
router.post('/:id/reject', protect, admin, async (req, res) => {
    const request = await RestaurantRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'rejected';
    await request.save();
    res.json({ message: 'Request rejected' });
});

module.exports = router;
