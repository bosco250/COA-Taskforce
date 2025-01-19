import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Home,
  CreditCard,
  BarChart,
  DollarSign,
  Settings,
  LogOut,
  Bell,
  Search,
  User,
} from "lucide-react";

function DashboardHome() {
  const navigate = useNavigate();
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("firstame");
      localStorage.removeItem("lastName");
      localStorage.removeItem("id");
      navigate("/");
    }
  };
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-gray-200 fixed h-full flex flex-col justify-between">
        <div className="p-4">
          <h1 className="text-xl font-bold mb-6 text-center">Dashboard</h1>
          <nav className="space-y-4">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded text-sm ${
                  isActive ? "bg-gray-700" : "hover:bg-gray-700"
                }`
              }
            >
              <Home size={16} className="mr-3" />
              Dashboard
            </NavLink>
            <NavLink
              to="/dashboard/transactions"
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded text-sm ${
                  isActive ? "bg-gray-700" : "hover:bg-gray-700"
                }`
              }
            >
              <CreditCard size={16} className="mr-3" />
              Transaction
            </NavLink>
            <NavLink
              to="/dashboard/reports"
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded text-sm ${
                  isActive ? "bg-gray-700" : "hover:bg-gray-700"
                }`
              }
            >
              <BarChart size={16} className="mr-3" />
              Reports
            </NavLink>
            <NavLink
              to="/dashboard/budgets"
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded text-sm ${
                  isActive ? "bg-gray-700" : "hover:bg-gray-700"
                }`
              }
            >
              <DollarSign size={16} className="mr-3" />
              Budgets
            </NavLink>
            <NavLink
              to="/dashboard/settings"
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded text-sm ${
                  isActive ? "bg-gray-700" : "hover:bg-gray-700"
                }`
              }
            >
              <Settings size={16} className="mr-3" />
              Settings
            </NavLink>
          </nav>
        </div>
        <div className="p-4 mb-4" onClick={handleLogout}>
          <NavLink
            to="#"
            className="flex items-center py-2 px-4 hover:bg-gray-700 hover:text-red-400 rounded text-sm"
          >
            <LogOut size={16} className="mr-3" />
            Logout
          </NavLink>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-grow pl-64">
        {/* Header */}
        <div className="sticky top-0 w-full flex justify-between items-center bg-gray-100 shadow px-6 py-4 z-10">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-bold">Track your Finance</h1>
          </div>
          <div className="relative group flex items-center hover:cursor-pointer">
            <span className="mr-3 text-sm text-gray-700">
              {localStorage.getItem("lastName")}{" "}
              {localStorage.getItem("firstame")}
            </span>
            <User size={16} className="text-gray-600" />
            <div className="absolute right--5 top-5 hidden group-hover:block bg-white shadow-lg rounded-lg py-2 w-32">
              <NavLink
                to="/dashboard/settings"
                className="flex items-center px-4 py-2 hover:bg-gray-100 text-xs text-gray-800"
              >
                <Settings size={16} className="mr-2" />
                Profile
              </NavLink>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
