import React, { useEffect } from "react";
import { useAppStore } from "./Store/store";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useLocation,
  useParams,
} from "react-router-dom";
import AdminLayout from "./pages/AdminLayout";
import AdminProfile from "./pages/AdminPages/AdminProfile";
import AdminInventory from "./pages/AdminPages/AdminInventory";
import AdminDashboard from "./pages/AdminPages/AdminDashboard";
import AdminAuth from "./pages/AdminPages/AdminAuth";
import UserLayout from "./pages/UserLayout";
import UserHome from "./pages/UserPages/UserHome";
import UserProfile from "./pages/UserPages/UserProfile";
import UserCart from "./pages/UserPages/UserCart";
import UserAuth from "./pages/UserPages/UserAuth";
import { apiClient } from "./utils/api-client";
import { GET_LOGGED_USER_INFO } from "./utils/constant";
import AdminOrders from "./pages/AdminPages/AdminOrders";

// Private Routes Component (Protected Routes) -> Only Authenticated Users can access these Routes.
const PrivateRoutes = ({ children }) => {
  const location = useLocation();
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo; // If there is userInfo, then isAuthenticated is true
  const isAdmin = userInfo?.role === "admin";
  const isAdminRoute = location.pathname.startsWith("/admin");

  // if user is not authenticated, redirect to login page for the respective user
  if (!isAuthenticated) {
    const targetPath = isAdminRoute
      ? "/admin/auth/login"
      : "/pizzeria/auth/login";
    return <Navigate to={targetPath} replace />;
  }

  if (!isAdmin && isAdminRoute) {
    console.error("Unauthorized Access: User is not an Admin");
    return <Navigate to="/pizzeria/home" replace />;
  }

  return children;
};

// Auth Routes Component
const AuthRoutes = ({ children }) => {
  const { userInfo } = useAppStore();
  if (userInfo?.role) {
    if (userInfo?.role && userInfo.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/pizzeria/home" replace />;
    }
  }

  return children;
};

// Auth Wrapper Component
const AuthWrapper = ({ Component }) => {
  const { action } = useParams();
  const validActions = ["login", "signup", "forgot", "resetPassword"];
  console.log(action);

  if (!validActions.includes(action)) {
    return <Navigate to="/pizzeria/auth/login" replace />;
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
    path: "/pizzeria/auth/:action",
    element: (
      <AuthRoutes>
        <AuthWrapper Component={UserAuth} />
      </AuthRoutes>
    ),
  },
  {
    path: "/pizzeria",
    element: (
      <PrivateRoutes>
        <UserLayout />
      </PrivateRoutes>
    ),
    children: [
      { index: true, element: <Navigate to="home" replace /> },
      { path: "home", element: <UserHome /> },
      { path: "profile", element: <UserProfile /> },
      { path: "cart", element: <UserCart /> },
      // { path: "*", element: <Navigate to="home" /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <PrivateRoutes>
        <AdminLayout />
      </PrivateRoutes>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "profile", element: <AdminProfile /> },
      { path: "inventory", element: <AdminInventory /> },
      { path: "orders", element: <AdminOrders /> },
      { path: "*", element: <Navigate to="dashboard" /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/pizzeria/auth/login" />,
  },
]);

// App Component
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
