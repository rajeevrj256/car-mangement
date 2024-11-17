import mongoose from "mongoose";
import connectDB from "../utils/db_connect.js";

// Connect to the database
connectDB();

// Define user schema
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    googleId: { type: String, required: true, unique: true },
    verifiedEmail: { type: Boolean, required: true },
    picture: { type: String },
});

// Create user model
const User = mongoose.model("User", UserSchema);

// User authentication route handler
export const userAuthHandler = async (req, res) => {
    const { name, email, googleId, verifiedEmail, picture } = req.body;

    if (!name || !email || !googleId || verifiedEmail === undefined || !picture) {
        return res.status(400).json({ message: "Missing required fields in request body" });
    }

    try {
        // Check if the user already exists in the database by email or Google ID
        let user = await User.findOne({ googleId });
        if (!user) {
            // If the user doesn't exist, create a new one
            user = new User({ name, email, googleId, verifiedEmail, picture });
            await user.save();
        }

        // Respond with success and user information
        res.status(200).json({ message: "User authenticated", user });
    } catch (error) {
        console.error("Error authenticating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Export handler
export default userAuthHandler;
