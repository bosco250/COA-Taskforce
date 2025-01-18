
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './Components/Authentication/Login';
import Register from './Components/Authentication/Register';
import ForgotPassword from './Components/Authentication/ForgotPassword';
import DashboardHome from './Components/Dashboard/DashboardHome';
import DashboardOverview from './Components/Dashboard/DashboardOverview';
import TransactionManagement from './Components/Transactions/Transaction';
import { StrictMode } from 'react';
import './index.css'
import Reports from './Components/Reports/Reports';
import Budgets from './Components/Budgets/Budgets';
import Settings from './Components/settings/Settings';
import NewPassword from './Components/Authentication/NewPassword';

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/new-password", element: <NewPassword /> },
  {
    path: "/dashboard",
    element: <DashboardHome />,
    children: [
      { index: true, element: <DashboardOverview /> },
      { path: "transactions", element: <TransactionManagement /> },
      { path: "reports", element: <Reports /> },
      { path: "budgets", element: <Budgets /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
