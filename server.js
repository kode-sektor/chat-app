
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');
const port = 5001;


// Fetch from database

function saveChat (room, chatDB) {

    let data = fs.readFileSync('db.json', 'utf8');

    // console.log(room, chatDB)

    data = JSON.parse(data);

    data[room].push(chatDB);
    data = JSON.stringify(data);

    fs.writeFile('db.json', data, finished);

    function finished (err) {
        console.log(err);
    }

}

const loadChats = (room) => {

    let data = fs.readFileSync('db.json', 'utf8');
    data = JSON.parse(data);

    if ((data[room]).length > 0) {
       let chats = data[room].map(chat => chat);

       return chats;
    }

    function finished (err) {
        console.log(err);
    }
}

const meVsThey = (otherName, userMoniker) => {
   return (userMoniker == otherName) ? true : false;
}


/*try {
    var data = fs.readFileSync(validFile, 'utf8');
    console.log('sync readFile');
    console.log(data);
}
catch (e) {
    console.log(e);
}
}); */



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
             let chats = loadChats(data.room);
            tech.in(data.room).emit('load-chats', { chats });
    		}

  	});


    // Display message to everyone, including yourself
  	socket.on('message', (data) => {
        let $msgList;
        let $msgHTMLDB;
        let otherName = users[socket.id];

        let my = (meVsThey(otherName)) ? 'other-' : '';  // create new class for others
        let msgName = (meVsThey(otherName)) ? otherName : 'You';

        const newMsg = (`${my}msg`); // li class

        // console.log(my, msgName, newMsg);

        // Compare if the username emitted is the same as that which was collected
        // from user input in dialogue modal form
        //let my = (meVsThey(otherName, data.userMoniker)) ? '' : 'other-';  // create new class for others
        
        let msgHTML = `<span class="user">${data.userMoniker}: </span>  ${data.chatMsg} - ${data.humanisedTime}`;
        $msgHTMLDB = `<div class='${newMsg}'>${msgHTML}</div>`;

        console.log ($msgHTMLDB);


        saveChat(users['room'], $msgHTMLDB);

        // console.log(users)

        //also worked too. 
        //let msgHTML = `<span class="user">otherName: </span>  ${data.chatMsg} - ${data.humanisedTime}`;

  		  // tech.in(data.room).emit('message', { message: data.chatMsg, name: users[socket.id]});
        tech.in(data.room).emit('message', { message: msgHTMLDB });

  	});

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
    })

  	// Typing... event
  	socket.on('typing', (data) => {
  	   if(data.typing==true) {
  	      socket.broadcast.emit('display', data);
  	   } else {
  	  	  socket.broadcast.emit('display', data);
  	   }
  	});

});
