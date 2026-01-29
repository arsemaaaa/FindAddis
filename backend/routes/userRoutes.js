const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

router.post('/register', async (req, res) => {
    const { name, email, password, role, adminSecret } = req.body;

    // Secure Admin Registration
    if (role === 'admin' && adminSecret !== 'admin123') {
        return res.status(400).json({ message: 'Invalid Admin Secret' });
    }

    // Secure Vendor Registration
    if (role === 'restaurant_owner' && adminSecret !== 'vendor123') { // re-using adminSecret field for simplicity or add a new field
        // Wait, the form might send it as adminSecret or we should check a new field.
        // Simple solution: check adminSecret for both, distinguishing by role.
        return res.status(400).json({ message: 'Invalid Vendor Secret' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            managedRestaurantId: user.managedRestaurantId,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

router.get('/profile', protect, async (req, res) => {
    res.json(req.user);
});

// Get User Favorites
router.get('/favorites', protect, async (req, res) => {
    // req.user is already populated by protect middleware
    res.json(req.user.favorites || []);
});

// Add Favorite
router.post('/favorites/:restaurantId', protect, async (req, res) => {
    const { restaurantId } = req.params;
    const user = req.user;

    if (!user.favorites.includes(restaurantId)) {
        user.favorites.push(restaurantId);
        await user.save();
    }
    res.json(user.favorites);
});

// Remove Favorite
router.delete('/favorites/:restaurantId', protect, async (req, res) => {
    const { restaurantId } = req.params;
    const user = req.user;

    user.favorites = user.favorites.filter(id => id !== restaurantId);
    await user.save();
    res.json(user.favorites);
});


module.exports = router;
