const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router
    .route("/")
    .get(wrapAsync(listingController.index))//index route
    .post(isLoggedIn,upload.single("listings[image]"),validateListing, wrapAsync(listingController.createListing)//create route1
);

//new listing route
router.get("/new", isLoggedIn, listingController.renderNewForm);


router
.route("/:id")
.put(isLoggedIn, isOwner, upload.single("listings[image]"), validateListing, wrapAsync(listingController.updateListing))//update route
.get(wrapAsync(listingController.showListing))//show route
.delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));//delete route

//Edit route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.editListing));












module.exports = router;
