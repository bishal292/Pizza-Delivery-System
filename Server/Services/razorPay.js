import Razorpay from "razorpay";
import crypto from "crypto";
import { Order } from "../db/models/Orders.js";
import { User } from "../db/models/UserModel.js";
import { isValidObjectId } from "mongoose";

// Razor-Pay instances
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
  headers: {
    "X-Razorpay-Account": "<merchant_account_id>",
  },
});

// instance.orders.all().then(console.log).catch(console.error);

export const verifyPayment = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = User.findById(userId);
    if(!user)return res.status(404).send("Your user account not found");
    const { orderId, paymentId, signature } = req.body;
    if(!orderId || !paymentId || !signature){
      return res.status(400).json({message: "Invalid Request"})
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
      res
        .status(200)
        .json({ message: "Payment Successful", order: updatedOrder ? updatedOrder : null });
    } else {
      res.status(400).json({ message: "Invalid Payment" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const doPayment = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = User.findById(userId);
    if(!user)return res.status(404).send("Your user account not found");
    const { id } = req.query;
    if(!id || !isValidObjectId(id) )return res.status(400).json({message: "Invalid orderId"})
    const order = await Order.findById(id);
    if(!order)return res.status(404).json({message: "Order not found"});
    if(order.user.toString() !== userId)return res.status(403).json({message: "You are not authorized to make payment for this order"});
    
    if(order.status !== "pending")return res.status(400).json({message: "Order already placed"});


    const options = {
      amount: order.totalAmount * 100,
      currency: "INR",
      receipt: order._id,
    };
    await instance.orders.create(options, (err, order) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
      }
      res.status(200).json({order});
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};