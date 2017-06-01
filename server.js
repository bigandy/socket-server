const port = 3001;

var WPAPI = require( 'wpapi' );

const config = require('./config.json');

var wp = new WPAPI({
    endpoint: config.endpoint,
    username: config.username,
    password: config.password,
    auth: true
});


var io = require('socket.io')(port);
var redis = require('socket.io-redis');
io.adapter(redis({ host: 'localhost', port: 6379 }));
const filePath = './images/sun.png';

io.on('connection', function(socket) {
	console.log('connected to the server');

  	socket.on('browser published new post', function(id, post, update) {
  		console.log('update post');
   //  	console.log('published new post', id, post, update);
   		addFeaturedImageToPost(id, socket);
  	});

});


const addFeaturedImageToPost = function(id, socket) {
	// // Create the media record & upload your image file
	// return wp.media().file( filePath ).create({
	// 	title: 'Amazing featured image',
	// 	post: id
	// })
	// 	.then(function( media ) {
	// 		console.log('have uploaded the image');
	// 	// Set the new media record as the post's featured media
	// 		return wp.posts().id( id ).update({
	// 			featured_media: media.id,
	// 			status: 'publish',
	// 			content: 'some lovely content'
	// 		});
	// 	})
	// 	.then(() => {
	// 		console.log('post has been updated with featured image')
	// 		// return socket.emit('post complete');
	// 	});
	// let done = false;
	return wp.media()
	    // Specify a path to the file you want to upload, or a Buffer
	    .file( filePath )
	    .create({
	        title: 'My awesome image',
	        alt_text: 'an image of something awesome',
	        caption: 'This is the caption text',
	        description: 'More explanatory information'
	    })
	    .then(function(response) {
	        // Your media is now uploaded: let's associate it with a post
	        // var newImageId = response.id;
	        // return wp.media().id( newImageId ).update({
	        //     post: id
	        // });
	        var newImageId = response.id;

	        return wp.posts().id(id).update({
    				featured_media: newImageId,
    				status: 'publish',
    				content: 'some lovely content'
    			})
	        	.then(function(response) {
	        		console.log(response);
	        		socket.emit('post complete');
	        	});

	    })
	    .then(function( response ) {
	            console.log( 'Media ID #' + response );
	            // console.log( 'is now associated with Post ID #' + response.post );
	        }
	    );
};
