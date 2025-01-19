import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Eye, EyeOff, Mail, Lock, Loader } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import { loginUser } from '../api Service/api';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const navigate = useNavigate();

  const validateForm = () => {
    let valid = true;
    let newErrors = { email: '', password: '' };

    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      loginUser(formData, navigate, setLoading);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validateForm();
  };

  return (
    <div className="min-h-screen text-sm bg-gradient-to-br from-blue-50 to-blue-100 py-6 flex flex-col justify-center sm:py-12">
      <ToastContainer />
      <div className="relative py-3 sm:max-w-xl sm:mx-auto w-full px-4 sm:px-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative bg-white shadow-lg sm:rounded-3xl px-4 py-10 sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="text-center pb-8">
                <div className="mb-4 text-blue-600 font-bold text-4xl">🔑</div>
                <h2 className="text-xl font-bold text-gray-900">Sign In</h2>
              </div>

              <div className="pb-6 text-center">
                <h3 className="text-base font-semibold text-gray-900">Welcome to Your Finance Tracker</h3>
                <p className="text-gray-600 text-xs mt-2">Track your transactions, set budgets, and get insights into your spending habits with ease.</p>
              </div>

              <form onSubmit={handleSubmit} className="py-8 space-y-6">
                <div className="relative">
                  <label className="text-xs font-bold text-gray-700 tracking-wide">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder="name@example.com"
                      onChange={handleChange}
                      onBlur={() => handleBlur('email')}
                      className={`w-full text-xs pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                        touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                  {touched.email && errors.email && (
                    <p className="text-red-500 text-xs mt-2">{errors.email}</p>
                  )}
                </div>

                <div className="relative">
                  <label className="text-xs font-bold text-gray-700 tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Enter your password"
                      onChange={handleChange}
                      onBlur={() => handleBlur('password')}
                      className={`w-full text-xs pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                        touched.password && errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {touched.password && errors.password && (
                    <p className="text-red-500 text-xs mt-2">{errors.password}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full flex text-sm justify-center items-center bg-blue-600 text-white p-3 rounded-lg tracking-wide font-semibold focus:outline-none hover:bg-blue-700 transition-colors duration-200 space-x-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin h-5 w-5" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </form>

              <div className="pt-6 text-center space-y-4">
                <Link to="/forgot-password" className="text-blue-600 hover:text-blue-500 block transition-colors duration-200">
                  Forgot Password?
                </Link>
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-blue-600 hover:text-blue-500 font-semibold transition-colors duration-200">
                    Create one now
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;