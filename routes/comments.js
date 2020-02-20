var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment= require("../models/comment");
var middleware = require("../middleware");
// var notification = require("../models/notification");

// ==================================
// COMMENTS ROUTES
// ==================================



// Comments new
router.get("/new", middleware.isLoggedIn, function(req, res){
	// find CG by _id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {campground: campground});
		}
	});
	
});

// Comments create
router.post("/", middleware.isLoggedIn, function(req,res){
	// loogup for Campground using ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/index");
		}else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				}else{
					// 	Add username and if to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					//  Save Comment
					campground.comments.push(comment);
					campground.save();
					res.redirect('/index/' + campground._id);
				}
			});
		}
	});
	
});

// EDIT COMMENTS
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "Cannot find Campground");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
			}else{
			res.render("comments/edit", { campground_id: req.params.id, comment: foundComment});		
			}
		});
	});	
});

// Update Comment
router.put("/:comment_id",middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			res.redirect("/index/" + req.params.id);
		}
	});
	
});

// Comments Delete Route
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			req.flash("success", "Comment deleted");
			res.redirect("/index/" + req.params.id);
		}
	});
});


module.exports = router;

