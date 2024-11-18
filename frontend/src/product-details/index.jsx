import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_BASE_URL = "https://car-mangement.onrender.com/api/user/product";

const ProductDetails = () => {
  const { id } = useParams(); // Product ID from the URL
  const [product, setProduct] = useState(null); // Initial product state

  const userData = JSON.parse(localStorage.getItem("user"));
  const googleId = userData ? userData.id : null;

  // Fetch product details by ID
  useEffect(() => {
    if (!googleId) return; // Prevent fetch if googleId is missing
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/${googleId}/${id}`);
        const data = await response.json();

        // Extract the first product from the response
        if (data?.products?.length > 0) {
          setProduct(data.products[0]);
        } else {
          setProduct(null); // Set null if no product is found
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        setProduct(null); // Handle error by setting product to null
      }
    };

    fetchProductDetails();
  }, [id, googleId]);

  if (!product) {
    return <p>No product details available.</p>; // Display a message if product is null
  }

  return (
    <div className="w-full h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Left Side: Product Details */}
      <div className="w-full md:w-1/2 p-6 bg-white overflow-auto">
        <h2 className="text-3xl font-semibold mb-6">Product Details</h2>
        <div className="space-y-4">
          <p><strong>Product Name:</strong> {product.ProductName || "N/A"}</p>
          <p><strong>Description:</strong> {product.Description || "N/A"}</p>
          <p><strong>Car Model:</strong> {product.CarModel || "N/A"}</p>
          <p><strong>Number Plate:</strong> {product.NumberPlate || "N/A"}</p>
        </div>
      </div>

      {/* Right Side: Images */}
      <div className="w-full md:w-1/2 p-6 bg-white overflow-auto">
        <h2 className="text-3xl font-semibold mb-6">Images</h2>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
          {product.picture && product.picture.length > 0 ? (
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
                  className="object-cover w-full h-72 rounded-md shadow-md"
                />
              </a>
            ))
          ) : (
            <p className="col-span-2">No pictures available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
