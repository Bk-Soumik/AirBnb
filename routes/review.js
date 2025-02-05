const express = require("express");
const router = express.Router({mergeParams: true});
const Review = require("../models/reviewSchema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {reviewListing, isLoggedin, isAuthor} = require("../middleware.js")

const reviewController = require("../controllers/review.js");

//review route
router
.get("/", reviewController.redirectReview)
.post("/", isLoggedin, reviewListing, wrapAsync(reviewController.createReview))

//remove review route
router.delete("/:reviewId", isLoggedin, isAuthor, wrapAsync(reviewController.destroyReview))

module.exports = router;