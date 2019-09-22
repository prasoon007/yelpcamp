//all midddleware goes here
var campground = require('../models/campground'),
	Comment    = require('../models/comment');

var middlewareObj = {};


middlewareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	else {
		req.flash('error', 'You need to be login first')
		res.redirect('/login');
	}
}


middlewareObj.campAuth = function(req, res, next) {
	if(req.isAuthenticated()) {
		campground.findById(req.params.id, (err, foundCamp) => {
			if(err) {
				req.flash('error', 'No matching campground found')
				res.redirect('back');
			}
			else {
				if(foundCamp.author.id.equals(req.user._id)) {
					next();
				}
				else {
					req.flash('error', "You don't have the permission")
					res.redirect('back');
				}
			}
		})
	}
	else {
		req.flash('error', 'Please login first')
		res.redirect("/login");
	}
}


middlewareObj.commentAuth = function(req, res, next) {
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if(err) {
				req.flash('error', 'No matching comment found')
				res.redirect('back')
			}
			else {
				if(foundComment.author.id.equals(req.user._id)) {
					next();
				}
				else{
					req.flash('error', "You don't have the permission")
					res.redirect('back');
				}
			}
		})
	}
	else {
		res.redirect('/login');
	}
}


module.exports = middlewareObj;


