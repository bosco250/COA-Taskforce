import React, { useState } from "react";
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
  CreditCard,
  Calendar,
  Search,
} from "lucide-react";

// Same static data as before
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

const recentTransactions = [
  {
    id: 1,
    date: "2024-01-10",
    description: "Grocery Shopping",
    amount: -85.5,
    category: "Food",
  },
  {
    id: 2,
    date: "2024-01-09",
    description: "Salary Deposit",
    amount: 3000.0,
    category: "Income",
  },
  {
    id: 3,
    date: "2024-01-08",
    description: "Electric Bill",
    amount: -120.0,
    category: "Bills",
  },
  {
    id: 4,
    date: "2024-01-07",
    description: "Online Shopping",
    amount: -65.99,
    category: "Shopping",
  },
  {
    id: 5,
    date: "2024-01-06",
    description: "Freelance Payment",
    amount: 500.0,
    category: "Income",
  },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const DashboardOverview = () => {
  const [timeFilter, setTimeFilter] = useState("monthly");
  const totalIncome = 3500;
  const totalExpenses = 1850;
  const currentBalance = totalIncome - totalExpenses;

  const StatCard = ({ title, amount, icon: Icon, trend }) => (
    <div className="bg-white p-2 rounded shadow-sm mb-8">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-gray-500 text-xs">{title}</h3>
        <Icon className="text-gray-400" size={12} />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold">${amount.toLocaleString()}</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 ">
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
        <div className="bg-white p-2 rounded shadow-sm ">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold">Income vs Expenses</h3>
            <select
              className="border rounded text-xs px-1 py-0.5"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
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
          <h3 className="text-xs font-semibold mb-2">Expense Breakdown</h3>
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
                style={{ fontSize: "12px" }}
                outerRadius={50}
                fill="#8884d8"
                dataKey="value"
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
              />
              <Search
                className="absolute left-1 top-1 text-gray-400"
                size={12}
              />
            </div>
            <select className="border rounded text-xs px-1 py-0.5">
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="food">Food</option>
              <option value="bills">Bills</option>
              <option value="shopping">Shopping</option>
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
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b hover:bg-gray-50">
                  <td className="py-1 px-2">
                    {format(new Date(transaction.date), "MM/dd/yy")}
                  </td>
                  <td className="py-1 px-2">{transaction.description}</td>
                  <td className="py-1 px-2">
                    <span
                      className={`px-1 py-0.5 rounded-full text-xs ${
                        transaction.category === "Income"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {transaction.category}
                    </span>
                  </td>
                  <td
                    className={`py-1 px-2 text-right ${
                      transaction.amount > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ${Math.abs(transaction.amount).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
