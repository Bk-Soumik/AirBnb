const Review = require("../models/reviewSchema.js");
const Listings = require("../models/listingSchema");
const { model } = require("mongoose");

module.exports.createReview = async(req,res) => {
    let listing = await Listings.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
  
    await newReview.save();
    await listing.save();
    req.flash("success","new review created successfully");
    res.redirect(`/listings/${listing.id}`);
  }

module.exports.redirectReview = (req,res)=>{
  let {id} = req.params;
  res.redirect(`/listings/${id}`);
}

module.exports.destroyReview = async(req,res) => {
  let {id,reviewId} = req.params;
  await Listings.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","review deleted successfully");
  res.redirect(`/listings/${id}`);
}