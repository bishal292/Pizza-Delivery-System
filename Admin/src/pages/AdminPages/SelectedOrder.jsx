import LoadingScreen from "@/components/LoadingScreen";
import { useAppStore } from "@/Store/store";
import { apiClient } from "@/utils/api-client";
import {
  ADMIN_ORDER_DETAILS,
  ADMIN_UPDATE_ORDER_STATUS,
  HOST,
} from "@/utils/constant";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const OrderDetails = () => {
  const { userInfo } = useAppStore();
  const { orderId } = useParams();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [genOrderId, setGenOrderId] = useState("");
  const [tableNumber, setTableNumber] = useState(null);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dailyOID, setDailyOID] = useState(""); // Daily Order ID

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await apiClient.get(
          `${ADMIN_ORDER_DETAILS}?id=${orderId}`,
          { withCredentials: true }
        );
        console.log(response.data);
        if (response.status === 200) {
          setOrderDetails(response.data.items);
          setTotalPrice(response.data.totalPrice);
          setGenOrderId(response.data.orderId);
          setTableNumber(response.data.tableNo);
          setStatus(response.data.status);
          setDailyOID(response.data.dailyOrderId);
        }
      } catch (error) {
        setOrderDetails(null);
        console.error(error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  const handleUpdateOrder = async (newStatus) => {
    if (status === "completed" || status === "cancelled") {
      toast.error(
        "Cannot update the status of a completed or cancelled order."
      );
      return;
    }
    try{
        setIsSubmitting(true);
        const response = await apiClient.patch(
            `${ADMIN_UPDATE_ORDER_STATUS}?id=${orderId}`,
            { status: newStatus },
            { withCredentials: true }
        );
        console.log(response);
        if (response.status === 200) {
            setStatus(newStatus);
            toast.success(response.data.message || "Order status updated successfully");
        }
    }catch{
        console.log(error);
        toast.error(error.response?.data?.message || error.response?.data || "Some Unknown Error Occured");
    }finally{
        setIsSubmitting(false);
    }
  };


  if (loading) {
    return <LoadingScreen message="Fetching Order Details" />;
  }

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">
        Order Details with ID : {dailyOID}
      </h1>

      <div className="mb-6 p-4 border rounded-lg shadow-md bg-gray-50">
        <div className="flex flex-wrap justify-around gap-4">
          <p className="text-lg">
            <b>Table:</b> {tableNumber || "Not Assigned"}
          </p>
          <p className="text-lg">
            <b>Status:</b> <span className="capitalize">{status}</span>
          </p>
        </div>
      </div>

      {!orderDetails?.length ? (
        <div className="text-xl text-red-500 font-bold mb-4">
          No order details found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {orderDetails.map((item, index) => {
            const isCustomized =
              item.customizations.sauce.length > 0 ||
              item.customizations.cheese.length > 0 ||
              item.customizations.toppings.length > 0;

            return (
              <div
                key={`${item.pizza._id}-${index}`}
                className="border p-4 rounded-lg shadow-lg bg-white flex flex-col"
              >
                <h2 className="text-lg font-semibold">
                  {item.pizza.name} {isCustomized && " (Customized)"}
                </h2>
                <img
                  src={`${HOST}/pizza-image/${item.pizza.image}`}
                  alt="Pizza"
                  className="w-full h-40 object-cover rounded-lg my-3"
                />
                <p className="text-sm">
                  <b>Quantity:</b> {item.quantity}
                </p>
                <p className="text-sm">
                  <b>Base:</b> {item.pizza.base?.name}
                </p>
                <p className="text-sm">
                  <b>Sauce:</b>{" "}
                  {item.pizza.sauce.map((s) => s.name).join(", ") || "None"}
                </p>
                <p className="text-sm">
                  <b>Cheese:</b>{" "}
                  {item.pizza.cheese.map((c) => c.name).join(", ") || "None"}
                </p>
                <p className="text-sm">
                  <b>Toppings:</b>{" "}
                  {item.pizza.toppings.map((t) => t.name).join(", ") || "None"}
                </p>
                <p className="text-lg font-bold mt-2">₹ {item.finalPrice}</p>

                {isCustomized && (
                  <div className="mt-2 bg-gray-100 p-3 rounded-lg">
                    <b>Customizations:</b>
                    <ul className="text-sm list-disc list-inside mt-1">
                      {item.customizations.sauce.length > 0 && (
                        <li>
                          Sauce:{" "}
                          {item.customizations.sauce
                            .map((s) => s.name)
                            .join(", ")}
                        </li>
                      )}
                      {item.customizations.cheese.length > 0 && (
                        <li>
                          Cheese:{" "}
                          {item.customizations.cheese
                            .map((c) => c.name)
                            .join(", ")}
                        </li>
                      )}
                      {item.customizations.toppings.length > 0 && (
                        <li>
                          Toppings:{" "}
                          {item.customizations.toppings
                            .map((t) => t.name)
                            .join(", ")}
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
        <div>
          <p className="text-2xl font-bold">Total Price: ₹ {totalPrice}</p>
          <p className="text-sm mt-1">
            <b>Razor-Order ID:</b> {genOrderId}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          {status !== "cancelled" && status !== "completed" && (
            <div className="flex">
              <label htmlFor="orderStatus">Update Status</label>
              <select 
              disabled={isSubmitting || status === "cancelled" || status === "completed" }
                id="orderStatus"
                value={status}
                onChange={(e) => handleUpdateOrder(e.target.value)}
                className="bg-green-400 hover:cursor-pointer border p-2 rounded-lg w-full"
              >
                <option value="" disabled>
                  Update status
                </option>
                <option value="placed">Placed</option>
                <option value="preparing">Preparing</option>
                <option value="prepared">Prepared</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
