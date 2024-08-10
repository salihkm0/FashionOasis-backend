import express from "express";
import dotenv from "dotenv";
import crypto from "crypto";
import razorpayInstance from "../config/payment.js";
import Payment from "../models/paymentModel.js";
import { Cart } from "../models/cartModel.js";
import Order from "../models/orderModel.js";
import authenticateUser from "../middlewares/userMiddleware.js";
import axios from "axios";
import { updateProductStockAfterOrder } from "../controllers/productController.js";
import { sendOrderConfirmationEmail } from "../utils/email.js";
import Coupon from "../models/couponModel.js";

dotenv.config();

const paymentRouter = express.Router();

//! payment router

paymentRouter.post("/", authenticateUser, (req, res) => {
  console.log("hitted payment");
  const { amount } = req.body;

  try {
    const options = {
      amount: Number(amount * 100),
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "somthing went wrong!" });
      }
      res.status(200).json({ data: order });
      console.log("order :", order);
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
});

//!Verifying the payment

paymentRouter.post("/verify", authenticateUser, async (req, res) => {
  console.log("Payment verification hit");

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    totalPrice,
    totalQuantity,
    totalDiscount,
    totalTax,
    shippingAddress,
    shippingMethod,
    userFrontend,
    appliedCoupon,
    code,
  } = req.body;

  try {
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    const isAuthentic = expectedSign === razorpay_signature;

    // Get payment details from Razorpay API
    const paymentDetails = await axios.get(
      `https://api.razorpay.com/v1/payments/${razorpay_payment_id}`,
      {
        auth: {
          username: process.env.RAZORPAY_KEY_ID,
          password: process.env.RAZORPAY_KEY_SECRET,
        },
      }
    );

    // Log or save the payment method
    const paymentMethod = paymentDetails.data.method;
    console.log("paymentDetails:", paymentDetails);
    console.log("Payment method:", paymentMethod);

    if (isAuthentic) {
      const payment = new Payment({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
      await payment.save();

      // Save the order after payment verification
      const cart = await Cart.findOne({ user: req.user.data });
      if (!cart) {
        return res
          .status(404)
          .json({ message: "Cart not found", success: false });
      }

      const order = new Order({
        user: req.user.data,
        products: cart.products,
        totalAmount: totalPrice,
        totalQuantity,
        totalDiscount,
        totalTax,
        paymentMethod,
        shippingAddress,
        shippingMethod,
        orderId: razorpay_order_id,
      });
      await order.save();

      // Update product stock and sold count
      const updateResult = await updateProductStockAfterOrder(cart.products);

      console.log('updateResult : ',updateResult);

      if (!updateResult.success) {
        return res
          .status(400)
          .json({ message: updateResult.message, success: false });
      }
      //Remove the cart after checkout
      await Cart.findOneAndDelete({ user: req.user.data });

      console.log("userFrontend : ", userFrontend);
      console.log("userFrontend loginType : ", userFrontend.loginType);

      if (appliedCoupon) {
        console.log("Applied Coupon : ", appliedCoupon);
        const coupon = await Coupon.findOne({ code });
        coupon.used += 1;
        await coupon.save();
      }

      if (userFrontend.loginType !== "github") {
        await sendOrderConfirmationEmail(userFrontend.email, {
          orderId: order._id,
          totalAmount: order.totalAmount,
          totalQuantity: order.totalQuantity,
          products: order.products,
          shippingAddress: order.shippingAddress,
        });
      }
      return res.status(200).json({
        message:
          "Payment verified, order placed, email send and stock updated successfully",
        success: true,
        order,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Invalid signature", success: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!", success: false });
    console.log(error);
  }
});

export default paymentRouter;
