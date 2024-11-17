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

/**
 * @swagger
 * /user/auth:
 *   post:
 *     summary: Authenticate or register a user using Google credentials
 *     description: Creates a new user if they don't exist, or returns the existing user if they do.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the user.
 *               email:
 *                 type: string
 *                 description: Email of the user.
 *               googleId:
 *                 type: string
 *                 description: Google ID of the user.
 *               verifiedEmail:
 *                 type: boolean
 *                 description: Whether the email is verified by Google.
 *               picture:
 *                 type: string
 *                 description: URL of the user's profile picture.
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     googleId:
 *                       type: string
 *                     verifiedEmail:
 *                       type: boolean
 *                     picture:
 *                       type: string
 *       400:
 *         description: Missing required fields in request body
 *       500:
 *         description: Internal server error
 */

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
