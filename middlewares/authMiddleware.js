import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";
import Customer from "../models/userModel.js";

dotenv.config();

// const fetchUser = async (req,res) => {

// }

const preventAuthenticatedAccess = async(req, res, next) => {
    const token = req.cookies.token;
    // const user = null
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        // if(req.user.role === "customer" || req.user.role === "seller"){
        //   user = await User.findById(req.user.data)
        // }
        // else if(req.user.role === "admin"){
        //   user = await Admin.findById(req.user.data)
        // }
        return res.json({message : "Already authenticated",success : true ,user : req.user})
      } catch (error) {
        next();
      }
    } else {
      next();
    }
  };

  export default preventAuthenticatedAccess;