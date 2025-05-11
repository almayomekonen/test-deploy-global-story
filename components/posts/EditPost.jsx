import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import api from "../../config/axios";

export default function EditPost() {
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    language: "",
  });

  const [currentImage, setCurrentImage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const response = await api.get(`/posts/${id}`);

        if (response.data.success) {
          const post = response.data.data;

          if (currentUser && currentUser._id !== post.user._id) {
            navigate(`/posts/${id}`);
            return;
          }

          setFormData({
            title: post.title,
            content: post.content,
            category: post.category,
            language: post.language,
          });

          setCurrentImage(post.images || []);
        }
      } catch (error) {
        console.error("Error fetching post: ", error);
        setError(
          "Failed to load post. It may have been removed or doesn't exist."
        );
      } finally {
        setLoading(false);
      }
    }

    if (currentUser) {
      fetchPost();
    } else {
      navigate("/login");
    }
  }, [currentUser, id, navigate]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      setError("Title and content are required");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await api.put(`/posts/${id}`, formData, config);

      if (response.data.success) {
        navigate(`/posts/${id}`);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error updating post");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>

        <button
          onClick={() => navigate("/posts")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Back to Posts
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Edit Your Story</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="category"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Culture">Culture</option>
            <option value="Tech">Tech</option>
            <option value="Personal">Personal</option>
            <option value="Learning">Learning</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="language"
          >
            Language
          </label>
          <input
            type="text"
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="content"
          >
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows="6"
            value={formData.content}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          ></textarea>
        </div>

        {/* Display current images without edit functionality */}
        {currentImage.length > 0 && (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Current Images
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {currentImage.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Story image ${index + 1}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Note: Images cannot be modified in this version
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={() => navigate(`/posts/${id}`)}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {submitting ? "Updating..." : "Update Story"}
          </button>
        </div>
      </form>
    </div>
  );
}
