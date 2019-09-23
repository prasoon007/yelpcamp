//SET UP
const express 		              = require('express'),
      app 			              = express(),
      bodyparser 	              = require('body-parser'),
	  mongoose 		              = require('mongoose'),
	  campground                  = require('./models/campground'),
	  seedDb                      = require('./seeds');
	  Comment                     = require('./models/comment'),
	  session			 		  = require('express-session'),
	  passport 		              = require('passport'),
	  passportLocal		          = require('passport-local'),
	  User 						  = require('./models/user'),
	  passportLocalMongoose	  	  = require('passport-local-mongoose');
	  localStrategy 			  = require('passport-local').Strategy;
	  methodOverride 			  = require('method-override'),
	  flash						  = require('connect-flash');

	  var campgroundsRoutes		  = require('./routes/campgrounds'),
	  	  commentsRoutes		  = require('./routes/comments'),
	  	  indexRoutes			  = require('./routes/index');



//formalities
app.use(session({
	secret: 'I am going to be a rich person',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended: true}));
app.use(flash());
//mongoose.connect('mongodb://localhost/yelpDeploy', {useNewUrlParser: true});
mongoose.connect('mongodb+srv://prasoon:sheshank@7275@yelpcamp-bc5nv.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});


// seedDb();
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error	   = req.flash('error');
	res.locals.success	   = req.flash('success');
	next();
});
app.use(methodOverride("_method"));


//express routes formalities	
app.use('/', indexRoutes);
app.use('/campgrounds/:id/comments' ,commentsRoutes);
app.use('/campgrounds', campgroundsRoutes);


//passport formalities
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new localStrategy(User.authenticate()));


//SERVER
app.listen(3000, () => {
	console.log("YELPCAMP SERVER STARTED!!!")
});

