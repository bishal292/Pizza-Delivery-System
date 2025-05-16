import React, { useEffect } from "react";
import { useAppStore } from "./Store/store";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useParams,
} from "react-router-dom";
import UserLayout from "./pages/UserLayout";
import UserHome from "./pages/UserPages/UserHome";
import UserCart from "./pages/UserPages/UserCart";
import UserAuth from "./pages/UserPages/UserAuth";
import { apiClient } from "./utils/api-client";
import { GET_LOGGED_USER_INFO } from "./utils/constant";
import UserOrders from "./pages/UserPages/UserOrders";
import OrderDetails from "./pages/UserPages/OrderDetails";
import LoadingScreen from "./components/LoadingScreen";

// Private Routes Component (Protected Routes) -> Only Authenticated Users can access these Routes.
const PrivateRoutes = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo; // If there is userInfo, then isAuthenticated is true
  const isUser = userInfo?.role === "user";
  
  if(userInfo === null || userInfo === undefined) {
    return <LoadingScreen />;
  }
  // if user is not authenticated, redirect to login page for the respective user
  if (!isAuthenticated || !isUser) {
    return <Navigate to="/pizzeria/auth/login" replace />;
  }

  return children;
};

// Auth Routes Component
const AuthRoutes = ({ children }) => {
  const { userInfo } = useAppStore();
  if (userInfo?.role && userInfo.role === "user") {
    return <Navigate to="/pizzeria/home" replace />;
  }
  return children;
};

// Auth Wrapper Component
const AuthWrapper = ({ Component }) => {
  const { action } = useParams();
  const validActions = ["login", "signup", "forgot", "resetPassword"];

  if (!validActions.includes(action)) {
    return <Navigate to="/pizzeria/auth/login" replace />;
  }

  return <Component action={action} />;
};

// Router Configuration
const router = createBrowserRouter([
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
      { path: "orders", element: <UserOrders /> },
      { path: "cart", element: <UserCart /> },
      {path: "order/:orderId", element: <OrderDetails />}
      // { path: "*", element: <Navigate to="home" /> },
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
