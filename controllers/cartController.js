import { Cart } from "../models/cartModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import { updateProductStockAfterOrder } from "./productController.js";

// Add to Cart
export const addToCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, size } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        message: "Quantity is required and must be greater than zero",
        success: false,
      });
    }
    if (!size) {
      return res
        .status(400)
        .json({ message: "Size is required", success: false });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }

    const cart = await Cart.findOne({ user: req.user.data });
    if (!cart) {
      const newCart = new Cart({
        user: req.user.data,
        products: [
          {
            product: product._id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.image,
            size,
          },
        ],
      });
      await newCart.save();
      return res.status(201).json({
        message: "Product added to cart",
        success: true,
        product: newCart.products[0],
      });
    } else {
      const productInCart = cart.products.find(
        (p) => p.product.toString() === id && p.size === size
      );

      if (productInCart) {
        productInCart.quantity += quantity;

        if (productInCart.quantity <= 0) {
          cart.products = cart.products.filter(
            (p) => p.product.toString() !== id || p.size !== size
          );
        }

        await cart.save();
        return res.status(200).json({
          message: "Product quantity updated",
          success: true,
          product: productInCart,
        });
      } else {
        cart.products.push({
          product: product._id,
          name: product.name,
          price: product.price,
          quantity,
          image: product.image,
          size,
        });

        await cart.save();
        return res.status(201).json({
          message: "Product added to cart",
          success: true,
          product: cart.products[cart.products.length - 1],
        });
      }
    }
  } catch (error) {
    console.error("Add to cart error: ", error);
    return res
      .status(500)
      .json({ message: "An error occurred", success: false });
  }
};

//get cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.data });
    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found", success: false });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred", success: false });
  }
}

export const updateCart = async (req, res) => {
  try {
    const { id, quantity, size } = req.body;
    const cart = await Cart.findOne({ user: req.user.data });

    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found", success: false });
    }

    const productInCart = cart.products.find(
      (p) => p.product.toString() === id && p.size === size
    );

    if (productInCart) {
      productInCart.quantity += quantity;

      if (productInCart.quantity <= 0) {
        cart.products = cart.products.filter(
          (p) => p.product.toString() !== id || p.size !== size
        );
      }

      await cart.save();
      res.status(200).json({
        message:
          productInCart.quantity <= 0
            ? "Product removed from cart"
            : "Product quantity updated",
        success: true,
        cart,
      });
    } else {
      res
        .status(404)
        .json({ message: "Product not found in cart", success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", success: false });
  }
}

//! delete cart
export const deleteCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndDelete({ user: req.user.data });
    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found", success: false });
    }
    res.status(200).json({ message: "Cart deleted", success: true });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred", success: false });
  }
};

export const deleteCartProduct = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.data });

    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found", success: false });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === req.params.id && p.size === req.body.size
    );

    if (productIndex !== -1) {
      cart.products.splice(productIndex, 1);
      await cart.save();
      res.status(200).json({ message: "Product deleted", success: true, cart });
    } else {
      res
        .status(404)
        .json({ message: "Product not found in cart", success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", success: false });
  }
};

export const checkout = async (req, res) => {
  const {
    totalPrice,
    totalQuantity,
    totalDiscount,
    totalTax,
    shippingAddress,
    paymentMethod,
    shippingMethod,
  } = req.body;

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ user: req.user.data });
    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found", success: false });
    }

    // Create the order
    const order = new Order({
      user: req.user.data,
      products: cart.products,
      totalAmount: totalPrice,
      totalQuantity: totalQuantity,
      totalDiscount: totalDiscount,
      totalTax: totalTax,
      paymentMethod: paymentMethod,
      shippingAddress: shippingAddress,
      shippingMethod: shippingMethod,
    });
    await order.save();

    const updateResult = await updateProductStockAfterOrder(cart.products);

    if (!updateResult.success) {
      console.log("updateResult", updateResult);
      return res
        .status(400)
        .json({ message: updateResult.message, success: false });
    }

    await Cart.findOneAndDelete({ user: req.user.data });

    res.status(200).json({
      message: "Order placed successfully",
      success: true,
      order: order,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred", success: false });
  }
};
