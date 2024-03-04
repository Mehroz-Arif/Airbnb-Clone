const listing = require("../models/listing.js")
const { listingSchema } = require("../schema.js");

const multer = require('multer')

const { storage } = require("../cloudConfig.js")
const upload = multer({ storage })
module.exports.index = async (req, res) => {
    const allListing = await listing.find({});

    res.render("listing/index.ejs", { allListing });

}
module.exports.renderNewForm = async (req, res) => {

    res.render("listing/new.ejs")
}
module.exports.showListings = async (req, res) => {

    if (!req.params) {
        throw new expressError(400, "Send valid data to listing")
    }

    let { id } = req.params

    const listingdata = await listing.findById(id).populate({ path: "reviews", populate: { path: "author" }, }).populate("owner");
    if (!listingdata) {
        req.flash("error", "Listing you requested for is deleted");
        res.redirect("/listing")
    }

    res.render("listing/show.ejs", { listingdata });


}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;

    const listingdata = await listing.findById(id);
    if (!listingdata) {
        req.flash("error", "Listing you requested for is deleted");
        res.redirect("/listing")
    }
    let orignalImageUrl=listingdata.image.url;
    
   orignalImageUrl= orignalImageUrl.replace("/upload", "/upload/w_250")
    res.render("listing/edit.ejs", { listingdata ,orignalImageUrl });

}
module.exports.createListing = async (req, res, next) => {
    let result = listingSchema.validate(req.body);
    if (result.error) {
        throw new expressError(400, result.error)
    }
    let url = req.file.path
    let filename = req.file.filename;

    const newListings = new listing(req.body.listing);
    req.flash("success", "New listing created")
    newListings.owner = req.user._id
    newListings.image = { url, filename }
    await newListings.save();
    res.redirect("/listing")


}
module.exports.updateListing = async (req, res) => {
    try {
        let { id } = req.params;

        let Listing=await listing.findByIdAndUpdate(id, { ...req.body.listing });
        if (typeof req.file !==  "undefined") {
            let url = req.file.path
            let filename = req.file.filename;
            Listing.image = { url, filename }
            await Listing.save();
        }   
        req.flash("success", "listing Updated")
        res.redirect(`/listing/${id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}
module.exports.destroyListing = async (req, res) => {
    try {
        let { id } = req.params;
        console.log(id);

        const deletedListing = await listing.findByIdAndDelete(id);

        if (!deletedListing) {
            // If the listing with the specified ID is not found
            return res.status(404).json({ error: "Listing not found" });
        }
        req.flash("success", "listing deleted")
        res.redirect("/listing");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }


}