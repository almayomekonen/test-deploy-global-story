import { VscAccount } from "react-icons/vsc";
import LoginForm from "./LoginForm";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isAuthenticated, error, setError, loading } =
    useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile");
    }

    return () => {
      if (error) {
        setError(null);
      }
    };
  }, [isAuthenticated, error, setError, navigate]);

  function handleInputChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { email, password } = formData;

    const success = await login(email, password);
    if (success) {
      navigate("/");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center flex items-center justify-center gap-3 text-3xl font-extrabold">
          Sign in to your account
          <VscAccount />
        </h2>

        <p className="mt-2 text-center text-lg text-gray-600">
          Or{" "}
          <Link
            className="font-medium text-blue-600 hover:text-blue-500"
            to="/register"
          >
            Create a new account
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <p className="text-sm text-red-700">
                {error.response?.data?.message ||
                  "Failed to sign in. Please check your credentials."}
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <LoginForm onChange={handleInputChange} formData={formData} />

            <div>
              <button
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer disabled:opacity-70"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="mr-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
