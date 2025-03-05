import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/Logo.svg";
import LogoutButton from "./LogoutButton";

const UserHeader = () => {
  return (
    <header className="flex items-center justify-between bg-gray-800 text-white p-2">
      <NavLink to="/pizzeria/home" className="flex items-center gap-2">
        <img src={logo} className="h-8 w-8" alt="Pizeria" />
        Pizzeria
      </NavLink>
      <div className="flex gap-4">
        <NavLink
          to="/pizzeria/home"
          className={({ isActive }) => (isActive ? "text-yellow-500" : "")}
        >Home
            </NavLink>
        <NavLink
          to="/pizzeria/cart"
          className={({ isActive }) => (isActive ? "text-yellow-500" : "")}
        >
          Cart
        </NavLink>
        <NavLink
          to="/pizzeria/orders"
          className={({ isActive }) => (isActive ? "text-yellow-500" : "")}
        >
          Orders
        </NavLink>
      </div>
      <div>
        <LogoutButton />
      </div>
    </header>
  );
};

export default UserHeader;
