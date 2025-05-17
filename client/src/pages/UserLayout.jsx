import Footer from "@/components/Footer";
import UserHeader from "@/components/UserHeader";
import React from "react";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <>
      <div className="overflow-x-hidden">
        <UserHeader />
        <Outlet />
        <Footer />
      </div>
    </>
  );
};

export default UserLayout;
