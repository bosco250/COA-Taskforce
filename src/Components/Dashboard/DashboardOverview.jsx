import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Search,
} from "lucide-react";
import { getTransactions } from "../api Service/api";

const monthlyData = [
  { month: "Jan", income: 4000, expenses: 2400 },
  { month: "Feb", income: 3000, expenses: 1398 },
  { month: "Mar", income: 2000, expenses: 9800 },
  { month: "Apr", income: 2780, expenses: 3908 },
  { month: "May", income: 1890, expenses: 4800 },
  { month: "Jun", income: 2390, expenses: 3800 },
];

const expenseCategories = [
  { name: "Food", value: 400 },
  { name: "Transport", value: 300 },
  { name: "Shopping", value: 300 },
  { name: "Bills", value: 200 },
  { name: "Entertainment", value: 100 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const DashboardOverview = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getTransactions(setTransactions, setIsLoading);
  }, []);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesCategory =
      filterCategory === "all" || transaction.category === filterCategory;
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate total income, total expenses, and current balance dynamically
  const totalIncome = filteredTransactions
    .filter((transaction) => transaction.category === "Income")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((transaction) => transaction.category !== "Income")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const currentBalance = totalIncome - totalExpenses;

  const StatCard = ({ title, amount, icon: Icon, trend }) => (
    <div className="bg-white p-2 rounded shadow-sm mb-8">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-gray-500 text-xs">{title}</h3>
        <Icon className="text-gray-400" size={12} />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold">RWF {amount.toLocaleString()}</p>
        {trend && (
          <span
            className={`text-xs ${
              trend > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend > 0 ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-2 max-w-4xl mx-auto">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
        <StatCard
          title="Total Income"
          amount={totalIncome}
          icon={TrendingUp}
          trend={12}
        />
        <StatCard
          title="Total Expenses"
          amount={totalExpenses}
          icon={TrendingDown}
          trend={-5}
        />
        <StatCard
          title="Current Balance"
          amount={currentBalance}
          icon={DollarSign}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2">
        {/* Income vs Expenses Chart */}
        <div className="bg-white p-2 rounded shadow-sm">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={monthlyData}
              margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 8 }} />
              <YAxis tick={{ fontSize: 8 }} />
              <Tooltip contentStyle={{ fontSize: "10px" }} />
              <Legend wrapperStyle={{ fontSize: "8px" }} />
              <Bar dataKey="income" fill="#4CAF50" />
              <Bar dataKey="expenses" fill="#FF5252" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Categories Pie Chart */}
        <div className="bg-white p-2 rounded shadow-sm">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <Pie
                data={expenseCategories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={50}
                dataKey="value"
                style={{ fontSize: "12px" }}
              >
                {expenseCategories.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: "10px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-2 rounded shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold">Recent Transactions</h3>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-6 pr-2 py-0.5 border rounded text-xs w-24"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className="absolute left-1 top-1 text-gray-400"
                size={12}
              />
            </div>
            <select
              className="border rounded text-xs px-1 py-0.5"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All</option>
              <option value="Income">Income</option>
              <option value="Food">Food</option>
              <option value="Bills">Bills</option>
              <option value="Shopping">Shopping</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left py-1 px-2">Date</th>
                <th className="text-left py-1 px-2">Description</th>
                <th className="text-left py-1 px-2">Category</th>
                <th className="text-right py-1 px-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-2">No transactions available</td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-gray-50">
                    <td className="py-1 px-2">
                      {format(new Date(transaction.date), "MM/dd/yy")}
                    </td>
                    <td className="py-1 px-2">{transaction.description}</td>
                    <td className="py-1 px-2">{transaction.category}</td>
                    <td
                      className={`py-1 px-2 text-right ${
                        transaction.amount > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                    RWF {Math.abs(transaction.amount).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
