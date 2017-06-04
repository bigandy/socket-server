const port = 3001;

var WPAPI = require( 'wpapi' );

const config = require('./config.json');
const filePath = './images/my_picture.jpg';

var wp = new WPAPI({
    endpoint,
    username,
    password,
    auth
} = config);

const redis = require('redis');
const client = redis.createClient({
	"host": "127.0.0.1",
	"port": 6379,
	"auth_pass": ""
});

client.subscribe("WordPress published new post");

client.on("message", function(channel, message){
	const { id, post, update, viaAPI } = JSON.parse(message);

	// if the form has been submitted by API the viaAPI will be true
	// This will prevent an infinite loop when save_post gets fired every time
	// either the API or browser editor saves the post.
	if (viaAPI) {
		return;
	}

	if (update === true) {
		// console.log('updated');
		// console.log(addFeaturedImageToPost(id));

		const added = addFeaturedImageToPost(id);
	} else {
		console.log('not updated');
	}
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
