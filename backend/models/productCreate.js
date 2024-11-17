import mongoose from "mongoose";
import connectDB from "../utils/db_connect.js";

// Connect to the database
connectDB();

const ProductSchema = new mongoose.Schema({
    googleId: { type: String, required: true }, // Not unique anymore
    ProductName: { type: String, required: true },
    Description: { type: String, required: true },
    CarModel: { type: String, required: true },
    NumberPlate: { type: String, required: true },
    picture: {
        type: [String], // An array of strings to hold picture URLs
        validate: {
            validator: function (value) {
                // Ensure the picture array has no more than 10 URLs
                return value.length <= 10;
            },
            message: 'You can upload a maximum of 10 picture URLs.'
        }
    }
});

// Define the Product model
const Product = mongoose.model("Product", ProductSchema);

// Route handler to save a new product
export const saveproduct = async (req, res) => {
    const { googleId, ProductName, Description, CarModel, NumberPlate, picture } = req.body;

    // Check if all required fields are provided
    if (!googleId || !ProductName || !Description || !CarModel || !NumberPlate || !picture) {
        return res.status(400).json({ message: "Missing required fields in request body" });
    }

    try {
        // Create a new product instance
        const newProduct = new Product({
            googleId,
            ProductName,
            Description,
            CarModel,
            NumberPlate,
            picture
        });

        // Save the new product to the database
        await newProduct.save();

        return res.status(201).json({
            message: "Product saved successfully",
            product: newProduct // Include the saved product object in the response
        });
    } catch (error) {
        console.error("Error saving product:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Server error while saving the product" });
    }
};

// Route handler to fetch products by googleId
export const getProductsByGoogleId = async (req, res) => {
    const { googleId } = req.params;

    try {
        // Find all products associated with the provided googleId
        const products = await Product.find({ googleId });

        // If no products are found, return a 404 error
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found for this Google ID" });
        }

        // Return the found products
        return res.status(200).json({ products });
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ message: "Server error while fetching products" });
    }
};

export const getProductsById = async (req, res) => {
    const { googleId,id } = req.params;

    try {
        // Find all products associated with the provided googleId
        const products = await Product.find({_id: id, googleId });

        // If no products are found, return a 404 error
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found for this Google ID" });
        }

        // Return the found products
        return res.status(200).json({ products });
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ message: "Server error while fetching products" });
    }
};



export const updateProduct = async (req, res) => {
    const { googleId, id } = req.params;  // Get googleId and product _id from URL params
    const { ProductName, Description, CarModel, NumberPlate, picture } = req.body;

    try {
        // Find the product by _id and ensure that the googleId matches the logged-in user
        const product = await Product.findOne({ _id: id, googleId });

        // If product is not found or googleId doesn't match, return an error
        if (!product) {
            return res.status(404).json({ message: "Product not found or Google ID does not match" });
        }

        // Update the product fields only if new values are provided
        product.ProductName = ProductName || product.ProductName;
        product.Description = Description || product.Description;
        product.CarModel = CarModel || product.CarModel;
        product.NumberPlate = NumberPlate || product.NumberPlate;
        product.picture = picture || product.picture;

        // Save the updated product
        const updatedProduct = await product.save();

        // Return the updated product
        return res.status(200).json({ message: "Product updated successfully", product: updatedProduct });

    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ message: "Server error while updating product" });
    }
};

export const deleteProduct = async (req, res) => {
    const { googleId, id } = req.params;  // Get googleId and product _id from URL params

    try {
        // Find and delete the product by _id and ensure that the googleId matches the logged-in user
        const product = await Product.findOneAndDelete({ _id: id, googleId });

        // If no product is found or googleId doesn't match, return an error
        if (!product) {
            return res.status(404).json({ message: "Product not found or Google ID does not match" });
        }

        // Return success message
        return res.status(200).json({ message: "Product deleted successfully" });

    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ message: "Server error while deleting product" });
    }
};



