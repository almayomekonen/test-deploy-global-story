import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../config/axios";
import AuthContext from "../context/AuthContext";
import HomeFeatured from "../components/HomeFeatured";

export default function HomePage() {
  const { currentUser, loading: authLoading } = useContext(AuthContext);

  const [userCount, setUserCount] = useState(0);
  const [countriesCount, setCountriesCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const statsRes = await api.get("/auth/stats");

        if (statsRes.data && statsRes.data.success) {
          setUserCount(statsRes.data.totalUsers || 0);
          setCountriesCount(statsRes.data.uniqueCountries || 0);
          setPostCount(statsRes.data.totalPosts || 0);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <>
      {/* main section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Aardvark Stories
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Connecting culture and sharing experiences from around the globe
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {!authLoading ? (
              !currentUser ? (
                <Link
                  to="/register"
                  className="bg-white text-blue-700 hover:bg-gray-200 px-6 py-3 rounded-md font-medium text-lg"
                >
                  Join Our Community!
                </Link>
              ) : (
                <Link
                  to="/create-post"
                  className="bg-white text-blue-700 hover:bg-gray-200 px-6 py-3 rounded-md font-medium text-lg"
                >
                  Share Your Story
                </Link>
              )
            ) : (
              <div className="bg-white text-blue-700 px-6 py-3 rounded-md font-medium text-lg flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mr-2"></div>
                Loading...
              </div>
            )}
            <Link
              to="/map"
              className="bg-transparent hover:bg-blue-700 border-2 border-white px-6 py-3 rounded-md font-medium text-lg"
            >
              Explore Our Map
            </Link>
          </div>
        </div>
      </section>

      {/* stats section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {loading ? "..." : userCount}
              </div>
              <div className="text-gray-600 text-2xl">Community Members</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {loading ? "..." : countriesCount}
              </div>
              <div className="text-gray-600 text-2xl">
                Countries Represented
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {loading ? "..." : postCount}
              </div>
              <div className="text-gray-600 text-2xl">Shared Stories</div>
            </div>
          </div>
        </div>
      </section>

      {/* about us */}

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <img
                className="h-auto rounded-lg"
                src="/images/our.png"
                alt="group-students"
              />
            </div>

            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                Our Mission
              </h2>

              <p className="text-gray-600 text-xl mb-6">
                Aardvark Stories is a platform we have built for sharing
                stories. Our community brings together individuals from around
                the world to share their experiences, cultural backgrounds, and
                learning journeys.
              </p>
              <p className="text-gray-600 text-xl mb-6">
                Whether you're a student, or simply curious about other
                cultures, our platform provides a space to connect, learn, and
                grow together.
              </p>

              <Link
                to="/about"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-md font-medium"
              >
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HomeFeatured />

      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join our Aardvark Stories Community
          </h2>
          <p>
            Share your experiences, connect with others, and explore different
            culturs from around the world.
          </p>

          <Link
            to="/register"
            className="inline-block bg-white text-indigo-700 hover:bg-gray-200 cursor-pointer px-6 py-3 rounded-md font-medium text-lg mt-2"
          >
            Sign Up Now!
          </Link>
        </div>
      </section>
    </>
  );
}
