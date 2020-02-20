var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	username: {type: String, unique: true, require: true},
	password: String,
	email: String,
	name: String,
	avatar: String,
	firstname: String,
	lastname: String,
	info: String,
	isAdmin: {type: Boolean, default: false},
	email: {type: String, unique: true, require: true},
	resetPasswordToken: String,
	resetPasswordExpires: Date,
	posts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post"
		}
	],
	notifications: [
    	{
    	   type: mongoose.Schema.Types.ObjectId,
    	   ref: 'Notification'
    	}
    ],
    followers: [
    	{
    		type: mongoose.Schema.Types.ObjectId,
    		ref: 'User'
    	}
    ]
	
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);