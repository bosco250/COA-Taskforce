import React, { useState, useEffect } from 'react';
import { addBudget, fetchBudgets } from '../api Service/api';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [currentBudget, setCurrentBudget] = useState({
    category: '',
    amount: '',
    startDate: '',
    endDate: '',
    recurringType: 'monthly',
  });

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      const response = await fetchBudgets(localStorage.getItem('id'));
      if (response && Array.isArray(response.budgets)) {
        setBudgets(response.budgets);
      } else {
        setBudgets([]);
      }
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
      alert('Failed to load budgets. Please try again.');
    }
  };

  const handleSaveBudget = async () => {
    const { category, amount, startDate, endDate, recurringType } = currentBudget;

    if (!category || !amount || !startDate || !endDate) {
      alert('Please fill in all fields.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid budget amount.');
      return;
    }

    const budgetData = {
      userId: localStorage.getItem('id'),
      category,
      amount: parsedAmount,
      startDate,
      endDate,
      recurringType,
    };

    try {
      const token = localStorage.getItem('token');
      const newBudget = await addBudget(token, budgetData);

      if (newBudget && typeof newBudget === 'object') {
        setBudgets((prevBudgets) => [...prevBudgets, newBudget]);
      } else {
        throw new Error('Invalid budget data returned');
      }

      alert('Budget saved successfully!');
      resetForm();
    } catch (error) {
      console.error('Failed to save budget:', error);
      alert('Failed to save the budget. Please try again.');
    }
  };

  const resetForm = () => {
    setCurrentBudget({
      category: '',
      amount: '',
      startDate: '',
      endDate: '',
      recurringType: 'monthly',
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getBudgetStatus = (startDate, endDate) => {
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (currentDate < start) return 'Pending';
    if (currentDate > end) return 'Expired';
    return 'Active';
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold text-gray-800">Budget Manager</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
        <h2 className="text-base font-semibold text-gray-700">Add New Budget</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700">Category</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-xs focus:ring focus:ring-blue-200"
              value={currentBudget.category}
              onChange={(e) =>
                setCurrentBudget({ ...currentBudget, category: e.target.value })
              }
              placeholder="Enter category (e.g., Food, Housing)"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">Budget Amount</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-lg text-xs focus:ring focus:ring-blue-200"
              value={currentBudget.amount}
              onChange={(e) =>
                setCurrentBudget({ ...currentBudget, amount: e.target.value })
              }
              placeholder="Enter budget amount"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg text-xs focus:ring focus:ring-blue-200"
              value={currentBudget.startDate}
              onChange={(e) =>
                setCurrentBudget({ ...currentBudget, startDate: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">End Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg text-xs focus:ring focus:ring-blue-200"
              value={currentBudget.endDate}
              onChange={(e) =>
                setCurrentBudget({ ...currentBudget, endDate: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">Recurring Type</label>
            <select
              className="w-full px-3 py-2 border rounded-lg text-xs focus:ring focus:ring-blue-200"
              value={currentBudget.recurringType}
              onChange={(e) =>
                setCurrentBudget({
                  ...currentBudget,
                  recurringType: e.target.value,
                })
              }
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSaveBudget}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-xs"
          >
            Add Budget
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-semibold text-gray-700">All Budgets</h2>
        {budgets.length > 0 ? (
          budgets.map((budget, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <h3 className="font-medium text-xs text-gray-700">{budget.category}</h3>
                <p className="text-xs text-gray-500">
                  ${budget.amount} - {budget.recurringType.charAt(0).toUpperCase() +
                    budget.recurringType.slice(1)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(budget.startDate)} to {formatDate(budget.endDate)}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  getBudgetStatus(budget.startDate, budget.endDate) === 'Active'
                    ? 'bg-green-200 text-green-800'
                    : getBudgetStatus(budget.startDate, budget.endDate) === 'Expired'
                    ? 'bg-gray-200 text-gray-800'
                    : 'bg-yellow-200 text-yellow-800'
                }`}
              >
                {getBudgetStatus(budget.startDate, budget.endDate)}
              </span>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-600">No budgets added yet.</p>
        )}
      </div>
    </div>
  );
};

export default Budgets;
