import React, { useState } from 'react';

const Budgets = () => {
  const [income, setIncome] = useState('');
  const [budgetName, setBudgetName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [recurringType, setRecurringType] = useState('weekly');
  const [budget, setBudget] = useState(null);

  // Predefined expense categories with percentages
  const expenseCategories = [
    { category: 'Housing', percentage: 30 },
    { category: 'Food', percentage: 20 },
    { category: 'Transportation', percentage: 15 },
    { category: 'Savings', percentage: 10 },
    { category: 'Entertainment', percentage: 10 },
    { category: 'Utilities', percentage: 10 },
    { category: 'Miscellaneous', percentage: 5 },
  ];

  const handleGenerateBudget = () => {
    if (!income || !budgetName || !startDate || !endDate) {
      alert('Please fill out all fields to generate the budget.');
      return;
    }

    const totalIncome = parseFloat(income);
    if (isNaN(totalIncome) || totalIncome <= 0) {
      alert('Please enter a valid income amount.');
      return;
    }

    // Calculate budget for each category
    const calculatedBudget = expenseCategories.map((expense) => ({
      category: expense.category,
      amount: ((expense.percentage / 100) * totalIncome).toFixed(2),
    }));

    setBudget(calculatedBudget);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Budget Planner</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Budget Name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg text-sm"
            value={budgetName}
            onChange={(e) => setBudgetName(e.target.value)}
            placeholder="Enter budget name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Income
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded-lg text-sm"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="Enter your total income"
          />
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg text-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg text-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recurring Type
          </label>
          <select
            className="w-full px-3 py-2 border rounded-lg text-sm"
            value={recurringType}
            onChange={(e) => setRecurringType(e.target.value)}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <button
          onClick={handleGenerateBudget}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Generate Budget
        </button>
      </div>

      {budget && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Generated Budget</h2>
          <div className="space-y-2">
            {budget.map((item) => (
              <div
                key={item.category}
                className="flex justify-between bg-gray-100 p-2 rounded"
              >
                <span className="font-medium">{item.category}</span>
                <span>${item.amount}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;
