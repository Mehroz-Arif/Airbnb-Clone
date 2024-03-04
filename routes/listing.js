const express = require("express");
const listing = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")
const listingController= require("../controllers/listings.js");
const { listingSchema } = require("../schema.js");
const multer  = require('multer')

const {storage}= require("../cloudConfig.js")
const upload = multer({ storage });
router.route("/")
.get(wrapAsync(listingController.index))
.post( isLoggedIn,upload.single('listing[image]') , validateListing, wrapAsync(listingController.createListing))



// New Form
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm))

router.route("/:id")
.get( wrapAsync(listingController.showListings))
.put(isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
