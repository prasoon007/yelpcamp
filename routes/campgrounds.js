 var express	 = require('express'),
     router	 	 = express.Router(),
     campground  = require('../models/campground'),
     Comment 	 = require('../models/comment'),
     middleware	 = require('../middleware/index.js');


 //ROUTE
//campground route ------- 	INDEX ROUTE --------- display all the campgrounds
router.get('/', (req, res) => {
	campground.find({}, (err, allcampground) => {
		err ? console.log(err):res.render('campgrounds/campgrounds', {campgrounds: allcampground});
	});
});


//new campground add --------- NEW ROUTE ----------- display a form to add new campground
router.get('/new', middleware.isLoggedIn, (req, res) => {
	res.render('campgrounds/new.ejs');
});


//campground post route--------- CREATE ---------------create a new campground
router.post('/', middleware.isLoggedIn, (req, res) => {
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user.id,
		username: req.user.username
	};
	campground.create(
		{name: name, price: price, image: image, description: description, author: author}, (err, newcamp) => {
			err ? console.log(err) : 
			req.flash('success', 'Campground Added!')
			res.redirect('/campgrounds');
		}
	)
});


//show campground details---------- SHOW ------------- show info about particular campground
router.get('/:id', (req, res) => {
	campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
		err ? console.error(err):res.render('campgrounds/show', {camp: foundCampground});
	});
});


//edit campground route-----------EDIT---------shows edit form
router.get('/:id/edit', middleware.campAuth, (req, res) => {
	campground.findById(req.params.id, (err, foundCamp) => {
		err ? console.error(err):
		res.render('campgrounds/edit', {camp: foundCamp})
	});
});


//update campground route--------UPDATE---------update the campground
router.put('/:id', middleware.campAuth, (req, res) => {
	campground.findByIdAndUpdate(req.params.id, req.body.camp, (err, foundCamp) => {
		err ? console.error(err):
		req.flash('success', 'Campground Edited!')
		res.redirect(`/campgrounds/${req.params.id}`);
	});
});


//delete route -----------------DELETE-----------delete the campground
router.delete('/:id', middleware.campAuth, (req, res) => {
	campground.findByIdAndDelete(req.params.id, (err, deletedCamp) => {
		err ? console.error(err):
		Comment.remove({ _id: { $in: deletedCamp.comments }}, (err, delComment) => {
			err ? res.redirect('back'):
			req.flash('success', 'Campground Deleted!')
			res.redirect('/campgrounds')
		});
	});
});


module.exports = router;