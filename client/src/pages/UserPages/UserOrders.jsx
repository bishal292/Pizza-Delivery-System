import LoadingScreen from "@/components/LoadingScreen";
import { useAppStore } from "@/Store/store";
import { apiClient } from "@/utils/api-client";
import { HOST, USER_CANCEL_ORDER, USER_GET_ORDERS } from "@/utils/constant";
import { handleCompletePayment } from "@/utils/razorpayServices";
import React, { useEffect, useState } from "react";
import {
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaUtensils,
  FaClipboardList,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const UserOrders = () => {
  const {userInfo} = useAppStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting,setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get(USER_GET_ORDERS, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setOrders(response.data);
        }else{
          setError(response?.data?.message || response?.data);
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

  const handleCancelOrder = async (orderId) => {
    setIsSubmitting(true);
    try {
      const response = await apiClient.get(`${USER_CANCEL_ORDER}?id=${orderId}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        toast.success(response.data)
        setOrders((orders) =>
          orders.map((order) =>
            order._id === orderId ? { ...order, status: "cancelled" } : order
          )
        );
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(error.response?.data?.message || error.response?.message || "Failed to cancel order.");
    }finally{
      setIsSubmitting(false);
    }
  };

  

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
      <LoadingScreen message="Fetching your orders..." />
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
                    src={`${order.image}`}
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
                    Order ID: {order.dailyOrderId}
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
                        {new Date(order.createdAt).toLocaleDateString()}{"-"}
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </span>
                    </p>
                  </div>

                  <div className="flex justify-end mt-4 space-x-2">
                    <Link className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                      to={`/pizzeria/order/${order._id}`}
                    >
                      View Details
                    </Link>
                    {(order.status === "pending" || order.status === "placed") && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                    )}
                    {order.status === "pending" && (
                      <button
                        onClick={() => handleCompletePayment(userInfo, order._id, setIsSubmitting)}
                        className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                        disabled={isSubmitting}
                      >
                        Complete Payment
                      </button>
                    )}
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
