var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
	{
		name: "Clouds Rest",
		image: "https://images.unsplash.com/photo-1475483768296-6163e08872a1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		info: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
	},
	
	{
		name: "Desert mesa",
		image: "https://images.unsplash.com/photo-1500581276021-a4bbcd0050c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		info: " Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
	},
	
	{
		name: "Canyon floor",
		image: "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		info: " Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
	}
]


function seedDB(){
	// 	Remove all campgrounds.
	Campground.remove({}, function(err){
	// 	if(err){
	// 		console.log(err);
	// 	}else{
	// 		 console.log("removed campgrounds!");
	// 		// Add few campgrounds
	// 		data.forEach(function(seed){
	// 			Campground.create(seed, function(err, campground){
	// 				if(err){
	// 					console.log(err);
	// 				}else{
	// 					console.log("added new campground");
	// 					// 	create a comment
	// 					Comment.create({
	// 						text: "This place is great. wish it had internet",
	// 						author: "Homer"
	// 					}, function(err, comment){
	// 						if(err){
	// 							console.log(err);
	// 						}else{
	// 							campground.comments.push(comment);
	// 							campground.save();
	// 							console.log("created new comment");
	// 						}
											
	// 					})
	// 				}		
	// 			});
	// 		});
	// 	}
	});
		
}	
module.exports = seedDB;
