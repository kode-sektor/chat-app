
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');
const port = 5001;


// Fetch from database

function saveChat (json='""') {
	return fs.writeFileSync('db.json', JSON.stringify(json,null,2))
}

const loadChats = (room) => {
	return JSON.parse(
		fs.existsSync('db.json') ? fs.readFileSync('db.json').toString() : '""'
	)
}

const meVsThey = (otherName, userMoniker) => {
   return (userMoniker == otherName) ? true : false;
}


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
const users = {}; // Will serve as database on back-end

tech.on('connection', function (socket) {
	
    // Listen for a "newuser" message
    socket.on('join', (data) => {

  		socket.join(data.room);

  	  /*Save current user's moniker on 'join' event. This will be used later to compare if its same 
  	  user on form 'submit' event. */
  		users[socket.id] = data.name; 
      users['room'] = data.room;

  		// Broadcast message 
  		if (data.name != null) {
  		    socket.broadcast.emit('user-connected', data);

  	        // Load chats when user first joins room
  	        // let chats = loadChats(data.room);
  	        let chatsDB = loadChats('db.json');
  	        // console.log (chats);

  	        // load chats to only yourself (privately) to avoid displaying 2ce
  	        socket.emit('load-chats', { chats : chatsDB[data.room] });
  		}

  	});

    socket.on('save-chat', (data) => {

    	  let chatsToSave = loadChats('db.json');
    	  chatsToSave[users['room']].push(data.$msgHTMLDB);  // users['room'] is saved when user first joins room
        saveChat(chatsToSave);

    });


    // Display message to everyone, including yourself
  	socket.on('message', (data) => {
  		tech.in(data.room).emit('message', { message: data.chatMsg, otherName: users[socket.id], moniker: data.userMoniker});
  	});

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
    });

  	// Typing... event
  	socket.on('typing', (data) => {
  	   if(data.typing==true) {
  	      	socket.broadcast.emit('display', data);
  	   } else {
  	  	  	socket.broadcast.emit('display', data);
  	   }
  	});

});
