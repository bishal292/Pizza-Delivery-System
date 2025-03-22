import { apiClient } from "@/utils/api-client";
import { HOST, USER_GET_ORDERS } from "@/utils/constant";
import React, { useEffect, useState } from "react";
import {
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaUtensils,
  FaClipboardList,
} from "react-icons/fa";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get(USER_GET_ORDERS, {
          withCredentials: true,
        });

        if (response.status === 200) {
          setOrders(response.data);
        } else {
          setError("Failed to fetch orders.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return { color: "bg-yellow-100 text-yellow-600", icon: <FaClock /> };
      case "placed":
        return { color: "bg-blue-100 text-blue-600", icon: <FaClipboardList /> };
      case "preparing":
        return { color: "bg-orange-100 text-orange-600", icon: <FaUtensils /> };
      case "prepared":
        return { color: "bg-purple-100 text-purple-600", icon: <FaCheckCircle /> };
      case "delivered":
        return { color: "bg-green-100 text-green-600", icon: <FaTruck /> };
      case "cancelled":
        return { color: "bg-red-100 text-red-600", icon: <FaTimesCircle /> };
      default:
        return { color: "bg-gray-100 text-gray-600", icon: <FaClock /> };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-800">
        Your Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {orders.map((order) => {
            const { color, icon } = getStatusStyle(order.status);

            return (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:scale-105 overflow-hidden"
              >

                <div className="relative">
                  <img
                    src={`${HOST}/pizza-image/${order.image}`}
                    alt="Order"
                    className="w-full h-44 object-cover"
                    onError={(e) => (e.target.src = "/fallback-image.jpg")}
                  />
                  <span
                    className={`absolute top-2 left-2 flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${color}`}
                  >
                    {icon} {order.status.toUpperCase()}
                  </span>
                </div>

                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-800 truncate">
                    Order ID: {order._id}
                  </h2>

                  <div className="mt-4 space-y-2">
                    <p className="text-sm">
                      <strong className="text-gray-700">Total Price:</strong>{" "}
                      <span className="text-gray-900 font-semibold">
                        ₹{order.totalPrice.toLocaleString()}
                      </span>
                    </p>

                    <p className="text-sm">
                      <strong className="text-gray-700">Quantity:</strong>{" "}
                      <span className="text-gray-900">{order.totalQuantity}</span>
                    </p>

                    <p className="text-sm">
                      <strong className="text-gray-700">Table No:</strong>{" "}
                      <span className="text-gray-900">{order.tableNo}</span>
                    </p>

                    <p className="text-sm">
                      <strong className="text-gray-700">Placed On:</strong>{" "}
                      <span className="text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}{" "}
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </span>
                    </p>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
