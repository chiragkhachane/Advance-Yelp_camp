var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var User = require("../models/user");
var Notification = require("../models/notification");
var multer = require('multer');
var cloudinary = require('cloudinary');

require("dotenv").config();
// IMAGES HANDELING
// var storage = multer.diskStorage({
//   filename: function(req, file, callback) {
//     callback(null, Date.now() + file.originalname);
//   }
// });

// var imageFilter = function (req, file, cb) {
//     // accept image files only
//     if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
//         return cb(new Error('Only image files are allowed!'), false);
//     }
//     cb(null, true);
// };

// var upload = multer({ storage: storage, fileFilter: imageFilter})


// cloudinary.config({ 
//   cloud_name: "mysqli71", 
//   api_key: process.env.CLOUDINARY_API_KEY, 
//   api_secret: process.env.CLOUDINARY_API_SECRET
// 	// api_key: 596236691223186,
// 	// api_secret: "PsVOVpeXpNG15VUAxqoEnFeh9Ts"
// });
// ==============================
// Campgroung Routes
// ==============================

//  INDEX - Show all Campgrounds
// router.get("/", function(req, res){
// // 	Get all campgrounds from db
// 	Campground.find({}, function(err, allcampgrounds){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			res.render("campgrounds/index",{campgrounds: allcampgrounds, currentUser: req.user, page: "index"});
// 		}
// 	});
	
// });

router.get("/", function (req, res) {
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
	var noMatch = null;
	if(req.query.search){
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
	
    Campground.find({name: regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCampgrounds) {
        Campground.countDocuments().exec(function (err, count) {
            if (err) {
                console.log(err);
            } else {
				if(allCampgrounds.length < 1) {
                  noMatch = "No campgrounds found, please try again.";
              	}
                res.render("campgrounds/index", {
                    campgrounds: allCampgrounds,
                    current: pageNumber,
                    pages: Math.ceil(count / perPage),
					noMatch: noMatch,
					search: req.query.search
                });
            }
        });
    });
	}else{
		Campground.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCampgrounds) {
        Campground.countDocuments().exec(function (err, count) {
            if (err) {
                console.log(err);
            } else {
                res.render("campgrounds/index", {
                    campgrounds: allCampgrounds,
                    current: pageNumber,
                    pages: Math.ceil(count / perPage),
					noMatch: noMatch,
					search: false
                });
            }
        });
    });
	}
});

// CREATE - Add new Campground
router.post("/", middleware.isLoggedIn, async function(req, res){	
	// Get data from form
	// cloudinary.uploader.upload(req.file.path, function(result) {
		  // add cloudinary url for the image to the campground object under image property
		// req.body.image = result.secure_url;  
		console.log(req.body.image);
		var name = req.body.name;
		var image = req.body.image;
		var info = req.body.info;
		var price = req.body.price;
		var author = {
		id: req.user._id,
		username: req.user.username
		}
	// });
	var newCampground = {name: name, image: image,info: info,price:price , author: author}

	try {

      let campground = await Campground.create(newCampground);
      let user = await User.findById(req.user._id).populate("followers").exec();
      let newNotification = {
        username: req.user.username,
        campgroundId: campground.id
      }
      for(const follower of user.followers) {
        let notification = await Notification.create(newNotification);
        follower.notifications.push(notification);
        follower.save();
      }

      //redirect back to campgrounds page
      res.redirect(`/index/${campground.id}`);
    } catch(err) {
      req.flash("error", err.message);
      res.redirect("back");
    }
	// Create new Campground and save in DB
	// Campground.create(newCampground, function(err, newlyCreated){
	// 	if(err){
	// 		console.log(err);
	// 	}else{
	// 		console.log(newCampground);
	// 		res.redirect("/index");
	// 	}
	// });
});



// NEW - Show form to create new campground
router.get("/new", middleware.isLoggedIn,function(req, res){
	res.render("campgrounds/new");
});



// SHOW - Shows more info about campground
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			// console.log(err)
			req.flash("error", "Campground not found");
			res.redirect("back");
		}else{
			console.log(foundCampground);
			Campground.find({}, function(err, allcampgrounds){
				if(err){
				console.log(err);
				}else{
					res.render("campgrounds/show",{campgrounds: allcampgrounds, campground: foundCampground});
				}
			});
			
		}
	});
});

// EDIT Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
// 		Does User own the Campground
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				res.redirect("/index");
			}else{
			res.render("campgrounds/edit", { campground: foundCampground});
			}
		});
});

// Update Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
// 	find and update correct campground and redirect to some page
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			req.flash("error", "Error: Campground not found!");
			res.redirect("/index");
		}else{
			res.redirect("/index/" + req.params.id);
		}
	})
});

// DELETE CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership,function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/index");	
		}else{
			res.redirect("/index");
		}
	});
});




function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;

