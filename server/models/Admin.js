import mongoose from 'mongoose';

// Admin schema - for managing restaurant approvals
const adminSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Admin = mongoose.model('admins', adminSchema);
export default Admin;
