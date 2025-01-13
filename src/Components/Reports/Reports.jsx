import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { Download, FileText, Filter } from 'lucide-react';

const Reports = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [reportType, setReportType] = useState('summary');

  // Sample data - replace with actual data from your backend
  const sampleData = {
    transactions: [
      { date: '2024-01-01', amount: 1200, category: 'Income', subCategory: 'Salary', account: 'Bank' },
      { date: '2024-01-15', amount: -500, category: 'Bills', subCategory: 'Rent', account: 'Bank' },
      { date: '2024-01-20', amount: -100, category: 'Food', subCategory: 'Groceries', account: 'Credit Card' },
      // Add more sample transactions
    ],
    categories: ['Income', 'Bills', 'Food', 'Transport', 'Shopping'],
    subCategories: {
      Income: ['Salary', 'Freelance', 'Investments'],
      Bills: ['Rent', 'Utilities', 'Internet'],
      Food: ['Groceries', 'Restaurants', 'Takeout'],
      Transport: ['Fuel', 'Public Transport', 'Maintenance'],
      Shopping: ['Clothes', 'Electronics', 'Home'],
    },
    accounts: ['Bank', 'Credit Card', 'Mobile Money', 'Cash'],
  };

  // Calculate summary data
  const summaryData = useMemo(() => {
    const filteredTransactions = sampleData.transactions.filter(transaction => {
      const inDateRange = (!dateRange.start || transaction.date >= dateRange.start) &&
                         (!dateRange.end || transaction.date <= dateRange.end);
      const inAccounts = selectedAccounts.length === 0 || selectedAccounts.includes(transaction.account);
      const inCategories = selectedCategories.length === 0 || selectedCategories.includes(transaction.category);
      const inSubCategories = selectedSubCategories.length === 0 || selectedSubCategories.includes(transaction.subCategory);
      return inDateRange && inAccounts && inCategories && inSubCategories;
    });

    return {
      totalIncome: filteredTransactions.reduce((sum, t) => t.amount > 0 ? sum + t.amount : sum, 0),
      totalExpenses: Math.abs(filteredTransactions.reduce((sum, t) => t.amount < 0 ? sum + t.amount : sum, 0)),
      categoryBreakdown: filteredTransactions.reduce((acc, t) => {
        const category = t.category;
        acc[category] = (acc[category] || 0) + Math.abs(t.amount);
        return acc;
      }, {}),
    };
  }, [dateRange, selectedAccounts, selectedCategories, selectedSubCategories, sampleData.transactions]);

  const handleExport = (format) => {
    // Implement export logic here
    console.log(`Exporting as ${format}...`);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Financial Reports</h1>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg text-sm"
          >
            <FileText size={16} className="mr-2" />
            Export PDF
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg text-sm"
          >
            <Download size={16} className="mr-2" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Range */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Date Range</label>
            <div className="flex gap-2">
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-lg text-sm"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-lg text-sm"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>

          {/* Account Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Accounts</label>
            <select
              multiple
              className="w-full px-3 py-2 border rounded-lg text-sm"
              value={selectedAccounts}
              onChange={(e) => setSelectedAccounts(Array.from(e.target.selectedOptions, option => option.value))}
            >
              {sampleData.accounts.map(account => (
                <option key={account} value={account}>{account}</option>
              ))}
            </select>
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Categories</label>
            <select
              multiple
              className="w-full px-3 py-2 border rounded-lg text-sm"
              value={selectedCategories}
              onChange={(e) => {
                const categories = Array.from(e.target.selectedOptions, option => option.value);
                setSelectedCategories(categories);
                setSelectedSubCategories([]); // Reset subcategories when categories change
              }}
            >
              {sampleData.categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Subcategory Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Subcategories</label>
            <select
              multiple
              className="w-full px-3 py-2 border rounded-lg text-sm"
              value={selectedSubCategories}
              onChange={(e) => setSelectedSubCategories(Array.from(e.target.selectedOptions, option => option.value))}
            >
              {selectedCategories.flatMap(category => 
                sampleData.subCategories[category]?.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded-lg text-sm ${
              reportType === 'summary' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
            onClick={() => setReportType('summary')}
          >
            Summary Report
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm ${
              reportType === 'detailed' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
            onClick={() => setReportType('detailed')}
          >
            Detailed Report
          </button>
        </div>
      </div>

      {/* Summary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Income vs Expenses Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-semibold mb-4">Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: 'Income', amount: summaryData.totalIncome },
              { name: 'Expenses', amount: summaryData.totalExpenses }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-semibold mb-4">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(summaryData.categoryBreakdown).map(([name, value]) => ({
                  name,
                  value
                }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {Object.entries(summaryData.categoryBreakdown).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm text-gray-500 mb-2">Total Income</h4>
            <p className="text-2xl font-bold text-green-600">
              ${summaryData.totalIncome.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm text-gray-500 mb-2">Total Expenses</h4>
            <p className="text-2xl font-bold text-red-600">
              ${summaryData.totalExpenses.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm text-gray-500 mb-2">Net Balance</h4>
            <p className="text-2xl font-bold text-blue-600">
              ${(summaryData.totalIncome - summaryData.totalExpenses).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Transactions Table (shown when detailed report is selected) */}
      {reportType === 'detailed' && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-semibold mb-4">Detailed Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Subcategory</th>
                  <th className="px-4 py-2 text-left">Account</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.transactions.map((transaction, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{format(new Date(transaction.date), 'MM/dd/yyyy')}</td>
                    <td className="px-4 py-2">{transaction.category}</td>
                    <td className="px-4 py-2">{transaction.subCategory}</td>
                    <td className="px-4 py-2">{transaction.account}</td>
                    <td className={`px-4 py-2 text-right ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${Math.abs(transaction.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;