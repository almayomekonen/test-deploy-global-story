import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import RegisterForm from "./RegisterForm";
import { VscAccount } from "react-icons/vsc";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    city: "",
    bio: "",
    languages: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [countries, setCountries] = useState([]);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const { register, isAuthenticated, error, setError } =
    useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const sortedCountries = response.data
          .map((country) => country.name.common)
          .sort((a, b) => a.localeCompare(b));
        setCountries(sortedCountries);
      } catch (error) {
        console.log(error, "Error fetching countries");
      }
    }

    fetchCountries();
  }, []);

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

    if (e.target.name === "password" || e.target.name === "confirmPassword") {
      if (e.target.name === "password") {
        setPasswordMatch(e.target.value === formData.confirmPassword);
      } else {
        setPasswordMatch(formData.password === e.target.value);
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const {
      name,
      email,
      password,
      confirmPassword,
      country,
      city,
      bio,
      languages,
    } = formData;

    if (password !== confirmPassword) {
      setPasswordMatch(false);
      return;
    }

    const languagesArray = languages
      .split(",")
      .map((lang) => lang.trim())
      .filter((lang) => lang !== "");

    const registeredData = {
      name,
      email,
      password,
      country,
      city,
      bio,
      languages: languagesArray,
    };

    const success = await register(registeredData);

    if (success) {
      navigate("/profile");
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center flex items-center justify-center gap-3 text-3xl font-extrabold">
          Create your account
          <VscAccount />
        </h2>

        <p className="mt-2 text-center text-lg text-gray-600">
          Already have an account?{" "}
          <Link
            className="font-medium text-blue-600 hover:text-blue-500"
            to="/login"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <RegisterForm
              onChange={handleInputChange}
              formData={formData}
              countries={countries}
              onTogglePassword={toggleShowPassword}
              showPasswordProp={showPassword}
              passwordMatch={passwordMatch}
            />

            <div>
              <button
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                type="submit"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
