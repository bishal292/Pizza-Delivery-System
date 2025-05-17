import Footer from "@/components/Footer";
import UserHeader from "@/components/UserHeader";
import React from "react";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <>
      <div className="overflow-x-hidden min-h-screen flex flex-col justify-between">
        <UserHeader />
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default UserLayout;
