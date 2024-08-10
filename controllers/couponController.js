// import Coupon from "../models/couponModel.js";

// //! add coupon
// export const addCoupon = async (req, res) => {
//   console.log("Add coupon Hitted");
//   try {
//     const { code, type, value, expiryDate, isActive } = req.body;
//     const couponExist = await Coupon.findOne({ code });

//     if (couponExist) {
//       return res
//         .status(400)
//         .json({ message: "Coupon already exist", success: false });
//     }
//     const coupon = await Coupon.create({
//       code,
//       type,
//       value,
//       expiryDate,
//       isActive,
//     });

//     if (!coupon) {
//       return res
//         .status(400)
//         .json({ message: "Coupon not created", success: false });
//     }
//     return res.status(200).json({
//       message: "Coupon added successfully",
//       success: true,
//       coupon: coupon,
//     });
//   } catch (error) {
//     console.log(error, "Something wrong");
//     res.status(500).json({
//       message: "Internal Server Error",
//       success: false,
//     });
//   }
// };
// //! get all coupons
// export const getAllCoupons = async (req, res) => {
//   console.log("Get all coupons Hitted");
//   try {
//     const coupons = await Coupon.find();
//     if (coupons.length === 0) {
//       return res.status(400).json({
//         message: "Coupons not found",
//         success: false,
//       });
//     }
//     return res.status(200).json({
//       message: "Coupons found",
//       success: true,
//       coupons: coupons,
//     });
//   } catch (error) {
//     console.log(error, "Something wrong");
//     res.status(500).json({
//       message: "Internal Server Error",
//       success: false,
//     });
//   }
// };
// //! get single coupon
// export const getSingleCoupon = async (req, res) => {
//   console.log("Get single coupon Hitted");
//   try {
//     const {code} = req.body
//     const coupon = await Coupon.findOne({code});
//     if (!coupon) {
//       return res.status(400).json({
//         message: "Coupon not found",
//         success: false,
//       });
//     }
//     return res.status(200).json({
//       message: "Coupon found",
//       success: true,
//       coupon: coupon,
//     });
//   } catch (error) {
//     console.log(error, "Something wrong");
//     res.status(500).json({
//       message: "Internal Server Error",
//       success: false,
//     });
//   }
// };
// //! delete coupon
// export const deleteCoupon = async (req, res) => {
//   console.log("Delete coupon Hitted");
//   try {
//     const coupon = await Coupon.findByIdAndDelete(req.params.id);
//     if (!coupon) {
//       return res.status(400).json({
//         message: "Coupon not found",
//         success: false,
//       });
//     }
//     return res.status(200).json({
//       message: "Coupon deleted",
//       success: true,
//       coupon: coupon,
//     });
//   } catch (error) {
//     console.log(error, "Something wrong");
//     res.status(500).json({
//       message: "Internal Server Error",
//       success: false,
//     });
//   }
// };
// //! update coupon
// export const updateCoupon = async (req, res) => {
//   console.log("Update coupon Hitted");
//   try {
//     const coupon = await Coupon.findByIdAndUpdate(
//       { _id: req.params.id },
//       req.body,
//       { new: true }
//     );
//     if (!coupon) {
//       return res.status(400).json({
//         message: "Coupon not found",
//         success: false,
//       });
//     }
//     return res.status(200).json({
//       message: "Coupon updated",
//       success: true,
//       coupon: coupon,
//     });
//   } catch (error) {
//     console.log(error, "Something wrong");
//     res.status(500).json({
//       message: "Internal Server Error",
//       success: false,
//     });
//   }
// };

import Coupon from "../models/couponModel.js";

//! add coupon
export const addCoupon = async (req, res) => {
  console.log("Add coupon Hitted");
  const { code, discountType, discountValue, expirationDate, usageLimit } =
    req.body;

  try {
    const newCoupon = new Coupon({
      code,
      discountType,
      discountValue,
      expirationDate,
      usageLimit,
    });

    const savedCoupon = await newCoupon.save();

    if (!savedCoupon) {
      return res.json({ message: "Coupon not saved", success: false });
    }
    res.status(201).json({
      message: "Coupon added successfully",
      coupon: savedCoupon,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error, success: false });
    console.log(error);
  }
};

//! get all coupons
export const getAllCoupons = async (req, res) => {
  console.log("Get all coupons Hitted");
  try {
    const coupons = await Coupon.find();
    if (coupons.length === 0) {
      return res.status(400).json({
        message: "Coupons not found",
        success: false,
      });
    }

    // Check for expired coupons
    const currentDate = new Date();
    const validCoupons = coupons.map((coupon) => {
      if (coupon.expiryDate && new Date(coupon.expiryDate) < currentDate) {
        coupon.isActive = false;
      }
      return coupon;
    });

    return res.status(200).json({
      message: "Coupons found",
      success: true,
      coupons: validCoupons,
    });
  } catch (error) {
    console.log(error, "Something wrong");
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//! get single coupon
export const getSingleCoupon = async (req, res) => {
  console.log("Get single coupon Hitted");
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(400).json({
        message: "Coupon not found",
        success: false,
      });
    }

    // Check for expired coupon
    const currentDate = new Date();
    if (coupon.expiryDate && new Date(coupon.expiryDate) < currentDate) {
      coupon.isActive = false;
    }

    return res.status(200).json({
      message: "Coupon found",
      success: true,
      coupon: coupon,
    });
  } catch (error) {
    console.log(error, "Something wrong");
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//! delete coupon
export const deleteCoupon = async (req, res) => {
  console.log("Delete coupon Hitted");
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(400).json({
        message: "Coupon not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Coupon deleted",
      success: true,
      coupon: coupon,
    });
  } catch (error) {
    console.log(error, "Something wrong");
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//! update coupon
export const updateCoupon = async (req, res) => {
  console.log("Update coupon Hitted");
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!coupon) {
      return res.status(400).json({
        message: "Coupon not found",
        success: false,
      });
    }

    // Check for expired coupon
    const currentDate = new Date();
    if (coupon.expiryDate && new Date(coupon.expiryDate) < currentDate) {
      coupon.isActive = false;
    }

    return res.status(200).json({
      message: "Coupon updated",
      success: true,
      coupon: coupon,
    });
  } catch (error) {
    console.log(error, "Something wrong");
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
export const applyCoupon = async (req, res) => {
  const { code, cartTotal } = req.body;

  try {
    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return res.status(400).json({ message: "Invalid coupon code" });
    }

    if (coupon.expirationDate < new Date()) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    if (coupon.usageLimit <= coupon.used) {
      return res.status(400).json({ message: "Coupon usage limit exceeded" });
    }

    let discountAmount;
    if (coupon.discountType === "percentage") {
      discountAmount = (coupon.discountValue / 100) * cartTotal;
    } else {
      discountAmount = coupon.discountValue;
    }

    // coupon.used += 1;
    // await coupon.save();

    res.json({ discountAmount, newTotal: cartTotal - discountAmount });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const clearCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code });
    coupon.used -= 1;
    await coupon.save();
    res.json({ message: "Coupon cleared", success: true, discountAmount: 0 });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
