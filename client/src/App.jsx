import React, { useEffect } from "react";
import { Button } from "./components/ui/button";
import { useAppStore } from "./Store/store";
import AdminLayout from "./pages/AdminLayout";
import AdminProfile from "./pages/AdminPages/AdminProfile";
import AdminInventory from "./pages/AdminPages/AdminInventory";
import { createBrowserRouter, Navigate, RouterProvider, useLocation } from "react-router-dom";
import AdminDashboard from "./pages/AdminPages/AdminDashboard";
import AdminAuth from "./pages/AdminPages/AdminAuth";
import UserLayout from "./pages/UserLayout";
import UserHome from "./pages/UserPages/UserHome";
import UserProfile from "./pages/UserPages/UserProfile";
import UserCart from "./pages/UserPages/UserCart";
import UserAuth from "./pages/UserPages/UserAuth";

const PrivateRoutes = ({ children }) => {
  const location = useLocation();
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  const isAdmin = userInfo?.role === "admin"; // Check if user is admin.

  if (!isAuthenticated) {
    // Redirect to /admin/auth if trying to access any admin route
    if (location.pathname.startsWith("/admin")) {
      return <Navigate to="/admin/auth" replace />;
    }
    return <Navigate to="/auth" replace />; // Redirect to /auth for non-authenticated users
  }

  if (!isAdmin && location.pathname.startsWith("/admin")) {
    return <Navigate to="/user/dashboard" replace />; // Redirect to user dashboard if not an admin
  }

  return children;
};


// Higher order component to check if user is authenticated and redirect to the appropriate dashboard.
const AuthRoutes = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  const isAdmin = userInfo?.role === "admin";

  if (isAuthenticated) {
    // Redirect authenticated users to their respective dashboard
    return isAdmin ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/user/dashboard" replace />
    );
  }

  return children; // Allow unauthenticated users to see the login page
};

const router = createBrowserRouter([
  {
    path: "/admin",
    element: (
      <PrivateRoutes>
        <AdminLayout />
      </PrivateRoutes>
    ),
    children: [
      {
        index: true, // Redirect Authenticated admin from /admin to /admin/dashboard
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "profile",
        element: <AdminProfile />,

      },
      {
        path:"inventory",
        element:<AdminInventory />
      },
      {
        path:"*",
        element:<Navigate to="dashboard" />
      }
    ],
  },
  {
    path: "/admin/auth",
    element: (
      <AuthRoutes>
        <AdminAuth />
      </AuthRoutes>
    ),
  },
  {
    path: "/",
    element: (
      <PrivateRoutes>
        <UserLayout />
      </PrivateRoutes>
    ),
    children: [
      {
        index: true, // Redirect Authenticated admin from /admin to /admin/dashboard
        element: <Navigate to="home" replace />,
      },
      {
        path: "home",
        element: <UserHome />,
      },
      {
        path: "profile",
        element: <UserProfile />,

      },
      {
        path:"cart",
        element:<UserCart />
      }
    ],
  },
  {
    path: "/auth",
    element: (
      <AuthRoutes>
        <UserAuth />
      </AuthRoutes>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/auth" />,
  }
]);

const App = () => {
  const { userInfo } = useAppStore();
  useEffect(()=>{

  },userInfo);
  return(
    <>
    <RouterProvider router={router} />
    </>
  )
};

export default App;

