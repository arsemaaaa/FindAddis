const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all approved restaurants
router.get('/', async (req, res) => {
    try {
        const { sort, search } = req.query;
        let query = { isApproved: true };

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        let restaurants = Restaurant.find(query);

        if (sort === 'rating') {
            restaurants = restaurants.sort({ rating: -1 });
        } else if (sort === 'trending') {
            // Simple trending logic: random or review count. Let's sort by newly created for now
            restaurants = restaurants.sort({ createdAt: -1 });
        }

        const result = await restaurants;
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin: Get pending restaurants
router.get('/pending', protect, admin, async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ isApproved: false });
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new restaurant (Vendor/Admin)
router.post('/', protect, async (req, res) => {
    try {
        const { name, category, price, address, description, location } = req.body;

        // Check if vendor already has a restaurant (optional check, can be relaxed if needed)

        // Generate a custom ID for legacy compatibility if needed
        const baseName = name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'restaurant';
        const generatedId = `${baseName}-${Date.now()}`;

        const restaurantData = {
            name,
            category,
            price,
            address,
            description,
            location,
            menu: req.body.menu,
            owner: req.user._id,
            isApproved: req.user.role === 'admin' ? true : false,
            id: generatedId // Keep for backward compatibility
        };

        const newRestaurant = new Restaurant(restaurantData);
        const savedRestaurant = await newRestaurant.save();

        // Assign REAL MongoDB _id to user for reliable updates
        if (req.user.role === 'restaurant_owner') {
            req.user.managedRestaurantId = savedRestaurant._id;
            await req.user.save();
        }

        res.status(201).json(savedRestaurant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Approve restaurant (Admin)
router.put('/:id/approve', protect, admin, async (req, res) => {
    try {
        // Try finding by _id first (modern), then fallback to custom id (legacy)
        let restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            restaurant = await Restaurant.findOne({ id: req.params.id });
        }

        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

        restaurant.isApproved = true;
        await restaurant.save();
        res.json(restaurant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Get single restaurant by _id or custom ID
router.get('/:id', async (req, res) => {
    try {
        let restaurant = await Restaurant.findById(req.params.id).catch(() => null);
        if (!restaurant) {
            restaurant = await Restaurant.findOne({ id: req.params.id });
        }

        if (restaurant) {
            res.json(restaurant);
        } else {
            res.status(404).json({ message: 'Restaurant not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Update restaurant by _id or custom ID (Owner or Admin)
router.put('/:id', protect, async (req, res) => {
    try {
        let restaurant = await Restaurant.findById(req.params.id).catch(() => null);
        if (!restaurant) {
            restaurant = await Restaurant.findOne({ id: req.params.id });
        }

        if (restaurant) {
            // Check ownership
            if (req.user.role !== 'admin' && restaurant.owner && restaurant.owner.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to edit this restaurant' });
            }

            Object.assign(restaurant, req.body);
            const updatedRestaurant = await restaurant.save();
            res.json(updatedRestaurant);
        } else {
            res.status(404).json({ message: 'Restaurant not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete restaurant (Admin only for now, or Owner)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        let restaurant = await Restaurant.findByIdAndDelete(req.params.id).catch(() => null);
        if (!restaurant) {
            restaurant = await Restaurant.findOneAndDelete({ id: req.params.id });
        }
        res.json({ message: 'Restaurant removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Add a review (User only)
router.post('/:id/reviews', protect, async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ id: req.params.id });
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const review = {
            user: req.user.name, // Use authenticated user name
            rating: Number(req.body.rating),
            text: req.body.text,
            date: new Date().toISOString().split('T')[0],
            id: req.body.id || Math.random().toString(36).substr(2, 9),
            userId: req.user._id
        };

        restaurant.reviews.push(review);
        await restaurant.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a review 
router.put('/:id/reviews/:reviewId', protect, async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ id: req.params.id });
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const reviewIndex = restaurant.reviews.findIndex(r => r.id === req.params.reviewId || r._id.toString() === req.params.reviewId);

        if (reviewIndex === -1) {
            return res.status(404).json({ message: 'Review not found' });
        }

        const review = restaurant.reviews[reviewIndex];
        // Check permissions: Admin or Review Author
        const isAuthor = (review.userId && review.userId.toString() === req.user._id.toString()) || review.user === req.user.name;
        if (req.user.role !== 'admin' && !isAuthor) {
            return res.status(401).json({ message: 'Not authorized to edit this review' });
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

// Delete a review (Admin or Author)
router.delete('/:id/reviews/:reviewId', protect, async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ id: req.params.id });
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Find review to check permissions before deleting
        const review = restaurant.reviews.find(r => r.id === req.params.reviewId || r._id.toString() === req.params.reviewId);

        if (review) {
            const isAuthor = (review.userId && review.userId.toString() === req.user._id.toString()) || review.user === req.user.name;
            if (req.user.role !== 'admin' && !isAuthor) {
                return res.status(401).json({ message: 'Not authorized to delete this review' });
            }
        }

        restaurant.reviews = restaurant.reviews.filter(r => r.id !== req.params.reviewId && r._id.toString() !== req.params.reviewId);
        await restaurant.save();
        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
