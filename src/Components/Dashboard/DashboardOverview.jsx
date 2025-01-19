import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { TrendingUp, TrendingDown, DollarSign, Search } from "lucide-react";
import { getTransactions } from "../api Service/api";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
const CARD_COLORS = {
  income: "#E8F5E9",
  expenses: "#FFEBEE",
  balance: "#E3F2FD",
};

// Animation variants
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
      stiffness: 100
    }
  }
};

const cardVariants = {
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

const DashboardOverview = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterAccount, setFilterAccount] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getTransactions(setTransactions, setIsLoading);
  }, []);

  // ... (keeping all the data processing logic the same)
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesCategory =
      filterCategory === "all" || transaction.category === filterCategory;
    const matchesAccount =
      filterAccount === "all" || transaction.account === filterAccount;
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesAccount && matchesSearch;
  });

  const totalIncome = filteredTransactions
    .filter((transaction) => transaction.category === "Income")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((transaction) => transaction.category !== "Income")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const currentBalance = totalIncome - totalExpenses;

  // ... (keeping monthly transaction data and account data processing the same)
  const allMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const monthlyTransactionData = allMonths.reduce((acc, month) => {
    const monthData = transactions.reduce(
      (monthAcc, transaction) => {
        const transactionMonth = format(new Date(transaction.date), "MMM");
        if (transactionMonth === month) {
          monthAcc.count++;
          if (transaction.category === "Income") {
            monthAcc.income += transaction.amount;
          } else {
            monthAcc.expenses += transaction.amount;
          }
        }
        return monthAcc;
      },
      { month, count: 0, income: 0, expenses: 0 }
    );
    acc.push(monthData);
    return acc;
  }, []);

  const accountData = transactions.reduce((acc, transaction) => {
    const account = transaction.account;
    if (!acc[account]) {
      acc[account] = { name: account, value: 0 };
    }
    acc[account].value += 1;
    return acc;
  }, {});

  const accountDistribution = Object.values(accountData);

  const StatCard = ({ title, amount, icon: Icon, trend, bgColor }) => (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="p-2 rounded shadow-sm mb-8"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-gray-500 text-xs">{title}</h3>
        <Icon className="text-gray-400" size={12} />
      </div>
      <div className="flex items-center justify-between">
        <motion.p 
          className="text-sm font-bold"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          key={amount} // This ensures animation triggers on amount change
        >
          RWF {amount.toLocaleString()}
        </motion.p>
        {trend && (
          <motion.span
            className={`text-xs ${trend > 0 ? "text-green-500" : "text-red-500"}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {trend > 0 ? "+" : ""}
            {trend}%
          </motion.span>
        )}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="p-2 max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Quick Stats */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2"
        variants={itemVariants}
      >
        <StatCard
          title="Total Income"
          amount={totalIncome}
          icon={TrendingUp}
          trend={12}
          bgColor={CARD_COLORS.income}
        />
        <StatCard
          title="Total Expenses"
          amount={totalExpenses}
          icon={TrendingDown}
          trend={-5}
          bgColor={CARD_COLORS.expenses}
        />
        <StatCard
          title="Current Balance"
          amount={currentBalance}
          icon={DollarSign}
          bgColor={CARD_COLORS.balance}
        />
      </motion.div>

      {/* Charts Section */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2"
        variants={itemVariants}
      >
        {/* Income vs Expenses Chart */}
        <motion.div 
          className="bg-white p-2 rounded shadow-sm"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={monthlyTransactionData}
              margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: "10px" }} />
              <Legend wrapperStyle={{ fontSize: "10px" }} />
              <Bar dataKey="income" fill="#4CAF50" />
              <Bar dataKey="expenses" fill="#FF5252" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Account Distribution Pie Chart */}
        <motion.div 
          className="bg-white p-2 rounded shadow-sm"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <ResponsiveContainer width="100%" height={200}>
            <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <Pie
                data={accountDistribution}
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
                {accountDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: "10px" }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div 
        className="bg-white p-2 rounded shadow-sm"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold">Recent Transactions</h3>
          <div className="flex items-center space-x-2">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.02 }}
            >
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
            </motion.div>
            <motion.select
              className="border rounded text-xs px-1 py-0.5"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              whileHover={{ scale: 1.02 }}
            >
              <option value="all">All</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </motion.select>
            <motion.select
              className="border rounded text-xs px-1 py-0.5"
              value={filterAccount}
              onChange={(e) => setFilterAccount(e.target.value)}
              whileHover={{ scale: 1.02 }}
            >
              <option value="all">All Accounts</option>
              <option value="mobile money">Mobile Money</option>
              <option value="cash">Cash</option>
              <option value="bank">Bank</option>
            </motion.select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left py-1 px-2">Date</th>
                <th className="text-left py-1 px-2">Category</th>
                <th className="text-left py-1 px-2">Sub Category</th>
                <th className="text-left py-1 px-2">Type</th>
                <th className="text-left py-1 px-2">Account</th>
                <th className="text-right py-1 px-2">Amount</th>
              </tr>
            </thead>
            <AnimatePresence>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan="5" className="text-center py-2">
                      No transactions available
                    </td>
                  </motion.tr>
                ) : (
                  filteredTransactions.map((transaction, index) => (
                    <motion.tr
                      key={transaction.id}
                      className="border-b hover:bg-gray-50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01, backgroundColor: "#f9fafb" }}
                    >
                      <td className="py-1 px-2">
                        {format(new Date(transaction.date), "MM/dd/yy")}
                      </td>
                      <td className="py-1 px-2">{transaction.description}</td>
                      <td className="py-1 px-2">{transaction.subcategory}</td>
                      <td className="py-1 px-2">{transaction.category}</td>
                      <td className="py-1 px-2">{transaction.account}</td>
                      <td
                        className={`py-1 px-2 text-right ${
                          transaction.amount > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        RWF {Math.abs(transaction.amount).toLocaleString()}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </AnimatePresence>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardOverview;