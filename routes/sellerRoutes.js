import express from "express";
import { addBrand } from "../controllers/brandController.js";
import {
  addNewCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/subCategoryController.js";
import {
  addCoupon,
  deleteCoupon,
  getAllCoupons,
  getSingleCoupon,
  updateCoupon,
} from "../controllers/couponController.js";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/productController.js";
import {
  addSubCategory,
  deleteSubCategory,
  getAllSubCategories,
  updateSubCategory,
} from "../controllers/subSubCategoryController.js";
import authenticateSeller from "../middlewares/sellerMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import {
  getAllReview,
  getReviewByProduct,
} from "../controllers/reviewController.js";

const sellerRouter = express.Router();
// brand
sellerRouter.post(
  "/seller/add-brand",
  upload.single("logo"),
  authenticateSeller,
  addBrand
);

//category
sellerRouter.post(
  "/category/add",
  upload.single("image"),
  authenticateSeller,
  addNewCategory
);
sellerRouter.put(
  "/category/update/:id",
  upload.single("image"),
  authenticateSeller,
  updateCategory
);
sellerRouter.get("/category/:id", authenticateSeller, getCategoryById);
sellerRouter.get("/category/all", authenticateSeller, getAllCategories);
sellerRouter.delete("/category/delete/:id", authenticateSeller, deleteCategory);

//sub category
sellerRouter.post(
  "/sub-category/add",
  upload.single("image"),
  authenticateSeller,
  addSubCategory
);

sellerRouter.put(
  "/sub-category/update/:id",
  upload.single("image"),
  authenticateSeller,
  updateSubCategory
);
sellerRouter.delete(
  "/sub-category/delete/:id",
  authenticateSeller,
  deleteSubCategory
);
sellerRouter.get("/sub-category/all", authenticateSeller, getAllSubCategories);

// coupon

sellerRouter.post("/coupon/add", authenticateSeller, addCoupon);
sellerRouter.put("/coupon/update/:id", authenticateSeller, updateCoupon);
sellerRouter.get("/coupon/all", authenticateSeller, getAllCoupons);
sellerRouter.get("/coupon/:id", getSingleCoupon);
sellerRouter.delete("/coupon/delete/:id", authenticateSeller, deleteCoupon);

sellerRouter.post(
  "/product/add",
  authenticateSeller,
  upload.array("images", 10),
  addProduct
);
sellerRouter.get("/product/all", getAllProducts);
sellerRouter.delete("/product/delete/:id", authenticateSeller, deleteProduct);
sellerRouter.put("/product/update/:id", authenticateSeller, updateProduct);
sellerRouter.get("/product/:id", getProductById);

sellerRouter.get("/reviews", getAllReview);
sellerRouter.get(
  "/product/reviews/:id",
  authenticateSeller,
  getReviewByProduct
);

export default sellerRouter;
