import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Home, CreditCard, BarChart, DollarSign, Settings, LogOut, Bell, Search } from "lucide-react";

function DashboardHome() {
  const navigate=useNavigate()
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
        localStorage.removeItem("token");
        navigate('/');
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
            <h1 className="text-lg font-bold">Manage your expenses and income</h1>           
          </div>
          <div className="flex items-center space-x-4">
            <Bell size={16} className="text-gray-500 hover:text-gray-700 cursor-pointer" />
            <div className="flex items-center hover:cursor-pointer">
              <span className="mr-3 text-sm text-gray-700">Dusengimana</span>
              <img
                src="/api/placeholder/32/32"
                alt="Avatar"
                className="w-8 h-8 rounded-full bg-gray-200"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
