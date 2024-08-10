import nodemailer from "nodemailer";
import Product from "../models/productModel.js";
import Address from "../models/addressModel.js";

export const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {
  try {
    const { orderId, totalAmount, totalQuantity, products, shippingAddress } =
      orderDetails;

    const productIds = products.map((product) => product.product);
    const productDetails = await Product.find({ _id: { $in: productIds } });

    const addressDocument = await Address.findOne({
      "addresses._id": shippingAddress,
    });

    if (!addressDocument) {
      throw new Error("Shipping address not found");
    }

    const shippingAddressDetails =
      addressDocument.addresses.id(shippingAddress);

    const productsListHtml = products
      .map((product) => {
        const productDetail = productDetails.find(
          (item) => item._id.toString() === product.product.toString()
        );
        return `
        <li>
          <strong>${productDetail.name}</strong> (${product.size}) - ${
          product.quantity
        } x $${productDetail.price} = $${productDetail.price * product.quantity}
        </li>
      `;
      })
      .join("");

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Order Confirmation - Order # " + orderId,
      html: `
        <h3>Thank you for your order!</h3>
        <p>Order ID: <strong>${orderId}</strong></p>
        <p>Total Amount: <strong>$${totalAmount.toFixed(2)}</strong></p>
        <p>Total Quantity: <strong>${totalQuantity}</strong></p>
        <p>Shipping Address: <strong>${shippingAddressDetails.addressLine1}, ${
        shippingAddressDetails.addressLine2
          ? shippingAddressDetails.addressLine2 + ", "
          : ""
      }${
        shippingAddressDetails.landmark
          ? shippingAddressDetails.landmark + ", "
          : ""
      }${shippingAddressDetails.city}, ${shippingAddressDetails.district}, ${
        shippingAddressDetails.state
      } - ${shippingAddressDetails.postalCode}</strong></p>
        <h4>Ordered Products:</h4>
        <ul>
          ${productsListHtml}
        </ul>
        <p>We hope you enjoy your purchase! Your order will be shipped to you shortly.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};
