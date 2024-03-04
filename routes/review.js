const express= require("express");
const router= express.Router({mergeParams:true});
const listing= require("../models/listing.js")

const wrapAsync= require("../utils/wrapAsync.js");

const Review= require("../models/review.js")
const {validateReviews,isLoggedIn, isReviewAuthor}= require("../middleware.js")
const reviewController= require("../controllers/reviews.js")




// New Review create
  router.post("/", validateReviews,isLoggedIn,wrapAsync(reviewController.createReview))
   
   // delete review route
   router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview) )
   module.exports= router;