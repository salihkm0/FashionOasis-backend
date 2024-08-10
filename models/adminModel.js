import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    //   username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true, min: 6 },
    role: { type: String, default: "admin", enum: "admin" },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
