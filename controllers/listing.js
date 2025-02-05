const Listings = require("../models/listingSchema");

module.exports.index = async(req,res) => {
    const allListings = await Listings.find({});
    res.render("listings/index.ejs" , {allListings});
  }

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
  }

module.exports.showListing = async(req,res) => {
    let {id} = req.params;
    const listing = await Listings.findById(id).populate({path: "reviews", populate: {path: "author",}}).populate("owner");
    if(!listing){
      req.flash("error","listing doesnot exists");
      res.redirect(`/listings`);
    }
    res.render("listings/show.ejs", {listing});
  }

module.exports.createListing = async(req,res) => {
  let url = req.file.path;
  let filename = req.file.filename;
    const newListing = new Listings(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success","new listing created successfully");
    res.redirect("/listings");
  }

module.exports.editListing = async(req,res) => {
    let {id} = req.params;
    let listing = await Listings.findById(id);
    if(!listing){
      req.flash("error","listing doesnot exists");
      res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
  }

module.exports.updateListing = async(req,res) => {
    let {id} = req.params;
    let listing = await Listings.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file != "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = {url, filename};
      await listing.save();
    }

    req.flash("success","listing updated successfully");
    res.redirect(`/listings/${id}`);
  }

module.exports.destroyListing = async(req,res) => {
    let {id} = req.params;
    let deletedListing = await Listings.findByIdAndDelete(id);
    req.flash("success","listing deleted successfully");
    console.log(deletedListing);
    res.redirect("/listings");
  }