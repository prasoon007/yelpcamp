var express 		= require('express'),
	router			= express.Router({mergeParams: true}),
	campground  	= require('../models/campground'),
	Comment    		= require('../models/comment'),
    middleware	    = require('../middleware/index.js');


//NEW ROUTE ----- displays form to add comment
router.get('/new' , middleware.isLoggedIn, (req, res) => {
	campground.findById(req.params.id, (err, foundCamp) => {
		err ? console.error(err):res.render('comments/new', {camp: foundCamp});
	});
});


//CREATE ROUTE ------ edit the comment
router.post('/', middleware.isLoggedIn, (req, res) => {
	campground.findById(req.params.id, (err, foundCamp) => {
		err ? console.error(err):		
		Comment.create(req.body.comment, (err, addedComment) => {
			addedComment.author.id = req.user._id;
			addedComment.author.username = req.user.username;
			addedComment.save();
			foundCamp.comments.push(addedComment)
			foundCamp.save();
			req.flash('success', 'New Comment Added!');
			res.redirect(`/campgrounds/${foundCamp._id}`);
		})		
	})
});


//edit route
router.get('/:comment_id/edit', middleware.commentAuth, (req, res) => {
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			err ? console.log(err):
			res.render('comments/edit', {foundComment: foundComment, campground_id: req.params.id});
		});
	});


router.put('/:comment_id', middleware.commentAuth, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, foundComment) => {
		err ? res.redirect('back'):
		req.flash('success', 'Comment Edited!');
		res.redirect(`/campgrounds/${req.params.id}`);
	});
});


router.delete('/:comment_id', middleware.commentAuth, (req, res) => {
	Comment.findByIdAndDelete(req.params.comment_id, (err, deComment) => {
		err ? res.redirect('back'):
		campground.findByIdAndUpdate(req.params.id, {$pull: {comments: req.params.comment_id}}, (err, foundCamp) => {
			req.flash('success', 'Comment Deleted!')
			res.redirect(`/campgrounds/${req.params.id}`);
		})
	})
})	


module.exports = router;
