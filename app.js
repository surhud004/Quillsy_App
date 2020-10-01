var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var methodOverride = require('method-override');
var flash = require('connect-flash');

var port = process.env.PORT || 8080;

// ROUTES REQUIRE
var indexRoutes = require("./routes/index");
var postRoutes = require("./routes/posts");
var commentRoutes = require("./routes/comments");
var userRoutes = require("./routes/users");

// MODELS REQUIRE
var User = require("./models/user");

// DATABASE CONNECT & EXPRESS CONFIG
//mongoose.connect("mongodb://localhost/quillsdb", {"useNewUrlParser": true, "useUnifiedTopology": true, "useFindAndModify": false});
mongoose.connect(process.env.API_KEY, {"useNewUrlParser": true, "useUnifiedTopology": true, "useFindAndModify": false}, function(err){
	if(err){
		console.log(err);
	} else {
		console.log("Connected to external DB!");
	}
});
app.use(bodyParser.urlencoded({extended: true})); //uses qs library for encoding creates JSON objects
app.use(express.static(__dirname + "/public")); //dynamic path creation
app.use(methodOverride("_method")); //override put and delete methods as html has only get and post
app.use(flash());
app.set("view engine", "ejs");

// PASSPORT CONFIG
app.use(require('express-session')({
	secret: "This is the quillsy writings platform.", //use to generate hash for requesting session
	resave: false, //set it true to retain session after idle time
	saveUninitialized: false //set it true if recurring visitors which will save their session id
}));
app.use(passport.initialize()); //initialize passport middleware
app.use(passport.session()); //change user object to current session id
passport.use(new LocalStrategy(User.authenticate())); //localstrategy for any username (email not required) and password
passport.serializeUser(User.serializeUser()); //authenticate, serialize, deserialize from passport-local-mongoose
passport.deserializeUser(User.deserializeUser()); //serialize decides which user data to store in session
												 //deserialize retrieves the user id from session

// Pass locals to all routes templates - middleware
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.errorMsg = req.flash("error");
	res.locals.successMsg = req.flash("success");
	next();
});
app.locals.moment = require('moment');

app.use(indexRoutes);
app.use(postRoutes);
app.use(commentRoutes);
app.use(userRoutes);

app.get("*", function(req, res){
	res.render("notfound");
});

app.listen(port, function(){
	console.log("Server started!!");
});
