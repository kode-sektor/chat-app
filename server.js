const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 5001;

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

  	// Typing... event
  	socket.on('typing', (data)=>{
  	  if(data.typing==true)
  	     socket.broadcast.emit('display', data)
  	  else
  	     socket.broadcast.emit('display', data)
  	})

});
