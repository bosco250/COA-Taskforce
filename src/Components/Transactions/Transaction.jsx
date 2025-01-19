import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Plus, Search, Edit2, Trash2, X } from "lucide-react";
import { CircularProgress } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import { deleteTransaction, getTransactions, registerTransactions, updatetransaction } from "../api Service/api";
import { useNavigate } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

const TransactionManagement = () => {
  // [Previous state declarations remain the same]
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      date: "2024-01-10",
      description: "Grocery Shopping",
      amount: -85.5,
      category: "Food",
      accountType: "Bank",
    },
    {
      id: 2,
      date: "2024-01-09",
      description: "Salary Deposit",
      amount: 3000.0,
      category: "Income",
      accountType: "Bank",
    },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccountType, setSelectedAccountType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(5);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: "",
    amount: "",
    category: "",
    subcategory: "",
    account: "",
    description: "",
    type: "",
  });

  const [errors, setErrors] = useState({
    date: "",
    amount: "",
    category: "",
    subcategory: "",
    account: "",
    description: "",
    type: "",
  });

  // [Previous functions remain the same]

  useEffect(() => {
    getTransactions(setTransactions, setIsLoading);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.date) {
      newErrors.date = "Date is required.";
      isValid = false;
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required.";
      isValid = false;
    } else if (isNaN(formData.amount) || formData.amount <= 0) {
      newErrors.amount = "Amount must be a positive number.";
      isValid = false;
    }

    if (!formData.category) {
      newErrors.category = "Category is required.";
      isValid = false;
    }
    if (!formData.subcategory) {
      newErrors.category = "Subcategory is required.";
      isValid = false;
    }

    if (!formData.account) {
      newErrors.account = "Account is required.";
      isValid = false;
    }

    if (!formData.description) {
      newErrors.description = "Description is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const categories = ["Expense", "Income"];
  const accountTypes = ["Bank", "Mobile money", "Cash"];

  const handleupdateTransaction = async () => {
    try {
      await updatetransaction(editingTransaction._id, formData);
      console.log('Transaction updated successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    const isValid = validateForm();
    if (!isValid) return;
  
    if (editingTransaction) {
      if(confirm("Are you really want to update this transaction?")){
        await handleupdateTransaction();
      }
    } else {
      await registerTransactions(formData, navigate, setIsLoading);
      console.log('Transaction added successfully');
    }
  
    setIsFormOpen(false);
    setEditingTransaction(null);
    setFormData({
      date: "",
      amount: "",
      category: "",
      accountType: "",
      description: "",
    });
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData(transaction);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      if(confirm("Are you really want to delete this transaction?")){
        await deleteTransaction(id);
      }
      setTransactions(transactions.filter((transaction) => transaction.id !== id));
    } catch (error) {
      console.error('Error handling delete:', error);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    return (
      (selectedCategory === "all" || transaction.category === selectedCategory) &&
      (selectedAccountType === "all" || transaction.accountType === selectedAccountType) &&
      (!searchTerm || transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!dateRange.start || new Date(transaction.date) >= new Date(dateRange.start))
    );
  });

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <motion.div 
      className="p-4 min-h-screen mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <ToastContainer />
      
      <motion.div 
        className="mb-6"
        variants={itemVariants}
      >
        <div className="flex justify-between items-center mb-4">
          <motion.h1 
            className="text-xl font-bold"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Transaction Management
          </motion.h1>
          <motion.button
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={16} className="mr-2" />
            Add Transaction
          </motion.button>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-lg shadow-sm"
          variants={itemVariants}
        >
          {/* Search Input */}
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full px-8 py-2 border rounded-lg text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
          </motion.div>

          {/* Date Range Input */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg text-sm"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </motion.div>

          {/* Category Select */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <select
              className="w-full px-3 py-2 border rounded-lg text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </motion.div>

          {/* Account Type Select */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <select
              className="w-full px-3 py-2 border rounded-lg text-sm"
              value={selectedAccountType}
              onChange={(e) => setSelectedAccountType(e.target.value)}
            >
              <option value="all">All Accounts</option>
              {accountTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div 
        className="bg-white rounded-lg shadow-sm"
        variants={itemVariants}
      >
        {isLoading ? (
          <motion.div 
            className="flex justify-center items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <CircularProgress />
          </motion.div>
        ) : (
          <motion.div variants={containerVariants}>
            <h2 className="text-sm font-bold px-2">Transactions</h2>
            <table className="min-w-full table-auto text-xs">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-2 text-left">Date</th>
                  <th className="py-2 px-2 text-left">Description</th>
                  <th className="py-2 px-2 text-left">Category</th>
                  <th className="py-2 px-2 text-left">Account Type</th>
                  <th className="py-2 px-2 text-center">Amount</th>
                  <th className="py-2 px-2 text-center">Action</th>
                </tr>
              </thead>
              <AnimatePresence mode="wait">
                <tbody>
                  {currentTransactions.length === 0 ? (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td colSpan="6" className="py-4 text-center text-gray-500">
                        No transactions available.
                      </td>
                    </motion.tr>
                  ) : (
                    currentTransactions.map((transaction, index) => (
                      <motion.tr
                        key={transaction.id}
                        className="border-b hover:bg-gray-50"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ 
                          delay: index * 0.05,
                          type: "spring",
                          stiffness: 300,
                          damping: 24
                        }}
                      >
                        <td className="py-1 px-2">
                          {format(new Date(transaction.date), "MM/dd/yy")}
                        </td>
                        <td className="py-1 px-2">{transaction.description}</td>
                        <td className="py-1 px-2">{transaction.category}</td>
                        <td className="py-1 px-2">{transaction.account}</td>
                        <td className={`py-1 px-2 text-center ${
                          transaction.amount > 0 ? "text-green-600" : "text-red-600"
                        }`}>
                          RWF {Math.abs(transaction.amount).toLocaleString()}
                        </td>
                        <td className="py-1 px-2 text-right">
                          <motion.button
                            className="text-blue-500 hover:text-blue-700 mr-2"
                            onClick={() => handleEdit(transaction)}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Edit2 size={16} />
                          </motion.button>
                          <motion.button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(transaction._id)}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </AnimatePresence>
            </table>
          </motion.div>
        )}
      </motion.div>

      {/* Pagination */}
      <motion.div 
        className="mt-4 flex justify-center space-x-2"
        variants={itemVariants}
      >
        {[...Array(totalPages)].map((_, i) => (
          <motion.button
            key={i}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1 ? "bg-blue-950 text-white" : "bg-white"
            }`}
            onClick={() => handlePageChange(i + 1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {i + 1}
          </motion.button>
        ))}
      </motion.div>

      {/* Modal Form */}
      <AnimatePresence>
      {isFormOpen && (
        <div className="fixed inset-0 bg-black z-50 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">
                {editingTransaction ? "Edit Transaction" : "Add Transaction"}
              </h2>
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingTransaction(null);
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-2">
              <div>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>

              <div>
                <input
                  type="number"
                  required
                  step="0.01"
                  min={1}
                  className="w-full placeholder:text-gray-950 px-3 py-2 border rounded-lg text-sm"
                  value={formData.amount}
                  placeholder="Amount paid"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amount: parseFloat(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <select
                  required
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  required
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  value={formData.account}
                  onChange={(e) =>
                    setFormData({ ...formData, account: e.target.value })
                  }
                >
                  <option value="">Select Account</option>
                  {accountTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <input
                  type="text"
                  required
                  className="w-full placeholder:text-gray-950 px-3 py-2 border rounded-lg text-sm"
                  value={formData.subcategory}
                  placeholder="Subcategory..."
                  onChange={(e) =>
                    setFormData({ ...formData, subcategory: e.target.value })
                  }
                />
              </div>

              <div>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">Select Type</option>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>

              <div>
                <input
                  type="text"
                  required
                  className="w-full placeholder:text-gray-950 px-3 py-2 border rounded-lg text-sm"
                  value={formData.description}
                  placeholder="Description..."
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                {editingTransaction ? "Update Transaction" : "Add Transaction"}
              </button>
            </form>
          </div>
        </div>
      )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TransactionManagement;