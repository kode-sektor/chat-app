const express  = require('express');
const app      = express();
const port     = process.env.PORT || 5001;
const server   = app.listen(port, () => {console.log(`Server running at http://localhost:${port}`)});
const io 	   = require('socket.io').listen(server);


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/wddm-121.html');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/wddm-122.html');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/wddm-123.html');
});


app.use(express.static('.'));




io.on('connection', function (socket) {
	
  // Listen for a "newuser" message
  socket.on('newuser', (data) => {
    // Transmit a message to everyone except the sender
    socket.broadcast.emit('newuser', data);

    // The same message, sent to all users - try it!
    //io.emit('newuser', data)
	});
	 
	
	// Listen for "chatmsg"
	//   io.emit to all user
	socket.on('chatmsg', (data) => {
		io.emit('chatmsg', data);
	});


});
