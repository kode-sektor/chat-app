/*const express  = require('express');
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
*/

const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 5001;

// const io = require('socket.io')(5000);

server.listen(port, ()=> {
	console.log(`Server is listening on port: ${port}`);
});

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/wddm-121.html', (req, res)=> {
	res.sendFile(__dirname + '/public/wddm-121.html');
});

app.get('/wddm-122.html', (req, res) => {
	res.sendFile(__dirname + '/public/wddm-122.html');
});

app.get('/wddm-123.html', (req, res) => {
	res.sendFile(__dirname + '/public/wddm-123.html');
});

app.use(express.static(path.join(__dirname, 'public')));



const tech = io.of('/tech');

const users = {};

tech.on('connection', function (socket) {
	
    // Listen for a "newuser" message
    socket.on('join', (data) => {

  		socket.join(data.room);
  		users[socket.id] = data.name;

  		if (data.name != null) {
  			socket.broadcast.emit('user-connected', data.name);
  		}

  	});

  	socket.on('message', (data)=> {
  		tech.in(data.room).emit('message', { message: data.chatMsg, name: users[socket.id]});
  	});

/*    // Transmit a message to everyone except the sender
    socket.broadcast.emit('newuser', data);

    // The same message, sent to all users - try it!
    //io.emit('newuser', data)
	 
	
	// Listen for "chatmsg"
	//   io.emit to all user
	socket.on('chatmsg', (data) => {
		io.emit('chatmsg', data);
	});*/


});
