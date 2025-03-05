import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/Logo.svg";
import LogoutButton from "./LogoutButton";

const AdminHeader = () => {
  return (
    <>
      <div className="flex items-center justify-between bg-gray-800 text-white p-2">
        <NavLink to="/admin/dashboard" className="flex items-center gap-2">
          <img src={logo} className="h-8 w-8" alt="Pizeria" />
          Pizzeria
        </NavLink>
        <div className="flex gap-4">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive ? "text-yellow-500" : ""
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/inventory"
            className={({ isActive }) =>
              isActive ? "text-yellow-500" : ""
            }
          >
            Inventory
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              isActive ? "text-yellow-500" : ""
            }
          >
            orders
          </NavLink>
          <NavLink
            to="/admin/Pizzas"
            className={({ isActive }) =>
              isActive ? "text-yellow-500" : "``"
            }
          >
            Pizzas
          </NavLink>
        </div>
        <div>
          <LogoutButton />
        </div>
      </div>
    </>
  );
};

export default AdminHeader;
