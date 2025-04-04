import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaShoppingCart, FaBox, FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/Logo.svg";
import LogoutButton from "./LogoutButton";

const UserHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);


  return (
    <header className="bg-gray-800 text-white p-4 flex items-center justify-between md:px-6 relative z-50">
      {/* Logo and Brand Name */}
      <NavLink to="/pizzeria/home" className="flex items-center gap-2">
        <img src={logo} className="h-8 w-8" alt="Pizzeria" />
        <span className="font-bold text-xl">Pizzeria</span>
      </NavLink>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? (
          <FaTimes className="text-2xl" />
        ) : (
          <FaBars className="text-2xl" />
        )}
      </button>

      {/* Navigation Links */}
      <div
        className={`absolute md:static top-16 left-0 w-full md:w-auto bg-gray-800 md:bg-transparent p-4 md:p-0 transition-all ${
          menuOpen ? "flex" : "hidden"
        } md:flex flex-col md:flex-row items-center gap-4`}
      >
        <NavLink
          to="/pizzeria/home"
          onClick={() => setMenuOpen(false)}
          className={({ isActive }) =>
            isActive
              ? "text-yellow-500"
              : "text-white hover:text-yellow-400 transition-colors"
          }
        >
          <FaHome className="inline-block mr-2" /> Home
        </NavLink>
        <NavLink
          to="/pizzeria/cart"
          onClick={() => setMenuOpen(false)}
          className={({ isActive }) =>
            isActive
              ? "text-yellow-500"
              : "text-white hover:text-yellow-400 transition-colors"
          }
        >
          <FaShoppingCart className="inline-block mr-2" /> Cart
        </NavLink>
        <NavLink
          to="/pizzeria/orders"
          onClick={() => setMenuOpen(false)}
          className={({ isActive }) =>
            isActive
              ? "text-yellow-500"
              : "text-white hover:text-yellow-400 transition-colors"
          }
        >
          <FaBox className="inline-block mr-2" /> Orders
        </NavLink>
        <div className="md:hidden mt-4">
          <LogoutButton />
        </div>
      </div>

      {/* Logout Button */}
      <div className="hidden md:block">
        <LogoutButton />
      </div>
    </header>
  );
};

export default UserHeader;
