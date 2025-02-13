import React, { useState } from "react";
import { Button } from "./ui/button";
import { apiClient } from "@/utils/api-client";
import { ADMIN_AUTH_LOGOUT, USER_AUTH_LOGOUT } from "@/utils/constant";
import { useAppStore } from "@/Store/store";
import { toast } from "sonner";

const LogoutButtoun = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { userInfo, setUserInfo } = useAppStore();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await apiClient.get( userInfo.role =='user' ? USER_AUTH_LOGOUT : ADMIN_AUTH_LOGOUT, {
        withCredentials: true,
      });
      console.log(response);
      if (response.status === 200) {
        toast.warning("Logged Out Successfully");
        setUserInfo(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoggingOut(false);
    }
  };
  return (
    <div>
      <Button
        onClick={handleLogout}
        isLoading={isLoggingOut}
        disabled={isLoggingOut}
      >
        Logout
      </Button>
    </div>
  );
};

export default LogoutButtoun;
