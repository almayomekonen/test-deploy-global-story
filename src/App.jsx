// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "../context/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Home from "../pages/HomePage";
import Login from "../pages/Login/LoginPage";
import Register from "../pages/Register/RegisterPage";
import Profile from "../pages/ProfilePage";
import NotFound from "../pages/NotFoundPage";
import PostsPage from "../pages/PostsPage";
import PostPage from "../pages/PostPage";
import CreatePostPage from "../pages/CreatePostPage";
import EditPostPage from "../pages/EditPostPage";
import AboutPage from "../pages/AboutPage";

// Components
import Navbar from "../components/layout/Navbar";
import PrivateRoute from "../components/routing/PrivateRoute";
import ScrollToTop from "../components/ScrollToTop";
import MapPage from "../pages/MapPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
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
          </main>
          <ToastContainer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
