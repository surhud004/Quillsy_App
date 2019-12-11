var express = require('express');
var router = express.Router();
var Post = require("../models/post");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//SHOW all posts
router.get("/posts", function(req, res){
	Post.find({}).sort({created: 'desc'}).exec(function(err, allPosts){
		if(err || !allPosts.length){
			req.flash("error", "No posts to show.");
		} else {
			res.render("posts", {posts: allPosts});
		}
	});
});

//CREATE new post
router.post("/posts", function(req, res){
	var title = req.body.title;
	var image = req.body.imageurl;
	var text = req.body.blogtext;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newPost = {title: title, image: image, text: text, author: author};
	Post.create(newPost, function(err, newlyPost){
		if(err){
			req.flash("error", "Aw, Snap! Something went wrong.");
		} else {
			req.flash("success", "Post created.");
			res.redirect("/posts");
		}
	});
});

//NEW post
router.get("/posts/new", middleware.isLoggedIn, function(req, res){
	res.render("newpost");
});

router.get("/posts/:id", function(req, res){
	Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
		if(err){
			req.flash("error", "Post not found.");
		} else {
			res.render("showpost", {post: foundPost});
		}
	});
});

//EDIT post
router.get("/posts/:id/edit", middleware.checkPostOwnership, function(req, res){
	Post.findById(req.params.id, function(err, foundPost){
		res.render("editpost", {post: foundPost});
	});
});

//UPDATE PUT post
router.put("/posts/:id", middleware.checkPostOwnership, function(req, res){
	var title = req.body.title;
	var image = req.body.imageurl;
	var text = req.body.blogtext;
	var updatePost = {title: title, image: image, text: text};
	Post.findByIdAndUpdate(req.params.id, updatePost, function(err, updatedPost){
		if(err){
			req.flash("error", "Post not found.");
			res.redirect("/posts");
		} else {
			req.flash("success", "Post updated.");
			res.redirect("/posts/" + req.params.id);
		}
	});
});

//DELETE post
router.delete("/posts/:id", middleware.checkPostOwnership, function(req, res){
	Post.findByIdAndRemove(req.params.id, function(err, foundPost){
		if(err){
			req.flash("error", "Post not found.");
			res.redirect("/posts");
		} else { //remove associated comments with post too
			foundPost.comments.forEach(function(comment){
				Comment.findByIdAndRemove(comment, function(err){
					if(err){
						req.flash("error", "Post not found.");
						res.redirect("/posts");
					}
				});
			});
			req.flash("error", "Post deleted.");
			res.redirect("/posts");
		}
	});
});

module.exports = router;