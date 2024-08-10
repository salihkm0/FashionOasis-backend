import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  brand: { type: String, required: true, unique: true },
  description: { type: String },
  logo: { type: String },
  adrress: { type: String },
  phone: { type: String },
  email: { type: String,required: true },
  website: { type: String },
  seller : {type : mongoose.Schema.ObjectId , ref : 'User' , required : true},
  isVerified: { type: Boolean, default: false },
  status: {
    type: String,
    default: "pendding",
    enum: ['pendding' , 'accepted' , 'rejected','deleted'],
  },
});

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
