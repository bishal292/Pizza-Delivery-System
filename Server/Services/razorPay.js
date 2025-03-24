import Razorpay from "razorpay";
import crypto from "crypto";
import { User } from "../db/models/UserModel.js";
import { Order } from "../db/models/Orders.js";

// Razor-Pay instances
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
  headers: {
    "X-Razorpay-Account": "<merchant_account_id>",
  },
});

/**
 * Verify Payment -> User Accessing this controller must be authenticated.
 * @param {Request} req -> orderId, paymentId, signature in req.body
 * @param {Response} res -> Response with status and message
 * @param {NextFunction} next
 */
export const verifyPayment = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = User.findById(userId);
    if (!user) return res.status(404).send("Your user account not found");
    const { orderId, paymentId, signature } = req.body;
    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({
        message: "Invalid Request",
        reason: "Missing orderId, paymentId or signature",
      });
    }
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");
    if (expectedSignature === signature) {
      const updatedOrder = await Order.findOneAndUpdate(
        { orderId },
        { status: "placed", paymentId },
        { new: true }
      );
      res.status(200).json({
        message: "Payment Successful",
        order: updatedOrder ? updatedOrder : null,
      });
    } else {
      res.status(400).json({ message: "Invalid Payment" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

/**
 *
 * @param {string} orderId
 * @param {number} amount
 * @param {string} currency -> Default: INR
 * @returns
 */
export const createPayment = async (amount, currency = "INR") => {
  try {
    const razorpayOrder = await instance.orders.create({
      amount: amount * 100, // Amount in paise (₹1 = 100 paise)
      currency: currency,
      payment_capture: 1, // Auto-capture payment
      notes: {
        description: "Pizza Delivery System Payment",
      },
    });
    return { success: true, order: razorpayOrder };
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return {
      success: false,
      message: "Failed to create payment order.",
      error,
    };
  }
};

/**
 *
 * @param {string} razorpayOrderId
 * @returns
 */
export const refundOrder = async (razorpayOrderId) => {
  try {
    const order = await instance.orders.fetch(razorpayOrderId);

    if (order.status !== "paid") {
      console.log("Order is not paid. No refund required.");
      return {
        success: false,
        message: "Order is not paid, no refund needed.",
      };
    }

    const payments = await instance.orders.fetchPayments(razorpayOrderId);

    if (payments.items.length === 0) {
      console.log("No payments found for this order.");
      return { success: false, message: "No payments found." };
    }

    const paymentId = payments.items[0].id;

    // Create the refund
    const refund = await instance.payments.refund(paymentId, {
      amount: order.amount,
      speed: "normal",
      notes: {
        reason: "Order cancelled",
      },
    });

    console.log("Refund successful:", refund);
    return { success: true, message: "Refund processed successfully.", refund };
  } catch (error) {
    console.error("Error processing refund:", error);
    return { success: false, message: "Refund failed.", error };
  }
};

/**
 *
 * @param {string} razorpayOrderId
 * @returns { success: boolean, isPaid: boolean }
 */
export const checkOrderStatus = async (razorpayOrderId) => {
  try {
    // Fetch the order from Razorpay
    const razorpayOrder = await instance.orders.fetch(razorpayOrderId);

    if (!razorpayOrder) {
      return { success: false, message: "Order not found in Razorpay." };
    }
    console.log(razorpayOrder);
    return {
      success: true,
      isPaid: razorpayOrder.status === "paid",
      razorpayOrder,
    };
  } catch (error) {
    console.error("Error checking Razorpay order status:", error);
    return { success: false, message: "Failed to fetch order status.", error };
  }
};

/**
 *
 * @param {string} orderId
 * @returns
 */

export async function checkPayment(razorpayOrderId) {
  try {

    const payments = await instance.orders.fetchPayments(razorpayOrderId);

    const isPaid = payments.items.some((payment) => payment.status !== "paid");
    return{
      success:true,
      isPaid:isPaid,
      payments
    }
  } catch (error) {
    console.error("Error checking Razorpay order status:", error);
    return { success: false, message: "Failed to fetch order status.", error };
  }
}
