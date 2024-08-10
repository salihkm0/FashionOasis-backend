import bcrypt from "bcrypt";
// import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";
import { adminToken } from "../utils/adminToken.js";
import dotenv from "dotenv"
import { cloudinaryInstance } from "../config/cloudinary.js";

dotenv.config()

//! admin signup
export const signup = async (req, res) => {
  console.log("Admin signup hitted");
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
    const { name, email, password } = req.body;

    //check admin is already exist
    const adminExist = await User.findOne({ email });
    if (adminExist) {
      return res.json({
        message: "Admin is already exist",
        success: false,
      });
    }

    // hashing password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // create new admin

    const newAdmin = new User({
      email,
      // firstName,
      // lastName,
      hashedPassword,
      imageUrl : imageUrl,
      name
    });

    // save the new admin

    const newAdminCreated = await newAdmin.save();

    //check the admin is saved

    if (!newAdminCreated) {
      return res.json({
        message: "Admin is not created",
        success: false,
      });
    }

    // generate token
    const token = adminToken(newAdminCreated);

    //save token in cookie
    res.cookie("token", token,{
      httpOnly: true,
    });
    res.json({
      message: "Signed successfully!",
      success: true,
      user: newAdmin,
      token: token,
    });
    console.log("token : ", token);
  })
  } catch (error) {
    console.log(error, "Something wrong");
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//! admin signin
export const signin = async (req, res) => {
  console.log("Admin sign in hitted");
  try {
    const { email, password } = req.body;
    // check if email and password is provided
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
        success: false,
      });
    }
    // check if user exists
    const admin = await Admin.findOne({ email });
    console.log(admin);
    if (!admin) {
      return res.json({
        message: "Admin not found",
        success: false,
      });
    }
    // check if password is correct
    const isMatchPassword = await bcrypt.compare(
      password,
      admin.hashedPassword
    );
    if (!isMatchPassword) {
      return res.json({
        message: "Invalid credentials",
        success: false,
      });
    }
    // generate token
    const token = adminToken(admin);
    // res.cookie("token", token, {
    //   httpOnly: true,
    // });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      path: '/',
      domain: process.env.COOKIE_DOMAIN || 'localhost',
      // maxAge: 24* 60 * 60 * 1000,
    });
    res.json({
      message: "Signed in successfully!",
      success: true,
      user: admin,
      token: token,
    });
    console.log("token : ", token);
  } catch (error) {
    console.log(error, "Something wrong");
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//! logout

// export const logout = (req, res) => {
//   try {
//     // res.clearCookie("token");
//     res.clearCookie('token', {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'None',
//       path: '/',
//       domain: process.env.COOKIE_DOMAIN || 'localhost',
//     });
//     res.status(200).json({ message: "Logged out successfully", success: true });
//     console.log("Logged out successfully");
//   } catch (error) {
//     console.log(error, "Something wrong");
//     res.status(500).json({
//       err: "Internal Server Error",
//       success: false,
//     });
//   }
// };

export const logout = async (req, res) => {
  try {
    res.clearCookie("token"); // 'token' is the name of the cookie where the JWT is stored
    // res.cookie("token", "");
    res.status(200).json({ message: "Logged out successfully", success: true });
  } catch (error) {
    console.log(error, "Something wrong");
    res.status(500).json({
      err: "Internal Server Error",
      success: false,
    });
  }
};

//! Admin profile

export const adminProfile = async (req, res) => {
  try {
    console.log("Hitted");
    const userId = req.user.data;
    if (!userId) {
      return res.status(401).json({
        err: "Not authorized",
        success: false,
      });
    }
    const user = await Admin.findById(userId);
    console.log(user);
    res.status(200).json({
      message: "Admin profile",
      user: user,
      success: true,
    });
  } catch (error) {
    console.log(error, "Something wrong");
    res.status(500).json({
      err: "Internal Server Error",
      success: false,
    });
  }
};

