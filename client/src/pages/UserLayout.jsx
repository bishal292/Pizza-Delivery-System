import UserHeader from "@/components/UserHeader";
import React from "react";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <>
      <div className="overflow-x-hidden">
        <UserHeader />
        <Outlet />
      </div>
    </>
  );
};

export default UserLayout;
