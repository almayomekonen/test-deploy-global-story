import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { useContext, useState, useCallback } from "react";
import AuthContext from "../../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, currentUser, loading } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prevState) => !prevState);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-blue-600 hover:text-blue-800 transition duration-300"
              onClick={closeMenu}
            >
              Aardvark Stories
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              to="/"
              className="px-3 py-2 rounded-md text-md font-medium text-gray-700 hover:text-blue-800 hover:bg-gray-50 transition duration-300"
            >
              Home
            </Link>
            <Link
              to="/posts"
              className="px-3 py-2 rounded-md text-md font-medium text-gray-700 hover:text-blue-800 hover:bg-gray-50 transition duration-300"
            >
              Stories
            </Link>

            {loading ? (
              <div className="flex items-center px-3 py-2">
                <div className="w-5 h-5 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mr-2"></div>
              </div>
            ) : isAuthenticated ? (
              <>
                <Link
                  to="/create-post"
                  className="px-3 py-2 rounded-md text-md font-medium text-gray-700 hover:text-blue-800 hover:bg-gray-50 transition duration-300"
                >
                  Create Story
                </Link>
                <Link
                  to="/profile"
                  className="px-3 py-2 rounded-md text-md font-medium text-gray-700 hover:text-blue-800 hover:bg-gray-50 transition duration-300"
                >
                  Profile
                </Link>
                <span className="px-3 py-2 rounded-md text-md font-medium text-blue-600">
                  {currentUser?.name}
                </span>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-md font-medium text-gray-700 hover:text-blue-800 hover:bg-gray-50 transition duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md text-md font-medium text-white bg-blue-600 hover:bg-blue-700 transition duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-gray-100 focus:outline-none cursor-pointer transition duration-300"
              aria-expanded={menuOpen}
            >
              <span className="sr-only">{menuOpen ? "Close" : "Menu"}</span>
              {menuOpen ? (
                <IoMdClose size={24} />
              ) : (
                <GiHamburgerMenu size={24} />
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition duration-300"
            onClick={closeMenu}
          >
            Home
          </Link>

          <Link
            to="/posts"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition duration-300"
            onClick={closeMenu}
          >
            Stories
          </Link>

          {loading ? (
            <div className="flex items-center justify-center px-3 py-2">
              <div className="w-5 h-5 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mr-2"></div>
              <span>Loading...</span>
            </div>
          ) : isAuthenticated ? (
            <>
              <Link
                to="/create-post"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition duration-300"
                onClick={closeMenu}
              >
                Create Story
              </Link>
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition duration-300"
                onClick={closeMenu}
              >
                Profile
              </Link>
              <div className="block px-3 py-2 text-blue-600 font-medium border-t border-gray-100 mt-2 pt-3">
                Hello, {currentUser?.name?.split(" ")[0] || "User"}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition duration-300"
                onClick={closeMenu}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition duration-300 mt-2"
                onClick={closeMenu}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
