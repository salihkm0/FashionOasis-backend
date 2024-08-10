import { cloudinaryInstance } from "../config/cloudinary.js";
import SubCategory from "../models/subCategoryModel.js";


//! add category
export const addNewCategory = (req, res) => {
  console.log("Add New Category Hitted");

  try {
    if (!req.file) {
      return res.send("file is not visible");
    }
    cloudinaryInstance.uploader.upload(req.file.path, async (err, result) => {
      if (err) {
        console.log(err, "error");
        return res.status(500).json({
          success: false,
          message: "Error",
        });
      }
      const imageUrl = result.url;
      const { name, description } = req.body;

      // category exists
      const subCategoryExist = await SubCategory.findOne({ name });

      if (subCategoryExist) {
        return res
          .status(400)
          .json({ message: "Category already exist", success: false });
      }
      //check the name
      if (!name) {
        return res.status(400).json({ error: "You must enter name." });
      }

      // create new Category

      const newCategory = new SubCategory({
        name: name,
        description: description,
        imageUrl: imageUrl,
      });

      const newCategoryCreated = await newCategory.save();
      if (!newCategoryCreated) {
        return res.send("course is not created");
      }
      return res.send(newCategoryCreated);
    });
  } catch (error) {
    console.log(error, "Something wrong");
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//! get all categories
export const getAllCategories = async (req, res) => {
  console.log("Get All Category Hitted");
  try {
    const subCategories = await SubCategory.find();
    if (!subCategories) {
      return res.status(400).json({
        message: "No categories found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Categories found",
      success: true,
      subCategories: subCategories,
    });
  } catch (error) {
    console.log(error, "Something wrong");
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
//! get category by id
export const getCategoryById = async (req, res) => {
  console.log("Get Category Hitted");
  try {
    const subCategory = await SubCategory.findById(req.params.id);
    if (!subCategory) {
      return res.status(400).json({
        message: "No category found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Category found",
      success: true,
      subCategory: subCategory,
    });
  } catch (error) {
    console.log(error, "Something wrong");
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
//! update category
export const updateCategory = async (req, res) => {
  console.log("Update Category Hitted");
  try {
    const subCategory = await SubCategory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!subCategory) {
      return res.status(400).json({
        message: "No category found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Category updated",
      success: true,
      subCategory: subCategory,
    });
  } catch (error) {
    console.log(error, "Something wrong");
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
//! delete category
export const deleteCategory = async (req, res) => {
  console.log("Delete Category Hitted");
  try {
    const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
    if (!subCategory) {
      return res.status(400).json({
        message: "No category found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Category deleted",
      success: true,
      subCategory: subCategory,
    });
  } catch (error) {
    console.log(error, "Something wrong");
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
