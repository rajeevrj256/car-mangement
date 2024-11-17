import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook from React Router

// Example of the API endpoint to get the products (cars)
const API_URL = "https://car-mangement.onrender.com/api/user/product"; // Replace with your actual backend API URL

function ProductList() {
  const [cars, setCars] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Fetch cars data from the backend when the component mounts
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const fetchCars = async () => {
      const googleId = userData ? userData.id : null;
      if (!googleId) return; // Handle case when googleId is null
      try {
        const response = await fetch(`${API_URL}/${googleId}`);
        const data = await response.json();
        console.log("API Response:", data); // Log the raw API response
        setCars(data.products); // Store the products in state
      } catch (error) {
        console.error("Error fetching car data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Display the raw cars data or loading message
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Product List</h2>

      {/* Loading state */}
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : (
        // Display the car details
        <div>
          {cars.length > 0 ? (
            cars.map((car) => (
              <div
                key={car._id}
                className="border-b pb-6 mb-6 flex justify-between hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate(`/product-details/${car._id}`)} // Redirect on click
              >
                {/* Left Side: Car Details */}
                <div className="flex-1 pr-6">
                  <h3 className="text-xl font-medium text-gray-800">{car.ProductName}</h3>
                  <p className="text-gray-600">Description: {car.Description}</p>
                  <p className="text-gray-600">Car Model: {car.CarModel}</p>
                  <p className="text-gray-600">Number Plate: {car.NumberPlate}</p>
                </div>

                {/* Right Side: Horizontal Photos */}
                <div className="flex space-x-4 w-1/3">
                  {car.picture && car.picture.length > 0 ? (
                    car.picture.map((img, index) => (
                      <a
                        key={index}
                        href={img}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-24 h-24 overflow-hidden rounded-md shadow-md"
                      >
                        <img
                          src={img}
                          alt={`Car Image ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </a>
                    ))
                  ) : (
                    <p className="text-gray-600">No images available</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No cars found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductList;
