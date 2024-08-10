import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    userId: String,
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    imageUrl: { type: String },
    phoneNumber: String,
    role: {
      type: String,
      default: "customer",
      enum: ["customer", "penddingSeller", "seller", "admin"],
    },
    loginType: {
      type: String,
      enum: ["google", "email", "facebook", "github"],
      default: "email",
    },
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
