var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/demo_1");

var Post = require("./models/post");
var User = require("./models/user");