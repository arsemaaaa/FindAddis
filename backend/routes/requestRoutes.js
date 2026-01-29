const express = require('express');
const router = express.Router();
const RestaurantRequest = require('../models/RestaurantRequest');
const Restaurant = require('../models/Restaurant');
const { protect, admin } = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

// Create a request (Owner/User)
router.post('/', protect, async (req, res) => {
    const { type, target, data } = req.body;

    try {
        const request = await RestaurantRequest.create({
            userId: req.user._id,
            type: type.toUpperCase(),
            target,
            data,
        });
        res.status(201).json(request);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

// List requests (Admin)
router.get('/', protect, admin, async (req, res) => {
    const requests = await RestaurantRequest.find({ status: 'PENDING' }).populate('userId', 'name email');
    res.json(requests);
});

// Approve Request (Admin)
router.post('/:id/approve', protect, admin, async (req, res) => {
    const request = await RestaurantRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.status !== 'PENDING') return res.status(400).json({ message: 'Request already processed' });

    try {
        if (request.type === 'UPDATE') {
            const restaurant = await Restaurant.findById(request.target);
            if (restaurant) {
                Object.assign(restaurant, request.data);
                await restaurant.save();
            } else {
                return res.status(404).json({ message: "Target restaurant not found" });
            }
        } else if (request.type === 'CREATE') {
            const restaurantData = {
                ...request.data,
                owner: request.userId,
                isApproved: true
            };
            const newRest = await Restaurant.create(restaurantData);

            // Link to user
            const User = require('../models/User');
            await User.findByIdAndUpdate(request.userId, { managedRestaurantId: newRest._id });
        }

        request.status = 'APPROVED';
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

    request.status = 'REJECTED';
    await request.save();
    res.json({ message: 'Request rejected' });
});

module.exports = router;
