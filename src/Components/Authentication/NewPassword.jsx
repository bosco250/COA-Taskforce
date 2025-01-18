import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../api Service/api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewPassword = () => {
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    password: "",
    confirmPassword: "",
  });

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const validateForm = () => {
    let isValid = true;
    const newErrors = { password: "", confirmPassword: "" };

    if (!passwords.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (passwords.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters long";
      isValid = false;
    }

    if (!passwords.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (passwords.password !== passwords.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setError(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        await resetPassword(token, passwords.password, setLoading);
        setTimeout(() => {
          navigate("/", {
            state: {
              message:
                "Password reset successful. Please login with your new password.",
            },
          });
        }, 2000);
      } catch (err) {
        setError({
          ...error,
          password: "Failed to reset password. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-6 flex flex-col justify-center sm:py-12">
      <ToastContainer />
      <div className="relative py-3 sm:max-w-xl sm:mx-auto w-full px-4 sm:px-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative bg-white shadow-lg sm:rounded-3xl px-4 py-10 sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="text-center pb-8">
                <div className="mb-4 text-blue-600 font-bold text-4xl">🔒</div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Set New Password
                </h2>
                <p className="text-gray-600">Please enter your new password</p>
              </div>

              <form onSubmit={handleSubmit} className="py-8 space-y-6">
                <div>
                  <label className="text-sm font-bold text-gray-700 tracking-wide">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your new password"
                    value={passwords.password}
                    onChange={handleChange}
                    className="w-full text-base px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 border-gray-300"
                  />
                  {error.password && (
                    <p className="text-red-500 text-xs mt-2">
                      {error.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700 tracking-wide">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your new password"
                    value={passwords.confirmPassword}
                    onChange={handleChange}
                    className="w-full text-base px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 border-gray-300"
                  />
                  {error.confirmPassword && (
                    <p className="text-red-500 text-xs mt-2">
                      {error.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center items-center bg-blue-600 text-white p-3 rounded-lg tracking-wide font-semibold focus:outline-none hover:bg-blue-700 transition-colors duration-200"
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>

              <div className="pt-6 text-center">
                <Link to="/login" className="text-blue-600 hover:text-blue-500">
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
