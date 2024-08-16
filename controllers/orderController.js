import Order from "../models/orderModel.js";

//! Get All orders
export const getAllOrders = async (req, res) => {
  console.log("All Orders Hitted");
  try {
    const user = req.user.data;
    if (!user) {
      return res.json({ message: "User Not Found", success: false });
    }
    const orders = await Order.find({ user: req.user.data });
    if (!orders) {
      // return res.json({ message: "Orders Not Found", success: false });
      const orders = await Order.find({ customer: req.user.data });
    }
    if (!orders) {
      return res.json({ message: "Orders Not Found", success: false });
    }

    console.log({ orders: orders });
    return res.json({ message: "Orders Found", success: true, orders: orders });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred", success: false });
  }
};
//! Get Order by ID
export const getOrderById = async (req, res) => {
  console.log("Order by ID Hitted");
  try {
    const user = req.user.data;
    if (!user) {
      return res.json({ message: "User Not Found", success: false });
    }
    const id = req.params.id;
    const order = await Order.findById(id);
    if (!order) {
      return res.json({ message: "Order Not Found", success: false });
    }
    return res.json({ message: "Order Found", success: true, order: order });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred", success: false });
  }
};

//! Get All Order For admin
export const getAllOrdersAdmin = async (req, res) => {
  console.log("Order by ID Hitted");
  try {
    const user = req.user.data;
    if (!user) {
      return res.json({ message: "User Not Found", success: false });
    }
    const orders = await Order.find()
      .populate("customer", "name email") // Populate user details
      .populate({
        path: "products.product",
        select: "name price",
      }); // Populate product details

    if (!orders) {
      return res.json({ message: "Order Not Found", success: false });
    }
    return res.json({ message: "Order Found", success: true, orders: orders });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred", success: false });
  }
};
