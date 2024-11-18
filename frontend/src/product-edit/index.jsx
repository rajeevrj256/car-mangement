import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = "https://car-mangement.onrender.com/api/user/product";

const ProductEdit = () => {
  const { id } = useParams(); // Product ID from the URL
  const [product, setProduct] = useState({
    ProductName: "",
    Description: "",
    CarModel: "",
    NumberPlate: "",
    picture: [],
  }); // Initial product state
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // To redirect after saving

  const userData = JSON.parse(localStorage.getItem("user"));
  const googleId = userData ? userData.id : null;

  // Fetch the product details when the component loads
  useEffect(() => {
    if (!googleId) return; // Prevent fetch if googleId is missing
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/${googleId}/${id}`);
        const data = await response.json();
        if (data?.products?.length > 0) {
          setProduct(data.products[0]);
        } else {
          setProduct(null); // Handle error by setting product to null
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, googleId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  // Handle form submission to save updated data
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/${googleId}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Product details updated successfully!");
        navigate(`/product-details/${id}`); // Redirect to the product details page
      } else {
        alert("Failed to update product details.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("An error occurred while updating product details.");
    }
  };

  if (isLoading) {
    return <p>Loading...</p>; // Show loading state while fetching data
  }

  if (!product) {
    return <p>No product details available.</p>; // Display a message if no product is found
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-semibold mb-6">Edit Product Details</h2>
      <form onSubmit={handleSaveChanges} className="space-y-6 bg-white p-6 rounded shadow-lg">
        {/* Product Name */}
        <div>
          <label htmlFor="ProductName" className="block text-lg font-medium">
            Product Name
          </label>
          <input
            type="text"
            id="ProductName"
            name="ProductName"
            value={product.ProductName}
            onChange={handleInputChange}
            className="mt-2 p-3 w-full border rounded-md"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="Description" className="block text-lg font-medium">
            Description
          </label>
          <textarea
            id="Description"
            name="Description"
            value={product.Description}
            onChange={handleInputChange}
            className="mt-2 p-3 w-full border rounded-md"
            rows="4"
            required
          />
        </div>

        {/* Car Model */}
        <div>
          <label htmlFor="CarModel" className="block text-lg font-medium">
            Car Model
          </label>
          <input
            type="text"
            id="CarModel"
            name="CarModel"
            value={product.CarModel}
            onChange={handleInputChange}
            className="mt-2 p-3 w-full border rounded-md"
            required
          />
        </div>

        {/* Number Plate */}
        <div>
          <label htmlFor="NumberPlate" className="block text-lg font-medium">
            Number Plate
          </label>
          <input
            type="text"
            id="NumberPlate"
            name="NumberPlate"
            value={product.NumberPlate}
            onChange={handleInputChange}
            className="mt-2 p-3 w-full border rounded-md"
            required
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;
