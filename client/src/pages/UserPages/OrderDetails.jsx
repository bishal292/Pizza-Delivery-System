import LoadingScreen from "@/components/LoadingScreen";
import { useAppStore } from "@/Store/store";
import { apiClient } from "@/utils/api-client";
import { HOST, USER_CANCEL_ORDER, USER_GET_ORDER_DETAILS } from "@/utils/constant";
import { handleCompletePayment } from "@/utils/razorpayServices";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const OrderDetails = () => {
  const {userInfo} = useAppStore();
  const { orderId } = useParams();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [genOrderId, setGenOrderId] = useState("");
  const [tableNumber, setTableNumber] = useState(null);
  const [status, setStatus] = useState("");
  const [dailyOrderId, setDailyOrderId] = useState(null)
  const [isSubmitting,setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await apiClient.get(
          `${USER_GET_ORDER_DETAILS}?id=${orderId}`,
          { withCredentials: true }
        );

        if (response.status === 200) {
          setOrderDetails(response.data.items);
          setTotalPrice(response.data.totalPrice);
          setGenOrderId(response.data.orderId);
          setDailyOrderId(response.data?.dailyOrderId)
          setTableNumber(response.data.tableNo);
          setStatus(response.data.status);
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

  const handleCancelOrder = async () => {
    try {
      setIsSubmitting(true);
      const response = await apiClient.get(`${USER_CANCEL_ORDER}?id=${orderId}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        toast.success(response.data)
        setStatus("cancelled");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(error.response?.data?.message || error.response?.message || "Failed to cancel order.");
    }finally{
      setIsSubmitting(false);
    }
  };



  if (loading) {
    return <LoadingScreen message="Fetching Order Details" />;
  }

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">Your Order Details {dailyOrderId && <> with id <span className=" text-orange-600 " >{dailyOrderId}</span> </> } </h1>

      {/* Order Info */}
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

      {/* Order Items */}
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

      {/* Order Summary & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
        <div>
          <p className="text-2xl font-bold">Total Price: ₹ {totalPrice}</p>
          <p className="text-sm mt-1">
            <b>Order ID:</b> {genOrderId}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          {status === "pending" && (
            <button
              onClick={() => handleCompletePayment(userInfo, orderId, setIsSubmitting)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all"
              disabled={isSubmitting}
            >
              Complete Payment
            </button>
          )}
          {(status === "pending" || status === "placed") && (
            <button
              onClick={handleCancelOrder}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all"
              disabled={isSubmitting}
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
