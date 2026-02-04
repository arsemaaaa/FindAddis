import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';


const restaurantOwnerSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: [{ type: String, required: true }],
    isVerified: { type: Boolean, default: false },
    emailVerificationExpiry: { type: Date },
    token: { type: String },
    restaurantsOwned: [{ type: mongoose.Schema.Types.ObjectId, ref: "restaurants" }]
}, { timestamps: true });


const RestaurantOwners = mongoose.model('owners', restaurantOwnerSchema);
export default RestaurantOwners;