import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        size: String,
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      required: true,
      default: "Completed",
    },
    totalQuantity: {
      type: Number,
      required: true,
      default: 0,
    },
    totalTax: {
      type: Number,
      default: 0,
    },
    totalDiscount: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "razorpay",
    },
    orderStatus: {
      type: String,
      enum: [
        "order-placed",
        "processing",
        "on-the-way",
        "delivered",
        "cancelled",
      ],
      default: "order-placed",
    },
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    shippingMethod: {
      type: String,
      enum: ["free", "fast"],
      default: "free",
    },
    orderId: {
      type: String,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
