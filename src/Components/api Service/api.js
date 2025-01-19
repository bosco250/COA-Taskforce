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
    localStorage.setItem("firstame", response.data.user.firstName);
    localStorage.setItem("lastName", response.data.user.lastName);
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

// get transactions

export const getTransactions = async (setData, setIsLoading) => {
  const frontend = import.meta.env.VITE_BACKEND_URL;

  try {
    setIsLoading(true);
    const userId = localStorage.getItem("id");
    const response = await axios.get(`${frontend}/transaction/all/${userId}`);
    setData(response.data.transactions);
    console.log(response.data.transactions, "data to know");
  } catch (err) {
    console.error("Error fetching bookings data:", err);
  } finally {
    setIsLoading(false);
  }
};

//register transaction

export const registerTransactions = async (formData,navigate, setIsLoading) => {
  const frontend = import.meta.env.VITE_BACKEND_URL;

  try {
    setIsLoading(true);

    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Corrected: Added backticks for template literal
      },
    };

    const response = await axios.post(
      `${frontend}/transaction/register`,
      formData,
      config
    );

    toast.success(response.data.message);

    setTimeout(() => {
      navigate("/dashboard"); 
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

//delete transaction
export const deleteTransaction = async (id) => {
  const frontend = import.meta.env.VITE_BACKEND_URL;
  try {
    await axios.delete(`${frontend}/transaction/delete/${id}`);
    window.location.reload();
    console.log('Transaction deleted successfully');
  } catch (error) {
    console.error('Error deleting transaction:', error);
  }
};

//update transaction 
export const updatetransaction = async (id, updatedData) => {
  const frontend = import.meta.env.VITE_BACKEND_URL;
  try {
    // Send PUT request with the updated data
    const response = await axios.put(`${frontend}/transaction/edit/${id}`, updatedData);
    console.log("Transaction updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
};

//get user Profile
export const getProfile = async (id) => {
  const backend = import.meta.env.VITE_BACKEND_URL; 
  try {
    const response = await axios.get(`${backend}/auth/get/profile/${id}`); 
    return response.data; 
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

//update Profile

export const updateProfile = async (id,navigate, updatedData) => {
  const backend = import.meta.env.VITE_BACKEND_URL;
  try {
    const response = await axios.put(`${backend}/auth/update/profile/${id}`, updatedData);
    navigate('/dashboard')
    return response.data; 
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error; 
  }
};


//Update Password
export const updatePassword = async (id, passwordData) => {
  const backend = import.meta.env.VITE_BACKEND_URL;

  try {
    await axios.put(`${backend}/auth/update/password/${id}`, passwordData);
    console.log("Password updated successfully");
  } catch (error) {
    console.error('Failed to update password:', error);
    throw new Error('Failed to update password');
  }
};


//add budget 
export const addBudget = async (authenticateToken, registerBudget) => {
  const backend = import.meta.env.VITE_BACKEND_URL;

  try {
    const response = await axios.post(
      `${backend}/budget/register`,
      registerBudget,
      {
        headers: {
          Authorization: `Bearer ${authenticateToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error saving budget:', error);
    throw error;
  }
};

export const fetchBudgets = async (userId) => {
  const backend = import.meta.env.VITE_BACKEND_URL;

  try {
    const response = await axios.get(`${backend}/budget/all/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching budgets:', error);
    throw error;
  }
};