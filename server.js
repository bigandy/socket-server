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


io.of('/').adapter.clients(function (err, clients) {
  console.log(clients); // an array containing all connected socket ids
});

io.on('connection', function(socket) {
  console.log('connected to the server');

  socket.on('published new post', function(id) {
    console.log('published new post', id);

    // Create the media record & upload your image file
    var filePath = './images/b-cup.jpg';
    return wp.media().file( filePath ).create({
      title: 'Amazing featured image',
      post: id
    }).then(function( media ) {
      // Set the new media record as the post's featured media
      return wp.posts().id( id ).update({
        featured_media: media.id,
        status: 'publish',
        content: 'some lovely content'
      });
    }).then( socket.emit('post complete') );


  });

});

// io.on('published new post', function(msg) {
//   console.log('published new post', msg);
// });

// io.on('img clicked', (msg) => {
//   console.log('Image was clicked', msg);
// })
