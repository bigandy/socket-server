# Socket.io Redis Server

## Installation
1. rename config.sample.json to config.json including the username, password and WordPress url.
2. install scripts with `npm install`
3. Ensure Redis is running
4. Run script with `npm start`


## Using WordPress, Redis and socket.io.
When WordPress creates or edits a new post, this fires a emit signal via redis and socket.io. On the node end we listen for this signal and then using node-wpapi update the post with a featured image of our choosing.
