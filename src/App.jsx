// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import AuthProvider from "../context/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Lazy load pages
const Home = lazy(() => import("../pages/HomePage"));
const Login = lazy(() => import("../pages/Login/LoginPage"));
const Register = lazy(() => import("../pages/Register/RegisterPage"));
const Profile = lazy(() => import("../pages/ProfilePage"));
const NotFound = lazy(() => import("../pages/NotFoundPage"));
const PostsPage = lazy(() => import("../pages/PostsPage"));
const PostPage = lazy(() => import("../pages/PostPage"));
const CreatePostPage = lazy(() => import("../pages/CreatePostPage"));
const EditPostPage = lazy(() => import("../pages/EditPostPage"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const MapPage = lazy(() => import("../pages/MapPage"));

// Components
import Navbar from "../components/layout/Navbar";
import PrivateRoute from "../components/routing/PrivateRoute";
import ScrollToTop from "../components/ScrollToTop";

// Loading component
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/map" element={<MapPage />} />

                <Route path="/posts" element={<PostsPage />} />
                <Route path="/posts/:id" element={<PostPage />} />
                <Route
                  path="/create-post"
                  element={
                    <PrivateRoute>
                      <CreatePostPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/posts/:id/edit"
                  element={
                    <PrivateRoute>
                      <EditPostPage />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <ToastContainer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
