import { Router } from 'express'
import bcrypt from "bcryptjs"
import crypto from "crypto"
import SendEmail from '../utils/Mailer.js';
import RestaurantOwners from '../models/RestaurantOwner.js'
import ownerAuthMiddleware from '../middleware/ownerAuthMiddleware.js';
import jwt from 'jsonwebtoken'
const router = Router();

//owners signup
router.post('/', async (req, res) => {
    const { name, email, password, phoneNumber } = req.body;
    try {
        const ownerExists = await RestaurantOwners.findOne({ email });
        if (ownerExists) {
            res.status(409).json({ msg: 'Email already in use' });
            return;
        }
        const token = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const verificationExpiry = Date.now() + 1000 * 60 * 60;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newOwner = new RestaurantOwners({ name, email, password: hashedPassword, phoneNumber, token: hashedToken, emailVerificationExpiry: verificationExpiry });
        await newOwner.save();

        const verificationLink = "http://localhost:3000/api/owners/verify?token=" + token + "&email=" + email;
        try {
            SendEmail(process.env.EMAIL, newOwner.email, 'verify findAddis account', verificationLink)
            res.status(201).json({ message: "Restaurant Owner registered successfully. Please verify your email using the link sent to your account" });

        } catch (err) {
            console.log("error", err)
            res.status(500).send({ msg: 'Unable to send verification email to Owner' })
        }
    } catch (err) {
        res.status(500).json({ error: err.message });

    }
})
//owners verifying
router.get('/verify', async (req, res) => {
    const email = req.query.email
    const token = req.query.token;
    if (!token || !email) {
        res.status(400).json({ msg: 'please provide both email and token' })
        return;
    }
    const unverifiedOwner = await RestaurantOwners.findOne({ email })
    if (!unverifiedOwner) {
        res.status(404).send({ msg: 'owner not found' })
    }
    if (unverifiedOwner.isVerified) {
        res.status(400).json({ msg: 'owner account already verified' })
        return;
    }
    if (unverifiedOwner.emailVerificationExpiry < Date.now()) {
        res.status(400).json({ msg: 'verification link expired' })
        return;
    }
    const tokenToverify = unverifiedOwner.token;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    if (tokenToverify != hashedToken) {
        res.status(400).json({ msg: 'invalid token requested' })
        return;
    }

    // verify user
    const verifyOwner = { isVerified: true, token: null }
    await RestaurantOwners.findByIdAndUpdate(unverifiedOwner.id, { $set: verifyOwner }, { new: true })
    res.status(200).json({ msg: 'Owner successfully verified' })
})

//owners login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const owner = await RestaurantOwners.findOne({ email })
    if (!owner) {
        res.status(404).json({ msg: 'account not found,please signup first' })
        return;
    }
    const storedPassword = owner.password
    const ismatch = await bcrypt.compare(password, storedPassword)

    if (!ismatch) {
        res.status(400).json({ msg: 'incorrect email or password' })
        return;
    }
    if (!owner.isVerified) {
        res.status(400).json({ msg: 'please verify your email to login' })
        return;
    }
    const token = jwt.sign(
        { id: owner._id, name: owner.name, email: owner.email, restaurantsOwned: owner.restaurantsOwned, role: 'owner' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.EXPIRESIN })
    res.status(200).json({ token, expiresIn: process.env.EXPIRESIN })


})

// get owner's restaurant
router.get("/restaurants", ownerAuthMiddleware, async (req, res) => {
    try {
        if (req.owner.role !== "owner") {
            return res.status(400).send({ msg: "Operation not allowed" });
        }

        // Get owner Restaurant
        const ownerRestaurants = await RestaurantOwners.findById(req.owner.id).populate('restaurantsOwned')
        // Return restaurantsOwned array or empty array if none
        res.status(200).json(ownerRestaurants?.restaurantsOwned || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default router;