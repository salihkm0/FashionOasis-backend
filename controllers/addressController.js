import Address from "../models/addressModel.js";

//! Add Address
export const addAddress = async (req, res) => {
  try {
    const {
      addressLine1,
      addressLine2,
      landmark,
      city,
      district,
      state,
      postalCode,
    } = req.body;

    const userId = req.user.data;
    if (!userId) {
      return res.json({ message: "user not found", success: false });
    }
    const userAddressExist = await Address.findOne({ user: userId });

    console.log("Address : ", userAddressExist);
    if (!userAddressExist) {
      const newUserAddress = new Address({
        user: userId,
        addresses: {
          addressLine1,
          addressLine2,
          landmark,
          city,
          district,
          state,
          postalCode,
        },
      });
      const savedAddress = await newUserAddress.save();
      if (!savedAddress) {
        return res.json({ message: "Address not Saved", success: false });
      }
      return res.json({
        message: "Address Saved",
        success: true,
        Address: savedAddress,
      });
    } else {
      userAddressExist.addresses.push({
        addressLine1,
        addressLine2,
        landmark,
        city,
        district,
        state,
        postalCode,
      });
    }
    const savedAddress = await userAddressExist.save();
    if (!savedAddress) {
      return res.json({ message: "Address not Saved", success: false });
    }
    return res.json({
      message: "Address Saved",
      success: true,
      Address: savedAddress,
    });
  } catch (error) {
    console.log(error, "Something wrong");
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//! Get user address
export const getUserAddress = async (req, res) => {
  try {
    const userId = req.user.data;
    const address = await Address.findOne({ user: userId });
    if (!address) {
      return res.json({ message: "Address not Found", success: false });
    }
    return res.json({
      message: "Addresses found",
      success: true,
      Addresses: address.addresses,
    });
  } catch (error) {
    console.log(error, "Something wrong");
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//! update address

export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const {
      addressLine1,
      addressLine2,
      landmark,
      city,
      district,
      state,
      postalCode,
      isPrimary,
    } = req.body;

    const userId = req.user.data;
    const userAddress = await Address.findOne({ user: userId });
    if (!userAddress) {
      return res
        .status(404)
        .json({ message: "Address not found", success: false });
    }

    const address = userAddress.addresses.id(addressId);
    if (!address) {
      return res
        .status(404)
        .json({ message: "Address not found", success: false });
    }

    address.addressLine1 = addressLine1 || address.addressLine1;
    address.addressLine2 = addressLine2 || address.addressLine2;
    address.landmark = landmark || address.landmark;
    address.city = city || address.city;
    address.district = district || address.district;
    address.state = state || address.state;
    address.postalCode = postalCode || address.postalCode;
    address.isPrimary = isPrimary || address.isPrimary;

    const updatedAddress = await userAddress.save();
    return res.json({
      message: "Address updated successfully",
      success: true,
      Address: updatedAddress,
    });
  } catch (error) {
    console.log(error, "Something wrong");
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//! Delete Address

export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user.data;

    const userAddress = await Address.findOne({ user: userId });
    if (!userAddress) {
      return res
        .status(404)
        .json({ message: "Address not found", success: false });
    }

    const address = userAddress.addresses.id(addressId);
    if (!address) {
      return res
        .status(404)
        .json({ message: "Address not found", success: false });
    }

    address.deleteOne();

    const updatedAddress = await userAddress.save();
    return res.json({
      message: "Address deleted successfully",
      success: true,
      Address: updatedAddress,
    });
  } catch (error) {
    console.log(error, "Something wrong");
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
