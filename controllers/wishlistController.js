import Product from "../models/productModel.js";
import Wishlist from "../models/wishlist.js";
import Customer from "../models/userModel.js";

//! Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.data; // Assuming req.user.data contains the user ID

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found', success: false });
    }

    const user = await Customer.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    const wishlistItem = await Wishlist.findOne({ product: productId, user: userId });

    if (wishlistItem) {
      return res.status(400).json({ message: 'Product already in wishlist', success: false });
    }

    const newWishlistItem = new Wishlist({
      product: productId,
      user: userId,
      isLiked: true,
    });

    await newWishlistItem.save();
    return res.status(201).json({ message: 'Product added to wishlist', success: true, wishlistItem: newWishlistItem });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error', success: false });
  }
};

//! Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.data;

    const wishlistItem = await Wishlist.findOneAndDelete({ product: productId, user: userId });

    if (!wishlistItem) {
      return res.status(404).json({ message: 'Product not found in wishlist', success: false });
    }

    return res.status(200).json({ message: 'Product removed from wishlist', success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error', success: false });
  }
};

//! Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.data;

    const wishlist = await Wishlist.find({ user: userId }).populate('product');

    if (!wishlist.length) {
      return res.status(404).json({ message: 'No products in wishlist', success: false });
    }

    return res.status(200).json({ message: 'Wishlist retrieved successfully', success: true, wishlist });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error', success: false });
  }
};

