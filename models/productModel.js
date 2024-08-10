import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema({
  size: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
    },
    name: {
      type: String,
      trim: true,
    },
    imageUrls: [String],
    description: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
    },
    sizes: { type: [sizeSchema], required: true },
    price: {
      type: Number,
    },
    isOffer: { type: Boolean, default: false },
    offer: {
      type: {
        type: String,
        enum: ["percentage", "amount"],
        default: "percentage",
      },
      value: Number,
    },
    offerPrice: { type: Number, default: 0 },
    isTaxable: {
      type: Boolean,
      default: false,
    },
    taxRate: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    sold: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ["men", "women", "kids"],
    },
    subCategory: {
      type: String,
    },
    subSubCategory: {
      type: String,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    color: {
      type: String,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
