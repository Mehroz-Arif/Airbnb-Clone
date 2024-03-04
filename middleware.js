const listing = require("./models/listing");
const Review = require("./models/review");
const expressError = require("./utils/expressError.js");
const {listingSchema,reviewSchema }= require("./schema.js")




module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl= req.originalUrl;

        req.flash("error", "You must have to loggedIn to create the listing");
        return res.redirect("/login")
    }
    next();

}
module.exports.savedRedirectUrl= (req,res,next)=>{
    if (req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
        
        
    }
    next();
}
module.exports.isOwner= async(req,res,next)=>{
    let { id }= req.params;
    let Listing= await listing.findById(id);
    console.log(Listing.owner);
    if(!Listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error", "You are no Authorized User")
        return res.redirect(`/listing/${id }`);

    }
    next()



}
module.exports.validateListing=(req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
  
    if(error){
      let errMsg= error.details.map((el)=> el.message).join(",");
      console.log(errMsg);
      throw new expressError(400, errMsg)
    }
    else
    {
      
      next();
    }
  }
module.exports.validateReviews=(req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
  
    if(error){
      let errMsg= error.details.map((el)=> el.message).join(",");
      console.log(errMsg);
      throw new expressError(400, errMsg)
    }
    else
    {
      
      next();
    }
  }
  module.exports.isReviewAuthor= async(req,res,next)=>{
    let {id, reviewId }= req.params;
    let review= await Review.findById(reviewId);
    
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error", "You are not the author of this review")
        return res.redirect(`/listing/${id }`);

    }
    next()



}