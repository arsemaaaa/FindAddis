import User from '../models/User.js'
import { Router } from 'express'
import bcrypt from "bcryptjs"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import SendEmail from '../utils/Mailer.js'
import userAuthmiddleware from "../middleware/UserAuthMiddleware.js"
const router = Router();


router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ error: err.message });

    }
})

//register user
router.post('/', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email: email })
        if (existingUser) {
            res.status(409).json({ msg: 'Email already in use' });
            return;
        }
        const token = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const verificationExpiry = Date.now() + 1000 * 60 * 60; //1hour

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ name, email, password: hashedPassword, token: hashedToken, emailVerificationExpiry: verificationExpiry });
        await newUser.save();

        //send token to users Email
        const verificationLink = "http://localhost:3000/api/users/verify?token=" + token + "&email=" + email;
        try {
            SendEmail(process.env.EMAIL, newUser.email, 'verify findAddis account', verificationLink)
            res.status(201).json({ message: "User registered successfully. Please verify your email using the link sent to your account" });
        } catch (err) {
            res.status(500).send({ msg: 'Unable to send verification email to user' })
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

})

router.get('/verify', async (req, res) => {
    const email = req.query.email
    const token = req.query.token;
    if (!token || !email) {
        res.status(400).json({ msg: 'please provide both email and token' })
        return;
    }
    const unverifiedUser = await User.findOne({ email })
    if (!unverifiedUser) {
        res.status(404).json({ msg: 'user not found' })
        return;
    }
    if (unverifiedUser.isVerified) {
        res.status(400).json({ msg: 'user already verified' })
        return;
    }
    if (unverifiedUser.emailVerificationExpiry < Date.now()) {
        res.status(400).json({ msg: 'verification link expired' })
        return;
    }
    const tokenToverify = unverifiedUser.token;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    if (tokenToverify != hashedToken) {
        res.status(400).json({ msg: 'invalid token requested' })
        return;
    }

    // verify user
    const verifyUser = { isVerified: true, token: null }
    await User.findByIdAndUpdate(unverifiedUser.id, { $set: verifyUser }, { new: true })
    res.status(200).json({ msg: 'user successfully verified' })
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if (!user) {
        res.status(404).json({ msg: 'user not found,please signup first' })
        return;
    }
    const storedPassword = user.password
    const ismatch = await bcrypt.compare(password, storedPassword)

    if (!ismatch) {
        res.status(400).json({ msg: 'incorrect email or password' })
        return;
    }
    if (!user.isVerified) {
        res.status(400).json({ msg: 'please verify your email to login' })
        return;
    }
    const token = jwt.sign(
        { id: user._id, name: user.name, email: user.email, role: "user" },
        process.env.JWT_SECRET,
        { expiresIn: process.env.EXPIRESIN })
    res.status(200).json({ token, expiresIn: process.env.EXPIRESIN })


})

// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email })
//     if (!user) return res.status(404).json({ msg: 'user not found' });

//     const isMatch = await bcrypt.compare(password, user.password)
//     if (!isMatch) return res.status(400).json({ msg: 'incorrect email or password' });
//     if (!user.isVerified) return res.status(400).json({ msg: 'please verify your email' });

//     const token = jwt.sign(
//         { id: user._id, name: user.name, email: user.email, role: "user" },
//         process.env.JWT_SECRET,
//         { expiresIn: process.env.EXPIRESIN }
//     );

//     res.status(200).json({
//         user: {
//             id: user._id,
//             name: user.name,
//             email: user.email,
//             role: "user"
//         },
//         token,
//         expiresIn: process.env.EXPIRESIN
//     });
// });


router.post("/favorites/:restaurantId", userAuthmiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const restaurantId = req.params.restaurantId;

        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { favorites: restaurantId } },
            { new: true }
        ).populate("favorites");

        res.status(200).json(user.favorites);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});




export default router;