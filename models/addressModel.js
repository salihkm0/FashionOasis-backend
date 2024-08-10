import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  landmark: { type: String },
  city: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: Number, required: true },
  country: { type: String, default: "India" },
  isPrimary : {type : Boolean , default : false}
});

const addressesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    addresses: [addressSchema],
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", addressesSchema);

export default Address;
