var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require("../models/user");
var Feedback = require("../models/feedback");

router.get("/", function(req, res){
	res.render("landing");
});

//AUTH ROUTES
router.get("/register", function(req, res){
	res.render("register");
});

router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){ //register from passport-local-mongoose
		if(err){												  //password passed separately as it computes hash and stores
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){ //authenticate user using local method from passport js
			req.flash("success", "Welcome to Quillsy, " + user.username + ". Please login again.");
			res.redirect("/login");
		});
	});
});

router.get("/login", function(req, res){
	res.render("login");
});

router.post("/login", passport.authenticate("local", //authenticate middleware auths user login and then redirects acc.
	{
		successRedirect: "/posts",
		failureRedirect: "/login",
		failureFlash: "Invalid username or password.",
		successFlash: "Welcome back!"
	}), function(req, res){
});

router.get("/logout", function(req, res){
	req.flash("success", "Logged you out!");
	req.logout();
	res.redirect("/posts");
});

router.get("/aboutus", function(req, res){
	res.render("aboutus");
});

router.get("/terms", function(req, res){
	res.render("terms");
});

router.get("/feedback", function(req, res){
	res.render("feedback");
});

router.post("/feedback", function(req, res){
	var newFeedback = {
		subject: req.body.subject,
		username: req.body.username,
		text: req.body.content
	};
	Feedback.create(newFeedback, function(err, newlyFeedback){
		if(err){
			req.flash("error", "Aw, Snap! Something went wrong.");
		} else {
			req.flash("success", "Feedback submitted. Thank you for concern!");
			res.redirect("/posts");
		}
	});
});

module.exports = router;