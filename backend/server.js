import express from "express";
import connectDB from "./utils/db_connect.js";
import cors from "cors";
import { userAuthHandler } from "./models/user.js"; 
import { saveproduct, getProductsByGoogleId ,updateProduct,deleteProduct,getProductsById} from "./models/productCreate.js"; 
const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Example Route
app.get("/", (req, res) => res.send("API is running..."));
app.post("/api/auth/google", userAuthHandler);
app.post("/api/user/product", saveproduct);
app.get('/api/user/product/:googleId', getProductsByGoogleId); 
app.get('/api/user/product/:googleId/:id', getProductsById);
app.put("/api/user/product/:googleId/:id", updateProduct);
app.delete("/api/user/product/:googleId/:id", deleteProduct); 
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
