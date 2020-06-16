'use strict';

const logged = ({msgList, state, name}) => {

	let connected = (state === 'online') ? 'connected' : 'disconnected';
	const newMsg = document.createElement('li');
	newMsg.classList.add('msg');
	msgList.appendChild(newMsg);
	newMsg.innerHTML= `<span class="other-user">${name}</span> has ${connected}`;	
}

const connect = (name, chatRoom) => {

	const room = chatRoom;

	const $msgForm = document.getElementById('sendMsg');
	const $msgList = document.getElementById('messages'); 

	//const socket = io();
	const socket = io.connect('/tech');

	// Send a message to say that I've connected

	// alert(type in your name)
	// socket.emit('newuser', {user: 'Grace Hopper'});

	socket.emit('join', {name, room});

	// When user makes connection, inform other users
	socket.on('user-connected', name => {
		logged({
			'msgList' : $msgList,
			'state' : 'online',
			'name' : name
		});
	});

	// When user disconnects, inform other users
	socket.on('user-disconnected', name => {
		logged({
			'msgList' : $msgList,
			'state' : 'offline',
			'name' : name
		});
	});


	// Event listener, waiting for an incoming "newuser"
	// socket.on('newuser', (data) => console.log(`${data.user} has connected!`));
}

/*const socket = io();

// Send a message to say that I've connected

// alert(type in your name)
socket.emit('newuser', {user: 'Grace Hopper'});

// Event listener, waiting for an incoming "newuser"
socket.on('newuser', (data) => console.log(`${data.user} has connected!`));*/


// Listen for the 'submit' of a form
// 	 event.preventDefault()  (prevent the form from leaving the page)
//   Emit a message using "chatmsg"
// Listen for "chatmsg"
//   add a <li> with the chat msg to the <ol>


/*

$msgForm.addEventListener('submit', (event) => {
	event.preventDefault();

	socket.emit('chatmsg', {msg: event.currentTarget.txt.value});
	event.currentTarget.txt.value = '';
});


socket.on('chatmsg', (data) => {
	const newMsg = document.createElement('li');
	$msgList.appendChild(newMsg);

	newMsg.textContent = data.msg;
})
*/