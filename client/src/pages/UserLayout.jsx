import UserHeader from "@/components/UserHeader";
import React from "react";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <>
    <UserHeader />
      <Outlet />
    </>
  );
};

export default UserLayout;
