import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function EditPostPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/posts"
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <FaArrowLeft /> Back to Posts
        </Link>
      </div>
    </div>
  );
}
