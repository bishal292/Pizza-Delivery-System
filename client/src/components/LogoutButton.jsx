import React, { useState } from "react";
import { Button } from "./ui/button";
import { apiClient } from "@/utils/api-client";
import { USER_AUTH_LOGOUT } from "@/utils/constant";
import { useAppStore } from "@/Store/store";
import { toast } from "sonner";

const LogoutButton = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { userInfo, setUserInfo } = useAppStore();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await apiClient.get(USER_AUTH_LOGOUT,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        toast.warning("Logged Out Successfully");
        setUserInfo(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoggingOut(false);
    }
  };
  return (
    <div>
      <Button
        className="bg-red-500 text-white
        px-4 py-2 rounded hover:bg-red-800 hover:shadow-lg "
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? "Logging Out..." : "Logout"}
      </Button>
    </div>
  );
};

export default LogoutButton;
