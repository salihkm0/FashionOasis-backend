import { cloudinaryInstance } from "../config/cloudinary.js";
import Brand from "../models/brandModel.js";

export const addBrand = async (req, res) => {
  console.log("brand hitted");
  try {
    if (!req.file) {
      return res.send("file is not visible");
    }
    //check brand exists
    const brandName = req.body.brand;
    const brandEmail = req.body.email;
    console.log(brandName,brandEmail);
    const brandExist = await Brand.findOne({ brandName });
    if (brandExist || brandEmail) {
      return res.status(400).json({
        success: false,
        message: "Brand already exist",
      });
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
      const { brand, description, adrress, phone, email, website, seller } =
        req.body;

      //check the name
      if (!brand && !email) {
        return res
          .status(400)
          .json({ error: "You must enter brand name and email." });
      }
      const newBrand = new Brand({
        brand,
        description,
        adrress,
        phone,
        email,
        website,
        seller,
        logo: imageUrl,
      });
      const savedBrand = await newBrand.save();
      res
        .status(200)
        .json({ message: "Saved Brand", success: true, brand: savedBrand });
    });
  } catch (error) {
    console.log(error, "Something wrong");
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//! get single brand

export const getSingleBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res
        .status(404)
        .json({ message: "Brand not found", success: false });
    }
    res.status(200).json({ message: "Brand found", success: true, brand });
  } catch (error) {
    console.log(error, "Something wrong");
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//! get all brands
export const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    if (!brands) {
      return res
        .status(404)
        .json({ message: "Brands not found", success: false });
    }
    res.status(200).json({ message: "Brands found", success: true, brands });
  } catch (error) {
    console.log(error, "Something wrong");
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//! update brand
export const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!brand) {
      return res
        .status(404)
        .json({ message: "Brand is not Updated", success: false });
    }
    res.status(200).json({ message: "Brand is Updated", success: true, brand });
  } catch (error) {
    console.log(error, "Something wrong");
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
