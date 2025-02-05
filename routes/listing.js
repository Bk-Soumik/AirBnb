const express = require("express");
const router = express.Router();
const Listings = require("../models/listingSchema");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedin, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});
const listingController = require("../controllers/listing.js");

router.route("/")
  .get(wrapAsync(listingController.index))
  .post( isLoggedin, upload.single(`listing[image]`), validateListing, wrapAsync(listingController.createListing));

 //new route
 router.get("/new", isLoggedin, listingController.renderNewForm);

router.route("/:id")
  .put( isLoggedin, isOwner, upload.single(`listing[image]`), validateListing, wrapAsync(listingController.updateListing))
  .delete(isLoggedin, isOwner, wrapAsync(listingController.destroyListing))
  .get(wrapAsync(listingController.showListing));

  //edit route
  router.get("/:id/edit", isLoggedin, isOwner, wrapAsync(listingController.editListing));
  
  module.exports = router;