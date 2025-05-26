import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { getProfileImageUrl } from "../utils/constants";
import { FaCamera, FaUser } from "react-icons/fa";
import api from "../config/axios";
import toast from "../utils/toast";
import UserPosts from "../components/posts/UserPosts";

export default function ProfilePage() {
  const { currentUser, logout, updateProfileImage } = useContext(AuthContext);

  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (
      !["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(file.type)
    ) {
      toast.error("Only JPG, PNG, or GIF allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Max image size: 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      setIsUploading(true);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await api.put("/auth/profile-image", formData, config);

      if (res.data.success) {
        toast.success("Image updated!");
        updateProfileImage(res.data.profileImage);
        setPreview(null);
      } else {
        toast.error("Upload failed");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  const imageSrc = preview
    ? preview
    : getProfileImageUrl(currentUser.profileImage);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Header with image */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32 relative">
          <div className="absolute -bottom-12 left-6 flex items-end gap-3">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-gray-100">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <FaUser size={48} />
                </div>
              )}
            </div>

            <label
              htmlFor="upload-image"
              className="bg-white hover:bg-gray-100 text-sm px-3 py-2 rounded shadow cursor-pointer flex items-center gap-1"
            >
              <FaCamera />
              {isUploading ? "Uploading..." : "Change"}
              <input
                type="file"
                id="upload-image"
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setPreview(URL.createObjectURL(file));
                    handleImageUpload(e);
                  }
                }}
                disabled={isUploading}
              />
            </label>
          </div>
        </div>

        {/* User Info */}
        <div className="pt-16 px-6 pb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {currentUser.name}
          </h2>
          <p className="text-gray-600">
            {currentUser.city}, {currentUser.country}
          </p>

          {currentUser.languages?.length > 0 && (
            <div className="mt-2">
              <span className="text-sm font-semibold text-gray-700">
                Languages:
              </span>{" "}
              <span className="text-sm text-gray-600">
                {currentUser.languages.join(", ")}
              </span>
            </div>
          )}

          {currentUser.bio && (
            <div className="mt-4">
              <h3 className="font-semibold text-gray-700 mb-1">About Me</h3>
              <p className="text-gray-600">{currentUser.bio}</p>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="mt-10">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Posts</h3>
        <UserPosts />
      </div>
    </div>
  );
}
