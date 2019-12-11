var express = require('express');
var router = express.Router();
var Post = require("../models/post");
var Comment = require("../models/comment");
var User = require("../models/user");
var Report = require("../models/report");
var middleware = require("../middleware");

//SHOW user posts
router.get("/user/:user_name", function(req, res){
	Post.find({'author.username': req.params.user_name}).sort({created: 'desc'}).exec(function(err, allPosts){
		if(err || !allPosts.length){
			req.flash("error", "No posts to show.");
			res.redirect("/posts");
		} else {
			res.render("posts", {posts: allPosts});
		}
	});
});

//Search user - header navbar search bar
router.post("/user", function(req, res){
	var user_name = req.body.searchUser;
	User.findOne({'username': user_name}).exec(function(err, foundUser){
		if(err || !foundUser){
			req.flash("error", "User not found. Username is case-sensitive. Check uppercase/lowercase.");
			res.redirect("/posts");
		} else {
			res.redirect("/user/" + foundUser.username);
		}
	});
});

//SHOW Report from user
router.get("/report", middleware.isLoggedIn, function(req, res){
	res.render("report");
});

//POST report from user
router.post("/report", middleware.isLoggedIn, function(req, res){
	var author ={
		id: req.user._id,
		username: req.user.username
	};
	var newReport = {
		subject: req.body.subject,
		url: req.body.content,
		author: author
	};
	Report.create(newReport, function(err, newlyReport){
		if(err){
			req.flash("error", "Aw, Snap! Something went wrong.");
		} else {
			req.flash("success", "Report submitted. Thank you for reporting!");
			res.redirect("/posts");
		}
	});
});

//SHOW Report from user
router.get("/delete", middleware.isLoggedIn, function(req, res){
	res.render("deleteuser");
});

//DELETE user and data - posts and comments
router.delete("/delete/:user_id", middleware.isLoggedIn, function(req, res){
	User.findByIdAndRemove(req.params.user_id, function(err, foundUser){
		if(err){
			req.flash("error", "User not found.");
			res.redirect("/posts");
		} else {
			//remove associated posts
			Post.deleteMany({'author.username': foundUser.username}, function(err, foundAllPosts){
				if(err){
					req.flash("error", "Post not found.");
					res.redirect("/posts");
				}
			});
			//remove associated comments
			Comment.deleteMany({'author.username': foundUser.username}, function(err, foundAllComments){
				if(err){
					req.flash("error", "Post not found.");
					res.redirect("/posts");
				} else {
					res.redirect("/logout");
				}
			});
		}
	});
});

module.exports = router;