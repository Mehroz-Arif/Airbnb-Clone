const listing = require("../models/listing")
const Review = require("../models/review")
module.exports.createReview=async (req,res)=>{
    const listings= await listing.findById(req.params.id);
    const newReview= new Review(req.body.review);
    newReview.author= req.user._id;

    listings.reviews.push(newReview);
    await newReview.save();
    await listings.save();
    req.flash( "success","New review added")
   res.redirect(`/listing/${listings._id}`)
   
   }
   module.exports.destroyReview=async(req,res)=>{
    let{id,reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash( "success","Review Deleted")
    res.redirect(`/listing/${id}`)
  }