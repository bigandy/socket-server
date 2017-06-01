const port = 3001;

var WPAPI = require( 'wpapi' );

const config = require('./config.json');

var wp = new WPAPI({
    endpoint,
    username,
    password,
    auth
} = config);

var io = require('socket.io')(port);
var redis = require('socket.io-redis');
io.adapter(redis({ host: 'localhost', port: 6379 }));

const filePath = './images/owl.jpg';

io.on('connection', function(socket) {
	console.log('connected to the server');

  	socket.on('browser published new post', function(id, post, update) {
  		console.log('update post');
   		addFeaturedImageToPost(id, socket);
  	});
});


const addFeaturedImageToPost = function(id, socket) {
	return wp.media()
	    // Specify a path to the file you want to upload, or a Buffer
	    .file(filePath)
	    .create({
	        title: 'My awesome image',
	        alt_text: 'an image of something awesome',
	        caption: 'This is the caption text',
	        description: 'More explanatory information'
	    })
	    .then(function(response) {
	        // Your media is now uploaded: let's associate it with a post
			const newImageId = response.id;
			// console.log('here is the image id', newImageId);

			const post = wp.posts().id(id).update({
					featured_media: newImageId,
					title: `test post`,
					status: 'publish',
					content: 'some lovely content'
				})
				.then(() => {
					console.log('post posted');
					// socket.emit('the post completed');
				});
	    });
};
