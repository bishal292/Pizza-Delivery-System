import React from "react";
import { NavLink } from "react-router-dom";
import LogoutButtoun from "./LogoutButtoun";
import logo from "../assets/Logo.svg";

const AdminHeader = () => {
  return (
    <>
      <div className="flex items-center justify-between bg-gray-800 text-white p-2">
        <div className="flex items-center gap-2">
          <img src={logo} className="h-8 w-8" alt="Pizeria" />
          Pizzeria
        </div>
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
            to="/admin/profile"
            className={({ isActive }) =>
              isActive ? "text-yellow-500" : "``"
            }
          >
            Profile
          </NavLink>
        </div>
        <div>
          <LogoutButtoun />
        </div>
      </div>
    </>
  );
};

export default AdminHeader;
