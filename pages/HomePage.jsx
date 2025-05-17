import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaGlobe, FaUsers, FaBookOpen } from "react-icons/fa";
import api from "../config/axios";
import AuthContext from "../context/AuthContext";
import HomeFeatured from "../components/HomeFeatured";
import CountUp from "react-countup";

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
                  className="bg-white text-blue-700 hover:bg-gray-200 px-6 py-3 rounded-md font-medium text-lg transition transform hover:-translate-y-1 hover:shadow-lg"
                >
                  Join Our Community!
                </Link>
              ) : (
                <Link
                  to="/create-post"
                  className="bg-white text-blue-700 hover:bg-gray-200 px-6 py-3 rounded-md font-medium text-lg transition transform hover:-translate-y-1 hover:shadow-lg"
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
              className="bg-transparent hover:bg-blue-700 border-2 border-white px-6 py-3 rounded-md font-medium text-lg transition transform hover:-translate-y-1 hover:shadow-lg"
            >
              Explore Our Map
            </Link>
          </div>
        </div>
      </section>

      {/* 🌟 Featured story section */}
      <section className="bg-yellow-50 py-16 border-b">
        <div className="container mx-auto px-4 md:px-10 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            🌟 Featured Story of the Week
          </h2>
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              "From Nairobi to New York: A Journey of Language and Love"
            </h3>
            <p className="text-gray-700 mb-4">
              A powerful reflection on how sharing stories helped bridge
              continents, cultures, and hearts.
            </p>
            <Link
              to="/posts"
              className="inline-block text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Read More Stories
            </Link>
          </div>
        </div>
      </section>

      {/* stats section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "Community Members", count: userCount },
              { label: "Countries Represented", count: countriesCount },
              { label: "Shared Stories", count: postCount },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {loading ? (
                    <div className="h-10 bg-blue-200 animate-pulse rounded-md w-20 mx-auto" />
                  ) : (
                    <CountUp end={stat.count} duration={2} />
                  )}
                </div>
                <div className="text-gray-600 text-2xl">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* testimonial section */}
      <section className="bg-white py-12 border-t">
        <div className="container mx-auto px-6 text-center">
          <blockquote className="italic text-xl max-w-xl mx-auto text-gray-700">
            “I discovered so many perspectives through Aardvark Stories —
            everyone has a voice worth hearing.”
          </blockquote>
          <p className="mt-4 text-sm text-gray-500">
            — Lia, storyteller from Kenya
          </p>
        </div>
      </section>

      {/* about us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2 w-full">
              <img
                src="/images/our.jpg"
                alt="Group of students working"
                className="rounded-2xl shadow-lg h-96 w-full max-w-md mx-auto object-cover"
              />
            </div>

            <div className="md:w-1/2 w-full text-center md:text-left">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                Our Mission
              </h2>
              <p className="text-gray-700 text-lg mb-4">
                Aardvark Stories is a platform we have built for sharing
                stories. Our community brings together individuals from around
                the world to share their experiences, cultural backgrounds, and
                learning journeys.
              </p>
              <p className="text-gray-700 text-lg mb-6">
                Whether you're a student, or simply curious about other
                cultures, our platform provides a space to connect, learn, and
                grow together.
              </p>

              <Link
                to="/about"
                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
              >
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HomeFeatured />

      {/* icon CTA section */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 text-center gap-6">
            <div className="flex flex-col items-center">
              <FaGlobe className="text-3xl text-blue-600 mb-2" />
              <p className="font-medium text-gray-700">Global Impact</p>
            </div>
            <div className="flex flex-col items-center">
              <FaUsers className="text-3xl text-blue-600 mb-2" />
              <p className="font-medium text-gray-700">Community Driven</p>
            </div>
            <div className="flex flex-col items-center">
              <FaBookOpen className="text-3xl text-blue-600 mb-2" />
              <p className="font-medium text-gray-700">Learn & Grow</p>
            </div>
          </div>
        </div>
      </section>

      {/* final CTA */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join our Aardvark Stories Community
          </h2>
          <p>
            Share your experiences, connect with others, and explore different
            cultures from around the world.
          </p>

          <Link
            to="/register"
            className="inline-block bg-white text-indigo-700 hover:bg-gray-200 cursor-pointer px-6 py-3 rounded-md font-medium text-lg mt-4 transition transform hover:-translate-y-1 hover:shadow-lg"
          >
            Sign Up Now!
          </Link>
        </div>
      </section>
    </>
  );
}
