var Post = require("../models/post");
var Comment = require("../models/comment");
var middlewareObj = {};

//Is user logged in? checking middleware
middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please login first.");
	res.redirect("/login");
};


//Does user own post? checking middleware
middlewareObj.checkPostOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Post.findById(req.params.id, function(err, foundPost){
			if(err){
				req.flash("error", "Post not found.");
				res.redirect("back");
			} else {
				//check object equals string
				if(foundPost.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "Permission denied.");
					res.redirect("back");
				}
			}
		});	
	} else {
		req.flash("error", "Please login first.");
		res.redirect("back");
	}
};

//Does user own comment? checking middleware
middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				req.flash("error", "Comment not found.");
				res.redirect("/posts/" + req.params.id);
			} else {
				//check if current user is comments owner
				if(foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					//check if current user is posts owner 
					//(so that he can delete unwanted/explicit comments on his post only)
					Post.findById(req.params.id, function(err, foundPost){
						if(err){
							req.flash("error", "Comment not found.");
							res.redirect("back");
						} else {
							//check object equals string
							if(foundPost.author.id.equals(req.user._id)) {
								next();
							} else {
								req.flash("error", "Permission denied.");
								res.redirect("back");
							}
						}
					});
				}
			}
		});	
	} else {
		req.flash("error", "Please login first.");
		res.redirect("/posts/" + req.params.id);
	}
};

module.exports = middlewareObj;