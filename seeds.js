var mongoose      = require('mongoose'),
	campground    = require('./models/campground'),
	Comment       = require('./models/comment');


var data = [{name: 'Clouds end', image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60', description: 'Clouds end here so you can see horizon here.'},
 			{name: 'George everest', image: 'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60', description: 'Great mountains are covered by forest here.'},
 			{name: 'Aksardham Clouds', image: 'https://images.unsplash.com/photo-1525811902-f2342640856e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60', description: 'Whole valley is full of flowers and animals'}
  ]


function seedDb(){
	campground.remove({}, (err, data) => {
		err ? console.error(err):console.log('removed campgrounds');
	});
	data.forEach((seeds) => {
		campground.create(seeds, (err, newCampground) => {
			err ? console.error(err):console.log('CAMPGROUNDS ADEED')
			Comment.create({
				text: 'George everest is haunted',
				author: 'prasoon'
			}, (err, newComment) => {
				newCampground.comments.push(newComment)
				newCampground.save()
				console.log('created')
			})
		});
	})
};


module.exports = seedDb;