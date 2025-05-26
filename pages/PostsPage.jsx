import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import PostList from "../components/posts/PostList";

export default function PostsPage() {
  const { currentUser } = useContext(AuthContext);
  const [selectCategory, setSelectCategory] = useState("");

  const categories = [
    "All",
    "Culture",
    "Tech",
    "Personal",
    "Learning",
    "Other",
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Global Stories
        </h1>

        {currentUser && (
          <Link
            to="/create-post"
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Share Your Story
          </Link>
        )}
      </div>

      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isActive =
              (category === "All" && selectCategory === "") ||
              category === selectCategory;

            return (
              <button
                key={category}
                onClick={() =>
                  setSelectCategory(category === "All" ? "" : category)
                }
                className={`px-4 py-2 rounded-md ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <PostList category={selectCategory} />
    </div>
  );
}
