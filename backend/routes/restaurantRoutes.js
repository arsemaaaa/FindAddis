const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// Get all restaurants
router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.find({});
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single restaurant by custom ID
router.get('/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ id: req.params.id });
        if (restaurant) {
            res.json(restaurant);
        } else {
            res.status(404).json({ message: 'Restaurant not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a review
router.post('/:id/reviews', async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ id: req.params.id });
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const review = {
            user: req.body.user || "Anonymous",
            rating: Number(req.body.rating),
            text: req.body.text,
            date: new Date().toISOString().split('T')[0],
            // Create a simple random ID if not provided, though Mongoose creates _id
            id: req.body.id || Math.random().toString(36).substr(2, 9)
        };

        restaurant.reviews.push(review);
        await restaurant.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a review 
router.put('/:id/reviews/:reviewId', async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ id: req.params.id });
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const reviewIndex = restaurant.reviews.findIndex(r => r.id === req.params.reviewId || r._id.toString() === req.params.reviewId);

        if (reviewIndex === -1) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Update fields
        if (req.body.text) restaurant.reviews[reviewIndex].text = req.body.text;
        if (req.body.rating) restaurant.reviews[reviewIndex].rating = req.body.rating;

        await restaurant.save();
        res.json(restaurant.reviews[reviewIndex]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a review
router.delete('/:id/reviews/:reviewId', async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ id: req.params.id });
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        restaurant.reviews = restaurant.reviews.filter(r => r.id !== req.params.reviewId && r._id.toString() !== req.params.reviewId);
        await restaurant.save();
        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
