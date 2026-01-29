import mongoose from 'mongoose'



const connectdb = async () => {
  try {
    await mongoose.connect(process.env.URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};


export default connectdb;