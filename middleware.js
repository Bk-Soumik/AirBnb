const Listings = require("./models/listingSchema");
const Review = require("./models/reviewSchema.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedin = (req,res,next) => {
    if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you need to login");
        return res.redirect("/login");
      }
      next();
}

module.exports.reviewListing = (req,res,next) => {
  let {error} = reviewSchema.validate(req.body);

  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
}

module.exports.saveRedirectUrl = (req,res,next) => {
  if(req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async(req,res,next) => {
  let {id} = req.params;
  let listing = await Listings.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","you don't have access to edit");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.isAuthor = async(req,res,next) => {
  let {id, reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","you don't have access to delete");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.validateListing = (req,res,next) => {
  let {error} = listingSchema.validate(req.body);

  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
}