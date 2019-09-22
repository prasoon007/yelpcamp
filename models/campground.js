var mongoose = require('mongoose'),
     Comment = require('./comment');



//Schema Declaration
var campSchema = new mongoose.Schema({
	 name: String,
	 price: String,
	 image: String,
	 description: String,
	 author: {
	 	id: {
	 		type: mongoose.Schema.Types.ObjectId,
	 		ref: 'User'
	 	},
	 	username: String
	 },
	 comments : [
	 	{
	 		type: mongoose.Schema.Types.ObjectId,
	 		ref: 'Comment'
	 	}
	 ]
});



//model declaration
module.exports = mongoose.model('campground', campSchema);