import DashBoardCharts from "@/components/DashBoardCharts";
import { apiClient } from "@/utils/api-client";
import { ADMIN_DASHBOARD } from "@/utils/constant";
import React, { useEffect, useState } from "react";
import {
  FaShoppingCart,
  FaDollarSign,
  FaUsers,
  FaPizzaSlice,
  FaExclamationCircle,
  FaClipboardList,
  FaMoneyBillWave,
  FaBan,
} from "react-icons/fa";

const Dashboard = () => {
  const [responseData, setResponseData] = useState({});

  useEffect(() => {
    const fetchDashBoardData = async () => {
      try {
        // Fetching data from the server
        const response = await apiClient.get(ADMIN_DASHBOARD, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setResponseData(response.data);
        }
      } catch (error) {
        console.error("Error fetching data from the server: ", error);
      }
    };
    fetchDashBoardData();
  }, []);

  const statConfig = {
    "Total Orders": { icon: <FaShoppingCart />, color: "bg-blue-500" },
    "Total Revenue": { icon: <FaDollarSign />, color: "bg-green-500" },
    "Today's Revenue": { icon: <FaMoneyBillWave />, color: "bg-teal-500" },
    "Total Users": { icon: <FaUsers />, color: "bg-indigo-500" },
    "Total Pizzas": { icon: <FaPizzaSlice />, color: "bg-yellow-500" },
    "Out Of Stock Items": {icon: <FaExclamationCircle />,color: "bg-red-500",},
    "Today's Orders": { icon: <FaClipboardList />, color: "bg-purple-500" },
    "Today's Orders Cancelled":{icon: <FaBan />,color: "bg-red-500",},
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10 font-sans">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
        {Object.entries(responseData).map(([label, value], index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105 cursor-pointer border border-gray-200"
          >
            <div className="flex items-center">
              <div
                className={`text-white p-4 rounded-full ${
                  statConfig[label]?.color || "bg-gray-500"
                }`}
              >
                {statConfig[label]?.icon}
              </div>
              <div className="ml-4">
                <div className="text-3xl font-bold">
                  {label === "Total Revenue"
                    ? `$${value.toLocaleString()}`
                    : value}
                </div>
                <div className="text-gray-600 text-md">{label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Graphs Section to be developed. */}
      <div className="bg-white shadow-md rounded-lg p-10" title="Analytics, For now is a demo analaytics and donot represent the real as the datas are too low " >
        <h2 className="text-2xl font-bold text-gray-700 mb-6">
          Analytics and Insights
        </h2>
        <div className="flex justify-center items-center text-black p-4">
          <DashBoardCharts />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
