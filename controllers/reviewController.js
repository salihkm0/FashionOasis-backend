import Product from "../models/productModel.js";
import Review from "../models/reviewModel.js";

// !add review
export const addReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(400)
        .json({ message: "Product not found", success: false });
    }
    const { rating, review ,userName , userImage} = req.body;

    const newReview = new Review({
      user: req.user.data,
      userDelails: {
        name : userName,
        imageUrl : userImage
      },
      product: req.params.id,
      rating: rating,
      review: review,
    });

    await newReview.save();
    return res.json({
      newReview,
      message: "Review added successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

//!delete
export const deleteReview = async (req, res) => {
  try {
    const deleteReview = await Review.findByIdAndDelete(req.params.id);
    if (!deleteReview) {
      return res
        .status(400)
        .json({ message: "Review not found", success: false });
    }
    res.status(200).json({ message: "Review deleted", success: true });
  } catch (error) {
    res.status(500).json(error);
  }
};

//! update
export const updateReview = async (req, res) => {
  try {
    const updateReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updateReview) {
      return res
        .status(400)
        .json({ message: "Review not found", success: false });
    }
    res.status(200).json({ message: "Review updated", success: true });
  } catch (error) {
    res.status(500).json(error);
  }
};

//!get all review
export const getAllReview = async (req, res) => {
  try {
    // const review = await Review.find();
    const reviews = await Review.find()
    if (!reviews) {
      return res
        .status(400)
        .json({ message: "Review not found", success: false });
    }
    res.status(200).json({ message: "Review found", success: true, reviews });
  } catch (error) {
    res.status(500).json(error);
  }
};

//! get user review 

export const getUserReviews = async (req, res) => {
  try {
    const userId = req.user.data
    const review = await Review.findOne({user : userId});
    if (!review) {
      return res
        .status(400)
        .json({ message: "Review not found", success: false });
    }
    res.status(200).json({ message: "Review found", success: true, review });
  } catch (error) {
    res.status(500).json(error);
  }
};



//! get review by product
// export const getReviewByProduct = async (req, res) => {
//   try {
//     const review = await Review.find({ product: req.params.id });
//     if (!review) {
//       return res
//         .status(400)
//         .json({ message: "Review not found", success: false });
//     }
//     res.status(200).json({ message: "Review found", success: true, review });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };
// // ! get review by product
// export const getReviewByProduct = async (req, res) => {
//   try {
//     const reviews = await Review.find({ product: req.params.id }).populate('user', 'name profilePic');
//     if (!reviews || reviews.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "No reviews found", success: false });
//     }
//     res.status(200).json({ message: "Reviews found", success: true, reviews });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };

// Get reviews by product ID
export const getReviewByProduct = async (req, res) => {
  try {
    // Validate Product ID
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found", success: false });
    }

    // Fetch reviews and populate user details
    // const reviews = await Review.find({ product: req.params.id }).populate('user', 'name imageUrl');
    const reviews = await Review.find({ product: req.params.id });
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found", success: false });
    }

    // Send reviews in response
    res.status(200).json({ message: "Reviews found", success: true, reviews });
  } catch (error) {
    // Log the error and send response
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: error.message, success: false });
  }
};

