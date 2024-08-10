import { cloudinaryInstance } from "../config/cloudinary.js";
import Product from "../models/productModel.js";

//! add product
export const addProduct = async (req, res) => {
  console.log("Product Add Hitted");
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "No files uploaded", success: false });
    }

    let offerPrice = 0;
    console.log("images :", req.files);
    const imageUrls = [];
    for (const file of req.files) {
      const result = await cloudinaryInstance.uploader.upload(file.path);
      console.log("image path :", result.url);
      imageUrls.push(result.url);
    }

    const {
      sku,
      name,
      price,
      description,
      brand,
      category,
      subCategory,
      subSubCategory,
      seller,
      isOffer,
      color,
    } = req.body;

    // Parse sizes and offer from JSON strings
    const sizes = JSON.parse(req.body.sizes);
    const offer = JSON.parse(req.body.offer);

    const skuExist = await Product.findOne({ sku });
    if (skuExist) {
      return res
        .status(400)
        .json({ message: "SKU already exist", success: false });
    }
    const nameExist = await Product.findOne({ name });
    if (nameExist) {
      return res
        .status(400)
        .json({ message: "Product already exist", success: false });
    }

    if (isOffer && offer.type === "percentage") {
      offerPrice = price - (offer.value * price) / 100;
    } else if (isOffer && offer.type === "amount") {
      offerPrice = price - offer.value;
    }
    const product = new Product({
      sku,
      name,
      price,
      description,
      brand,
      sizes,
      offer,
      imageUrls: imageUrls, // Array of image URLs
      category,
      subCategory,
      subSubCategory,
      seller,
      offerPrice,
      isOffer,
      color,
    });

    const saveProduct = await product.save();
    if (!saveProduct) {
      return res
        .status(400)
        .json({ message: "Product not saved", success: false });
    }

    console.log(product);
    return res
      .status(200)
      .json({ message: "Product saved successfully", success: true, product });
  } catch (error) {
    console.log(error, "Something wrong");
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// get all products

export const getAllProducts = async (req, res) => {
  console.log("Get All Product Hitted");
  try {
    const products = await Product.find();

    if (!products) {
      return res
        .status(400)
        .json({ message: "No products found", success: false });
    }
    return res.status(200).json({
      message: "Products found successfully",
      success: true,
      products,
    });
  } catch (error) {
    console.log(error, "Something wrong");
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// export const getAllProducts = async (req, res) => {
//   try {
//     const { category, price, size, search, ...restQuery } = req.query;

//     let filter = {};

//     if (category) {
//       filter.category = { $in: category.split(',') };
//     }

//     if (price) {
//       const [minPrice, maxPrice] = price.split('-').map(Number);
//       filter.price = { $gte: minPrice, $lte: maxPrice };
//     }

//     if (size) {
//       filter['sizes.size'] = { $in: size.split(',') };
//     }

//     if (search) {
//       filter.title = { $regex: search, $options: 'i' };
//     }

//     const products = await Product.find(filter);

//     res.status(200).json({
//       success: true,
//       results: products.length,
//       data: {
//         products
//       }
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message
//     });
//   }
// };

//! delete product
export const deleteProduct = async (req, res) => {
  console.log("Delete Product Hitted");
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(400)
        .json({ message: "No product found", success: false });
    }
    const deleteProduct = await Product.findByIdAndDelete(id);
    if (!deleteProduct) {
      return res
        .status(400)
        .json({ message: "Product not deleted", success: false });
    }
    return res.status(200).json({
      message: "Product deleted successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.log(error, "Something wrong");
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
//! update product
// export const updateProduct = async (req, res) => {
//   console.log("Update Product Hitted");
//   try {
//     const { id } = req.params;
//     console.log('update id :',req.params.id)
//     const { isOffer,offer , price, ...updateFields } = req.body;

//     // Find the product by id
//     const product = await Product.findById(id);
//     if (!product) {
//       return res.status(400).json({ message: "No product found", success: false });
//     }

//     // Calculate the offer price if an offer is present
//     let offerPrice = 0;
//     if (isOffer && offer.type === "percentage") {
//       offerPrice = price - (offer.value * price) / 100;
//     } else if (isOffer && offer.type === "amount") {
//       offerPrice = price - offer.value;
//     }

//     // Include offerPrice in the update fields if calculated
//     if (offerPrice > 0) {
//       updateFields.offerPrice = offerPrice;
//     }

//     // Update the product with new fields including offerPrice if present
//     const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, {
//       new: true,
//     });

//     if (!updatedProduct) {
//       return res.status(400).json({ message: "Product not updated", success: false });
//     }

//     return res.status(200).json({
//       message: "Product updated successfully",
//       success: true,
//       updatedProduct,
//     });
//   } catch (error) {
//     console.log(error, "Something wrong");
//     res.status(500).json({
//       message: "Internal Server Error",
//       success: false,
//     });
//   }
// };

export const updateProduct = async (req, res) => {
  console.log("Update Product Hitted");
  try {
    const { id } = req.params;
    console.log("Update id:", id);

    const { isOffer, offer, price, ...updateFields } = req.body;
    console.log("Request body:", req.body);

    // Find the product by id
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(400)
        .json({ message: "No product found", success: false });
    }

    // Calculate the offer price if an offer is present
    let offerPrice = 0;
    if (isOffer) {
      if (offer.type === "percentage") {
        offerPrice = price - (offer.value * price) / 100;
      } else if (offer.type === "amount") {
        offerPrice = price - offer.value;
      }
    }

    // Include offerPrice in the update fields if calculated
    if (offerPrice > 0) {
      updateFields.offerPrice = offerPrice;
    }

    // Update the product with new fields including offerPrice if present
    const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    if (!updatedProduct) {
      return res
        .status(400)
        .json({ message: "Product not updated", success: false });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      success: true,
      updatedProduct,
    });
  } catch (error) {
    console.error(error, "Something went wrong");
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//! get product by id
export const getProductById = async (req, res) => {
  console.log("Get Product by Id Hitted");
  console.log(req.params);
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(400)
        .json({ message: "No product found", success: false });
    }
    return res
      .status(200)
      .json({ message: "Product found successfully", success: true, product });
  } catch (error) {
    console.log(error, "Something wrong");
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// export const updateProductStockAfterOrder = async (orderItems) => {
//   console.log("hitted updateProductStockAfterOrder");
//   try {
//     const updates = orderItems.map(async (item) => {
//       console.log("item", item);

//       const { product, size, quantity } = item;

//       const soldProduct = await Product.findById(product);

//       if (!soldProduct) {
//         throw new Error(`Product with ID ${product} not found.`);
//       }

//       soldProduct.sold += quantity;

//       const sizeObj = soldProduct.sizes.find((s) => s.size === size);
//       if (sizeObj) {
//         sizeObj.quantity -= quantity;
//         if (sizeObj.quantity < 0) {
//           throw new Error(
//             `Insufficient quantity for product ${soldProduct.name} in size ${size}.`
//           );
//         }
//       } else {
//         throw new Error(
//           `Size ${size} not found for product ${soldProduct.name}.`
//         );
//       }
//       await soldProduct.save();
//     });

//     await Promise.all(updates);

//     return { success: true, message: "Product stock updated successfully." };
//   } catch (error) {
//     return { success: false, message: error.message };
//   }
// };

// export const updateProductStockAfterOrder = async (orderItems) => {
//   console.log("hitted updateProductStockAfterOrder");
//   try {
//     const updates = orderItems.map(async (item) => {
//       console.log("item", item);

//       const { product, size, quantity } = item;

//       const soldProduct = await Product.findById(product);

//       if (!soldProduct) {
//         throw new Error(`Product with ID ${product} not found.`);
//       }

//       // Find the size object for the product
//       const sizeObj = soldProduct.sizes.find((s) => s.size === size);
//       if (sizeObj) {
//         // Update the sold count and stock quantity for the specific size
//         sizeObj.quantity -= quantity;
//         if (sizeObj.quantity < 0) {
//           throw new Error(
//             `Insufficient quantity for product ${soldProduct.name} in size ${size}.`
//           );
//         }
//         // Increase the total sold count by the quantity ordered for this size
//         soldProduct.sold += quantity;
//       } else {
//         throw new Error(
//           `Size ${size} not found for product ${soldProduct.name}.`
//         );
//       }

//       await soldProduct.save();
//     });

//     await Promise.all(updates);

//     return { success: true, message: "Product stock updated successfully." };
//   } catch (error) {
//     return { success: false, message: error.message };
//   }
// };

// export const updateProductStockAfterOrder = async (orderItems) => {
//   console.log("hitted updateProductStockAfterOrder");
//   try {
//     const productUpdates = {};

//     // Accumulate updates for each product
//     orderItems.forEach((item) => {
//       console.log('item : ',item)
//       const { product, size, quantity } = item;

//       if (!productUpdates[product]) {
//         productUpdates[product] = { totalSold: 0, sizeUpdates: [] };
//       }

//       productUpdates[product].totalSold += quantity;
//       productUpdates[product].sizeUpdates.push({ size, quantity });
//     });

//     console.log('productUpdates : ',productUpdates)

//     // Apply updates to each product
//     const updatePromises = Object.keys(productUpdates).map(async (productId) => {
//       const soldProduct = await Product.findById(productId);

//       if (!soldProduct) {
//         throw new Error(`Product with ID ${productId} not found.`);
//       }

//       // Update sold count
//       soldProduct.sold += productUpdates[productId].totalSold;

//       // Update stock quantities for each size
//       productUpdates[productId].sizeUpdates.forEach(({ size, quantity }) => {
//         const sizeObj = soldProduct.sizes.find((s) => s.size === size);
//         if (sizeObj) {
//           sizeObj.quantity -= quantity;
//           if (sizeObj.quantity < 0) {
//             throw new Error(
//               `Insufficient quantity for product ${soldProduct.name} in size ${size}.`
//             );
//           }
//         } else {
//           throw new Error(
//             `Size ${size} not found for product ${soldProduct.name}.`
//           );
//         }
//       });

//       await soldProduct.save();
//     });

//     await Promise.all(updatePromises);

//     return { success: true, message: "Product stock updated successfully." };
//   } catch (error) {
//     return { success: false, message: error.message };
//   }
// };

export const updateProductStockAfterOrder = async (orderItems) => {
  console.log("hitted updateProductStockAfterOrder");

  try {
    const productUpdates = {};

    // Accumulate updates for each product
    orderItems.forEach((item) => {
      console.log("item : ", item);
      const { product, size, quantity } = item;

      if (!productUpdates[product]) {
        productUpdates[product] = { totalSold: 0, sizeUpdates: [] };
      }

      productUpdates[product].totalSold += quantity;
      productUpdates[product].sizeUpdates.push({ size, quantity });
    });

    console.log("productUpdates : ", productUpdates);

    // Apply updates to each product
    const updatePromises = Object.keys(productUpdates).map(
      async (productId) => {
        try {
          console.log("Processing productId: ", productId);

          const soldProduct = await Product.findById(productId);
          console.log("soldProduct: ", soldProduct);

          if (!soldProduct) {
            throw new Error(`Product with ID ${productId} not found.`);
          }

          // Check if seller field is valid
          if (!soldProduct.seller) {
            throw new Error(
              `Seller field is missing or invalid for product ${productId}`
            );
          }

          // Update sold count
          soldProduct.sold += productUpdates[productId].totalSold;
          console.log("Updated sold count: ", soldProduct.sold);

          // Update stock quantities for each size
          productUpdates[productId].sizeUpdates.forEach(
            ({ size, quantity }) => {
              const sizeObj = soldProduct.sizes.find((s) => s.size === size);
              if (sizeObj) {
                sizeObj.quantity -= quantity;
                console.log(
                  `Updated size ${size} quantity: `,
                  sizeObj.quantity
                );

                if (sizeObj.quantity < 0) {
                  throw new Error(
                    `Insufficient quantity for product ${soldProduct.name} in size ${size}.`
                  );
                }
              } else {
                throw new Error(
                  `Size ${size} not found for product ${soldProduct.name}.`
                );
              }
            }
          );

          await soldProduct.save();
          console.log("Product saved: ", soldProduct);
        } catch (innerError) {
          console.error("Error within updatePromises: ", innerError);
          throw innerError; // Re-throw to propagate error to outer catch block
        }
      }
    );

    await Promise.all(updatePromises);

    console.log("All products updated successfully");
    return { success: true, message: "Product stock updated successfully." };
  } catch (error) {
    console.error("Error updating product stock: ", error);
    return { success: false, message: error.message };
  }
};
