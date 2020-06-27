const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 5001;

// Fetch from database
const fs = require('fs');
let chatData = {"msg" : "Thank you for your word"};

/*fs.readFile('db.json', 'utf8', function(err, data) {
    if (err) {
        // console.log(err);
    } else {
        if (data) {
          chatDB = JSON.parse(data);
          console.log('data: true');
        } else {
            chatDB = [];
            console.log('data: false');
        }
        console.log (chatDB);
        chatDB.push(...chatData);
        chatDB = JSON.stringify(chatData);

        console.log(chatDB);
        fs.writeFile('db.json', chatDB, 'utf-8', function (err, data) {
            if (err) throw err;
        });
    }
}); */

// Alternative using readFileSync

/*
try {
  let data = fs.readFileSync('db.json', 'utf8');
  console.log('sync readFile');
  console.log(data);
}
catch (e) {
  console.log(e);
}
*/

let data = fs.readFileSync('db.json', 'utf8');
let dataLngth = Object.keys(data).length === 0;

let chatDB = [];
data = JSON.parse(data);

if (dataLngth) {
  console.log('data: true');
} else {
    console.log('data: false');
}

data.chatDB.push(chatData);

data = JSON.stringify(data);

fs.writeFile('db.json', data, finished);

function finished (err) {
    console.log(err);
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
  		  users[socket.id] = data.name;

		// Broadcast message 
		if (data.name != null) {
		    socket.broadcast.emit('user-connected', data);
		}

  	});

    // Display message to everyone, including yourself
  	socket.on('message', (data)=> {
  		 tech.in(data.room).emit('message', { message: data.chatMsg, name: users[socket.id]});
  	});

  	// Typing... event
  	socket.on('typing', (data)=>{
  	   if(data.typing==true) {
  	      socket.broadcast.emit('display', data);
  	   } else {
  	  	  socket.broadcast.emit('display', data);
  	   }
  	});


});
