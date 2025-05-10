import { useContext, useState, useEffect } from "react";
import { getProfileImageUrl } from "../utils/constants";
import { FaCamera, FaUser } from "react-icons/fa";
import AuthContext from "../context/AuthContext";
import api from "../config/axios";
import UserPosts from "../components/posts/UserPosts";

export default function ProfilePage() {
  const { currentUser, logout } = useContext(AuthContext);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    let timer;
    if (successMessage || uploadError) {
      timer = setTimeout(() => {
        setSuccessMessage(null);
        setUploadError(null);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [successMessage, uploadError]);

  async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setUploadError(
        "Please select a vaild image file (JPG, PNG, JPEG, or GIF)"
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size should be less than 5MB");
    }

    try {
      setIsUploading(true);
      setUploadError(null);

      const formData = new FormData();
      formData.append("profileImage", file);

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await api.put("/auth/profile-image", formData, config);
      if (response.data.success) {
        currentUser.profileImage = response.data.profileImage;
        setSuccessMessage("Profile image uploaded successfully");
      }
    } catch (error) {
      setUploadError(
        error.response || "Error uploading image, please try again."
      );
    } finally {
      setIsUploading(false);
    }
  }

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {successMessage && (
          <div className="bg-green-100 border border-gray-400 text-green-700 px-4 py-3 rounded mb-4">
            <p>{successMessage}</p>
          </div>
        )}

        {uploadError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{uploadError}</p>
          </div>
        )}
        <div className="bg-white shadow rounded-lg">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32"></div>

          <div className="p-6 relative">
            <div className="absolute -top-16 left-6">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden text-gray-400">
                {currentUser.profileImage &&
                currentUser.profileImage !== "default-profile.jpg" ? (
                  <img
                    src={getProfileImageUrl(currentUser.profileImage)}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="h-20 w-20" />
                )}
              </div>

              <label
                htmlFor="profile-image-upload"
                className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full cursor-pointer p-2"
              >
                <FaCamera className="h-4 w-4" />
                <input
                  type="file"
                  id="profile-image-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </label>
            </div>

            <div className="mt-16">
              <h1 className="text-2xl font-bold text-gray-900">
                {currentUser.name}
              </h1>
              <p className="text-gray-600">
                {currentUser.city}, {currentUser.country}
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                  {currentUser.languages &&
                    currentUser.languages.map((lang, index) => (
                      <span key={index}>{lang}, </span>
                    ))}
                </span>
              </div>

              <div className="mt-4">
                <h2 className="text-gray-700 font-semibold mb-2">About Me:</h2>
                <p className="text-gray-600">{currentUser.bio}</p>
              </div>

              <div className="mt-6">
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>

        <UserPosts />
      </div>
    </div>
  );
}
