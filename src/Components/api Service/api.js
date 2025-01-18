import axios, { isAxiosError } from 'axios';
import { toast } from 'react-toastify';

export const registerUser = async (formData, navigate, setErrors, setIsLoading) => {
  const frontend = import.meta.env.VITE_BACKEND_URL;

  try {
    setIsLoading(true);
    await axios.post(`${frontend}/auth/register`, formData);

    toast.success("Signup successful!");

    setTimeout(() => {
      navigate("/"); 
    }, 2000);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } else {
      toast.error("An unexpected error occurred.");
    }
  } finally {
    setIsLoading(false);
  }
};

export const loginUser = async (formData, navigate, setIsLoading) => {
  const frontend = import.meta.env.VITE_BACKEND_URL;
  
  try {
    setIsLoading(true);
    const response = await axios.post(`${frontend}/auth/login`, formData);
    console.log(response.data);
    localStorage.setItem("id", response.data.user._id);
    const token = response.data.token;
    
    if (token) {
      localStorage.setItem('token', token);
      toast.success("Login Successful");
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else {
      toast.error("No token received, login failed");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "An error occurred. Please try again";
      toast.error(errorMessage);
    } else {
      toast.error("An unexpected error occurred");
    }
  } finally {
    setIsLoading(false);
  }
};

export const forgotPasswordUser = async (email, setIsLoading) => {
  const frontend = import.meta.env.VITE_BACKEND_URL;

  try {
    setIsLoading(true);
    const response = await axios.post(`${frontend}/auth/send/email`, { email });
    toast.success(response.data.message || "Password reset link sent to your email.");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } else {
      toast.error("An unexpected error occurred");
    }
  } finally {
    setIsLoading(false);
  }
};

export const resetPassword = async (token, password, setIsLoading) => {
  const frontend = import.meta.env.VITE_BACKEND_URL;

  try {
    setIsLoading(true);
    const response = await axios.post(`${frontend}/auth/reset/password/${token}`, { password });
    toast.success(response.data.message || "Password has been reset successfully.");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } else {
      toast.error("An unexpected error occurred");
    }
  } finally {
    setIsLoading(false);
  }
};