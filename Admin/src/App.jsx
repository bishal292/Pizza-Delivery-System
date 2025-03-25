import React, { useEffect } from "react";
import { useAppStore } from "./Store/store";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useParams,
} from "react-router-dom";
import AdminLayout from "./pages/AdminLayout";
import AdminInventory from "./pages/AdminPages/AdminInventory";
import AdminDashboard from "./pages/AdminPages/AdminDashboard";
import AdminAuth from "./pages/AdminPages/AdminAuth";
import { apiClient } from "./utils/api-client";
import { GET_LOGGED_USER_INFO } from "./utils/constant";
import AdminOrders from "./pages/AdminPages/AdminOrders";
import AdminPizza from "./pages/AdminPages/AdminPizza";
import PizzaDetails from "./pages/AdminPages/PizzaDetails";
import AdminUsersList from "./pages/AdminPages/AdminUsersList";
import AdminUpdateUser from "./pages/AdminPages/AdminUpdateUser";
import SelectedUserCart from "./pages/AdminPages/SelectedUserCart";
import LoadingScreen from "./components/LoadingScreen";
import SelectedOrder from "./pages/AdminPages/SelectedOrder";

// Private Routes Component (Protected Routes) -> Only Authenticated Users can access these Routes.
const PrivateRoutes = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo; // If there is userInfo, then isAuthenticated is true
  const isAdmin = userInfo?.role === "admin";
  
  if (userInfo === null || userInfo === undefined) {
    return <LoadingScreen />;
  }

  // if user is not authenticated, redirect to login page for the respective user
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/auth/login" replace />;
  }

  return children;
};

// Auth Routes Component
const AuthRoutes = ({ children }) => {
  const { userInfo } = useAppStore();

  if (userInfo?.role && userInfo.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
};

// Auth Wrapper Component
const AuthWrapper = ({ Component }) => {
  const { action } = useParams();
  const validActions = ["login", "signup", "forgot", "resetPassword"];

  if (!validActions.includes(action)) {
    return <Navigate to="/admin/auth/login" replace />;
  }

  return <Component action={action} />;
};

// Router Configuration
const router = createBrowserRouter([
  {
    path: "/admin/auth/:action",
    element: (
      <AuthRoutes>
        <AuthWrapper Component={AdminAuth} />
      </AuthRoutes>
    ),
  },
  {
    path: "/admin",
    element: (
      <PrivateRoutes>
        <AdminLayout />
      </PrivateRoutes>
    ),
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "pizzas", element: <AdminPizza /> },
      { path: "inventory", element: <AdminInventory /> },
      { path: "orders", element: <AdminOrders /> },
      { path: "users-list", element: <AdminUsersList /> },
      { path: "user/:id", element: <AdminUpdateUser /> },
      { path: "pizza/:id", element: <PizzaDetails /> },
      {path:"cart/:cartId",element: <SelectedUserCart />},
      {path:"order/:orderId",element: <SelectedOrder />},
    ],
  },
  {
    path: "*",
    element: <Navigate to="/admin/auth/login" />,
  },
]);

const App = () => {
  const { userInfo, setUserInfo } = useAppStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(GET_LOGGED_USER_INFO, {
          withCredentials: true,
        });
        setUserInfo(response.data);
      } catch (error) {
        setUserInfo({});
        console.error(error.response?.data || error.message);
      }
    };

    if (!userInfo) {
      fetchData();
    }
  }, [userInfo, setUserInfo]);

  return <RouterProvider router={router} />;
};

export default App;
