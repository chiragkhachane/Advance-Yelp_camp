var express 		= require("express");
var app 			= express();
var bodyParser 		= require("body-parser");
var mongoose 		= require("mongoose");
var flash 			= require("connect-flash");
var passport	 	= require("passport");
var LocalStrategy 	= require("passport-local");
var methodOverride  = require("method-override");
// var cookieParser 	= require("cookie-parser");
var session 		= require("express-session")

var Campground		 = require("./models/campground");
var Comment 		 = require("./models/comment");
var User 			 = require("./models/user");
var seedDB 			 = require("./seeds");

// Requireing Routes
var commentRoutes 		= require("./routes/comments");
var campgroundRoutes 	= require("./routes/campgrounds"); 
var indexRoutes 		= require("./routes/index");
// require('dotenv').config();
// require('dotenv').load();

var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";

// console.log(process.env.DATABASEURL);
mongoose.connect(url, {useNewUrlParser: true}).then(function(){
	console.log("Connected to Database");
	console.log(process.env.DATABASEURL);
}).catch(function(err){
	console.log("ERROR", err.message);
});

// Local Database
// mongoose.connect("mongodb://localhost:27017/yelp_camp");

// MONGO ATLAS DB
// mongoose.connect("mongodb+srv://chirag:<PASSWORD>@cluster0-58xa6.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true}).then( function(){
// 	console.log('connected to DATABASE');
// }).catch(function(err){
// 	console.log("error:" , err.message);
// });



app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// SEED THE DATABASE
// seedDB();

// PASSPORT CONFIGURATION
app.use(session({
		secret: "once agiain Rusty",
		resave: false,
		saveUninitialized: false
}));	

app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use(function(req,res, next){
// 	res.locals.currentUser = req.user;
// 	res.locals.error= req.flash("error");
// 	res.locals.success	=req.flash("success");
// 	next();
// });

app.use(async function(req, res, next){
   res.locals.currentUser = req.user;
   if(req.user) {
    try {
      let user = await User.findById(req.user._id).populate('notifications', null, { isRead: false }).exec();
      res.locals.notifications = user.notifications.reverse();
    } catch(err) {
      console.log(err.message);
    }
   }
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

// Requiring Routes
app.use("/",indexRoutes);
app.use("/index", campgroundRoutes);
app.use("/index/:id/comments",commentRoutes);


app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("Yelp Camp Server started!!!");
});