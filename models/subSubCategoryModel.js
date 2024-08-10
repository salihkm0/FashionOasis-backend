import mongoose from "mongoose";

const subSubCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  imageUrl: {
    type: String,
  },
  // slug: { type: String, required: true, unique: true },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
    required: true,
  },
});

const SubSubCategory = mongoose.model("SubSubCategory" ,subSubCategorySchema)

export default SubSubCategory