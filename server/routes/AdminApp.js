import { Router } from 'express';
import Admin from '../models/Admin.js';
import RestaurantRequest from '../models/RestaurantRequest.js';
import { Restaurant } from '../models/Restaurant.js';
import RestaurantOwners from '../models/RestaurantOwner.js';
import adminAuthMiddleware from '../middleware/adminAuthMiddleware.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const route = Router();

// Admin login
route.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find admin by email
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if admin is active
        if (!admin.isActive) {
            return res.status(403).json({ error: 'Admin account is deactivated' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all pending restaurant requests
route.get('/requests/pending', adminAuthMiddleware, async (req, res) => {
    try {
        const pendingRequests = await RestaurantRequest.find({ status: 'pending' })
            .populate('ownerId', 'name email phoneNumber')
            .sort({ createdAt: -1 });

        res.status(200).json(pendingRequests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all restaurant requests (with optional status filter)
route.get('/requests', adminAuthMiddleware, async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};

        const requests = await RestaurantRequest.find(filter)
            .populate('ownerId', 'name email phoneNumber')
            .populate('reviewedBy', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific restaurant request by ID
route.get('/requests/:id', adminAuthMiddleware, async (req, res) => {
    try {
        const request = await RestaurantRequest.findById(req.params.id)
            .populate('ownerId', 'name email phoneNumber')
            .populate('reviewedBy', 'name email');

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        res.status(200).json(request);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Approve a restaurant request
route.post('/requests/:id/approve', adminAuthMiddleware, async (req, res) => {
    try {
        const requestId = req.params.id;
        const adminId = req.admin.id;

        // Find the request
        const request = await RestaurantRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Check if already processed
        if (request.status !== 'pending') {
            return res.status(400).json({ error: `Request already ${request.status}` });
        }

        // Create the restaurant
        const newRestaurant = new Restaurant({
            name: request.name,
            category: request.category,
            price: request.price,
            address: request.address,
            images: request.images || [],
            hours: request.hours,
            description: request.description,
            menu: request.menu || [],
            location: request.location,
            rating: 0,
            reviews: [],
            isApproved: true,
            approvedBy: adminId,
            approvedAt: new Date()
        });

        await newRestaurant.save();

        // Update the owner's restaurant list
        await RestaurantOwners.findByIdAndUpdate(
            request.ownerId,
            { $push: { restaurantsOwned: newRestaurant._id } }
        );

        // Update the request status
        request.status = 'approved';
        request.reviewedBy = adminId;
        request.reviewedAt = new Date();
        request.restaurantId = newRestaurant._id;
        await request.save();

        res.status(200).json({
            message: 'Restaurant approved successfully',
            restaurant: newRestaurant,
            request: request
        });
    } catch (err) {
        console.error("Error in approve route:", err);
        res.status(500).json({ error: err.message });
    }
});

// Reject a restaurant request
route.post('/requests/:id/reject', adminAuthMiddleware, async (req, res) => {
    try {
        const requestId = req.params.id;
        const adminId = req.admin.id;
        const { reason } = req.body;

        // Find the request
        const request = await RestaurantRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Check if already processed
        if (request.status !== 'pending') {
            return res.status(400).json({ error: `Request already ${request.status}` });
        }

        // Update the request status
        request.status = 'rejected';
        request.reviewedBy = adminId;
        request.reviewedAt = new Date();
        request.rejectionReason = reason || 'No reason provided';
        await request.save();

        res.status(200).json({
            message: 'Restaurant request rejected',
            request: request
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get dashboard statistics
route.get('/dashboard/stats', adminAuthMiddleware, async (req, res) => {
    try {
        const [pendingCount, approvedCount, rejectedCount, totalRestaurants] = await Promise.all([
            RestaurantRequest.countDocuments({ status: 'pending' }),
            RestaurantRequest.countDocuments({ status: 'approved' }),
            RestaurantRequest.countDocuments({ status: 'rejected' }),
            Restaurant.countDocuments({ isApproved: true })
        ]);

        res.status(200).json({
            pending: pendingCount,
            approved: approvedCount,
            rejected: rejectedCount,
            totalRestaurants: totalRestaurants
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default route;
