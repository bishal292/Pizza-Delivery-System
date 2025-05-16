import { toast } from "sonner";
import { USER_PAYMENT_ROUTE, USER_PAYMENT_VERIFICATION } from "./constant";
import { apiClient } from "./api-client";

export const handleCompletePayment = async (userInfo, orderId, setIsSubmitting) => {
  try {
    setIsSubmitting(true);
    const response = await apiClient.get(`${USER_PAYMENT_ROUTE}?id=${orderId}`, {}, { withCredentials: true });
    if (response.status === 200) {
      toast.success("Payment Initiated..");
      await openRazorPayScreenUI(userInfo, response.data.order);
    }
  } catch (error) {
    console.error("Error completing payment:", error);
    const erroMessage = error.response?.data?.message || error.response?.message || "An error occurred while completing the payment.";
    toast.error(erroMessage);
  } finally {
    setIsSubmitting(false);
  }
};

/**
 *
 * @param {object} response -> response Object containing {razorpay_payment_id,razorpay_order_id,razorpay_signature}
 */
export async function paymentVerification(response) {
  try {
    const verificationResponse = await apiClient.post(
      USER_PAYMENT_VERIFICATION,
      {
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        signature: response.razorpay_signature,
      },
      { withCredentials: true }
    );
    if (verificationResponse.status === 200) {
      toast.success("Payment verified and order placed successfully!");
      window.location.reload();
    }
  } catch (error) {
    console.error("Payment verification failed", error);
    toast.error(
      error.response?.data?.message ||
        error.response?.message ||
        "Payment verification failed."
    );
  }
}

/**
 * 
 * @param {object} userInfo -> object Containing userinformation like email and name
 * @param {object} order -> Object Containing data like {amount,currency,id} 
 * @returns {void} -> Opens Razorpay payment screen
 */
export async function openRazorPayScreenUI(userInfo,order) {
  try {
    const razorpayKey = import.meta.env.VITE_RAZORPAY_API_KEY;
    if (!razorpayKey) {
      toast.error("Razorpay API key is missing. Please contact support.");
      return;
    }

    const options = {
      key: razorpayKey,
      amount: order?.amount || 0,
      currency: order?.currency || "INR",
      name: "Pizzeria",
      description: order?.notes?.description || "",
      order_id: order.id,
      handler: paymentVerification,
      prefill: {
        name: userInfo.name,
        email: userInfo.email,
        contact: "9999999999",
      },
      theme: {
        color: "#F37254",
      },
    };

    if (typeof window.Razorpay !== "undefined") {
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } else {
      console.error("Razorpay SDK not loaded properly.");
    }
  } catch (error) {
    console.error("Error Occurred during opening razorpay screen",error)
  }
}
