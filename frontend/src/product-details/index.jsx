import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate(); // Use navigate hook for redirection
  const [product, setProduct] = useState(null); // State to hold product data
  const [isEditing, setIsEditing] = useState(false); // State to manage editing mode
  const [updatedProduct, setUpdatedProduct] = useState({
    ProductName: '',
    Description: '',
    CarModel: '',
    NumberPlate: '',
  });

  const userData = JSON.parse(localStorage.getItem("user"));
  const googleId = userData ? userData.id : null;

  // Fetch product details by ID
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
    
        const response = await fetch(`https://car-mangement.onrender.com/api/user/product/${googleId}/${id}`);
        const data = await response.json();
        setProduct(data);
        setUpdatedProduct({
          ProductName: data.ProductName,
          Description: data.Description,
          CarModel: data.CarModel,
          NumberPlate: data.NumberPlate,
        });
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [id]);

  // Handle Save Edits
  const handleSave = async () => {
    try {
      const googleId = "your_google_id_here"; // Replace with actual googleId
      const response = await fetch(`https://car-mangement.onrender.com/api/user/product/${googleId}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });
      const data = await response.json();
      setProduct(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // Handle Delete Product
  const handleDelete = async () => {
    try {
      
      await fetch(`https://car-mangement.onrender.com/api/user/product/${googleId}/${id}`, {
        method: 'DELETE',
      });
      navigate(`/product/display/${id}`); // Redirect to product list after deletion
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Handle Change in Editable Fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">{isEditing ? "Edit Product" : "Product Details"}</h2>

      {/* Product Details */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="w-full md:w-2/3">
            {isEditing ? (
              <div>
                <label className="block mb-2">Product Name</label>
                <input
                  type="text"
                  name="ProductName"
                  value={updatedProduct.ProductName}
                  onChange={handleChange}
                  className="border p-2 w-full mb-4"
                />

                <label className="block mb-2">Description</label>
                <input
                  type="text"
                  name="Description"
                  value={updatedProduct.Description}
                  onChange={handleChange}
                  className="border p-2 w-full mb-4"
                />

                <label className="block mb-2">Car Model</label>
                <input
                  type="text"
                  name="CarModel"
                  value={updatedProduct.CarModel}
                  onChange={handleChange}
                  className="border p-2 w-full mb-4"
                />

                <label className="block mb-2">Number Plate</label>
                <input
                  type="text"
                  name="NumberPlate"
                  value={updatedProduct.NumberPlate}
                  onChange={handleChange}
                  className="border p-2 w-full mb-4"
                />
              </div>
            ) : (
              <div>
                <p><strong>Product Name:</strong> {product.ProductName}</p>
                <p><strong>Description:</strong> {product.Description}</p>
                <p><strong>Car Model:</strong> {product.CarModel}</p>
                <p><strong>Number Plate:</strong> {product.NumberPlate}</p>
              </div>
            )}
          </div>

          {/* Product Images */}
          <div className="w-full md:w-1/3 space-y-4">
            {product.picture.map((img, index) => (
              <a key={index} href={img} target="_blank" rel="noopener noreferrer">
                <img src={img} alt={`Car Image ${index + 1}`} className="object-cover w-full h-32 mb-4 rounded-md shadow-md" />
              </a>
            ))}
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
