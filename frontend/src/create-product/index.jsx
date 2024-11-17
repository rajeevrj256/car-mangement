import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateProduct() {
  const [formData, setFormData] = useState({
    title: "",
    modelName: "",
    numberPlate: "",
    description: "",
    photos: [], // This should store Cloudinary URLs, not file objects
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.photos.length > 10) {
      alert("You can upload up to 10 photos only.");
      return;
    }

    const uploadedPhotos = await Promise.all(
      files.map(async (file) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset","car_mangement"); 
        data.append("cloud_name", "dliprxpsf"); 

        try {
          const res = await fetch(
            "https://api.cloudinary.com/v1_1/dliprxpsf/image/upload",
            { method: "POST", body: data }
          );
          const result = await res.json();
          console.log(result.secure_url);
          return result.secure_url; // Store only the URL
        } catch (error) {
          console.error("Photo upload failed:", error);
          alert("Failed to upload a photo. Please try again.");
          return null;
        }
      })
    );

    const validPhotos = uploadedPhotos.filter((url) => url); // Remove any failed uploads
    setFormData({ ...formData, photos: [...formData.photos, ...validPhotos] });
  };

  const handleRemovePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const onSubmit = async(e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
        const response = await fetch("https://car-mangement.onrender.com/api/user/product", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            googleId :userData ? userData.id : null,
            ProductName: formData.title,
            Description: formData.description,
            CarModel: formData.modelName,
            NumberPlate: formData.numberPlate,
            picture: formData.photos, // Send the array of Cloudinary URLs
          }),
        });
  
        const result = await response.json();
        if (response.ok) {
          
          navigate("/product-list"); 
          console.log(result);
        } else if(!userData || userData.id == null) {
          alert("Please Login ")
        }else{
          alert("Error creating product: " + result.message);

        }
      } catch (error) {
        console.error("Error creating product:", error);
        alert("Failed to create product. Please try again.");
      }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg"
    >
      <h2 className="text-2xl font-semibold text-center mb-6">Create Product</h2>

      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
          Title:
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter product title"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="modelName"
          className="block text-gray-700 font-medium mb-2"
        >
          Model Name:
        </label>
        <input
          type="text"
          id="modelName"
          name="modelName"
          value={formData.modelName}
          onChange={handleChange}
          placeholder="Enter model name"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="numberPlate"
          className="block text-gray-700 font-medium mb-2"
        >
          Number Plate:
        </label>
        <input
          type="text"
          id="numberPlate"
          name="numberPlate"
          value={formData.numberPlate}
          onChange={handleChange}
          placeholder="Enter number plate"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-gray-700 font-medium mb-2"
        >
          Description:
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter description"
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        ></textarea>
      </div>

      <div className="mb-4">
        <label
          htmlFor="photoUpload"
          className="block text-gray-700 font-medium mb-2"
        >
          Upload Photos (up to 10):
        </label>
        <input
          type="file"
          id="photoUpload"
          name="photoUpload"
          accept="image/*"
          multiple
          onChange={handlePhotoUpload}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {formData.photos.length > 0 && (
          <div className="mt-4">
            <p className="text-gray-700 font-medium mb-2">Uploaded Photos:</p>
            <ul className="list-disc list-inside">
              {formData.photos.map((photo, index) => (
                <li key={index} className="flex items-center justify-between">
                  <a
                    href={photo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Photo
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                    className="text-red-500 hover:text-red-700 font-medium ml-4"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Create Product
      </button>
    </form>
  );
}

export default CreateProduct;
