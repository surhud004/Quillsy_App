var express = require('express');
var router = express.Router({mergeParams: true}); //this will merge req.params of posts and comments
var Post = require("../models/post");
var Comment = require("../models/comment");
var middleware = require("../middleware"); //no need to call index.js, its default file

//CREATE new comment
router.post("/posts/:id", middleware.isLoggedIn, function(req, res){
	Post.findById(req.params.id, function(err, foundPost){
		if(err){
			req.flash("error", "Post not found.");
			res.redirect("/posts");
		} else {
			var text = req.body.newcomment;
			var authorId = req.user._id;
			var username = req.user.username;
			var author = {
				id: req.user._id,
				username: req.user.username
			};
			var newComment = {text: text, author: author};
			Comment.create(newComment, function(err, comment){
				if(err){
					req.flash("error", "Aw, Snap! Something went wrong.");
				} else {
					foundPost.comments.push(comment);
					foundPost.save();
					req.flash("success", "Comment posted.");
					res.redirect("/posts/"+foundPost._id);
				}
			});
		}
	});
});

//DELETE comment
router.delete("/posts/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err, foundComment){
		if(err){
			req.flash("error", "Comment not found.");
		} else {
			Post.findById(req.params.id, function(err, foundPost){
				if(err){
					req.flash("error", "Comment not found.");	
				} else { //delete associated comment id from comments array of post too
					foundPost.comments.forEach(function(comment, index){
						if(comment.equals(req.params.comment_id)) {
							foundPost.comments.remove(comment);
							foundPost.save();
						}
					});
				}
			});
			req.flash("error", "Comment deleted.");
			res.redirect("/posts/" + req.params.id);
		}
	});
});

module.exports = router;