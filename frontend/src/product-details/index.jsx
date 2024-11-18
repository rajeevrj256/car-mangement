import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = "https://car-mangement.onrender.com/api/user/product";

const ProductDetails = () => {
  const { id } = useParams(); // Product ID from the URL
  const navigate = useNavigate(); // Navigation for redirection
  const [product, setProduct] = useState({ picture: [] }); // Initial product state
  const [isEditing, setIsEditing] = useState(false); // Manage editing mode
  const [updatedProduct, setUpdatedProduct] = useState({
    ProductName: "",
    Description: "",
    CarModel: "",
    NumberPlate: "",
  });

  const userData = JSON.parse(localStorage.getItem("user"));
  const googleId = userData ? userData.id : null;

  // Fetch product details by ID
  useEffect(() => {
    if (!googleId) return; // Prevent fetch if googleId is missing
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/${googleId}/${id}`);
        const data = await response.json();
        setProduct(data);
        setUpdatedProduct({
          ProductName: data.ProductName || "",
          Description: data.Description || "",
          CarModel: data.CarModel || "",
          NumberPlate: data.NumberPlate || "",
        });
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [id, googleId]);

  // Save edits to the product
  const handleSave = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/${googleId}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });
      const data = await response.json();
      setProduct(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // Delete the product
  const handleDelete = async () => {
    try {
      await fetch(`${API_BASE_URL}/${googleId}/${id}`, { method: "DELETE" });
      navigate("/product-list"); // Redirect after deletion
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Handle input changes during editing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({ ...prev, [name]: value }));
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">
        {isEditing ? "Edit Product" : "Product Details"}
      </h2>

      {/* Product Details */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="w-full md:w-2/3">
            {isEditing ? (
              <>
                {["ProductName", "Description", "CarModel", "NumberPlate"].map(
                  (field, index) => (
                    <div key={index} className="mb-4">
                      <label className="block mb-2 capitalize">{field}</label>
                      <input
                        type="text"
                        name={field}
                        value={updatedProduct[field]}
                        onChange={handleChange}
                        className="border p-2 w-full"
                      />
                    </div>
                  )
                )}
              </>
            ) : (
              <>
                <p><strong>Product Name:</strong> {product.ProductName}</p>
                <p><strong>Description:</strong> {product.Description}</p>
                <p><strong>Car Model:</strong> {product.CarModel}</p>
                <p><strong>Number Plate:</strong> {product.NumberPlate}</p>
              </>
            )}
          </div>

          {/* Product Images */}
          <div className="w-full md:w-1/3 space-y-4">
            {product.picture?.length > 0 ? (
              product.picture.map((img, index) => (
                <a
                  key={index}
                  href={img}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={img}
                    alt={`Car Image ${index + 1}`}
                    className="object-cover w-full h-32 mb-4 rounded-md shadow-md"
                  />
                </a>
              ))
            ) : (
              <p>No pictures available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-between">
        <div className="flex space-x-4">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Edit
            </button>
          )}
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
