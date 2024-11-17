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

/**
 * @swagger
 * /api/user/product:
 *   post:
 *     summary: Create a new product
 *     description: Adds a new product to the database.
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               googleId:
 *                 type: string
 *               ProductName:
 *                 type: string
 *               Description:
 *                 type: string
 *               CarModel:
 *                 type: string
 *               NumberPlate:
 *                 type: string
 *               picture:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - googleId
 *               - ProductName
 *               - Description
 *               - CarModel
 *               - NumberPlate
 *               - picture
 *     responses:
 *       201:
 *         description: Product saved successfully
 *       400:
 *         description: Bad request (missing fields)
 *       500:
 *         description: Server error while saving the product
 */

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

/**
 * @swagger
 * /api/user/product/{googleId}:
 *   get:
 *     summary: Get products by Google ID
 *     description: Fetches all products associated with a specific Google ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: googleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The Google ID of the user
 *     responses:
 *       200:
 *         description: List of products
 *       404:
 *         description: No products found for this Google ID
 *       500:
 *         description: Server error while fetching products
 */
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
/**
 * @swagger
 * /api/user/product/{googleId}/{id}:
 *   get:
 *     summary: Get a product by its ID and Google ID
 *     description: Fetches a specific product based on its ID and associated Google ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: googleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The Google ID of the user
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product
 *     responses:
 *       200:
 *         description: The product with the specified ID
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error while fetching the product
 */

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
/**
 * @swagger
 * /api/user/product/{googleId}/{id}:
 *   put:
 *     summary: Update a product by its ID and Google ID
 *     description: Updates an existing product based on its ID and associated Google ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: googleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The Google ID of the user
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ProductName:
 *                 type: string
 *               Description:
 *                 type: string
 *               CarModel:
 *                 type: string
 *               NumberPlate:
 *                 type: string
 *               picture:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found or Google ID does not match
 *       500:
 *         description: Server error while updating the product
 */


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

/**
 * @swagger
 * /api/user/product/{googleId}/{id}:
 *   delete:
 *     summary: Delete a product by its ID and Google ID
 *     description: Deletes a specific product based on its ID and associated Google ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: googleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The Google ID of the user
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found or Google ID does not match
 *       500:
 *         description: Server error while deleting the product
 */

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



