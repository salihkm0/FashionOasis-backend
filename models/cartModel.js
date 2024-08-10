import mongoose from "mongoose";

// Cart Item Schema
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: Number,
  price: {
    type: Number,
    default: 0,
  },
  size : {
    type: String,
  },
  image: {
    type: String,
  },
});

export const CartItem = mongoose.model("CartItem", cartItemSchema);

// Cart Schema

const cartSchema = new mongoose.Schema(
  {
    products: [cartItemSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);
