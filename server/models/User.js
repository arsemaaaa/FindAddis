import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const favoriteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    createdAt: { type: Date, default: Date.now }
});


const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    token: { type: String },
    emailVerificationExpiry: { type: Date },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "restaurants" }]
}, { timestamps: true });

const User = mongoose.model('users', userSchema);
export default User;