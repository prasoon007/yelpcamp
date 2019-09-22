var express 		= require('express'),
	router			= express.Router(),
	User 			= require('../models/user'),
	passport        = require('passport');


router.get('/', (req, res) => {
	res.render("landing");
});


router.get('/register', (req, res) => {
	res.render('register');
});

router.post('/register', (req, res) => {
	User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
		if(err) {
			req.flash('error', err.message)
			return res.redirect('/register');
		}
		else {
			passport.authenticate('local')(req, res, (err, foundUser) => {
				req.flash('success', `Welcome to YelpCamp '${req.user.username}'`)
				res.redirect('/campgrounds');
			})

		}
	})
});

//login	routes
router.get('/login', (req, res) => {
	res.render('login');
});

router.post("/login", (req, res) => {
  passport.authenticate("local",
    {
      successRedirect: "/campgrounds",
      failureRedirect: "/login",
      failureFlash: true,
      successFlash: `Welcome back, ${req.body.username}`
    })(req, res)
});

//logout route
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', 'You have been successfully logged out!');
	res.redirect('/campgrounds');
});


module.exports = router;