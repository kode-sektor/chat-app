'use strict';

const connect = (name, chatRoom) => {

	const room = chatRoom;

	//const socket = io.connect('/tech');

	alert(chatRoom);
	alert (name);


	const socket = io();

	// Send a message to say that I've connected

	// alert(type in your name)
	// socket.emit('newuser', {user: 'Grace Hopper'});

	socket.emit('join', {name, chatRoom});

	socket.on('user-connected', name => {
		$('#messages').append($('<li>').text(name + ' is connected'));
	});


	// Event listener, waiting for an incoming "newuser"
	socket.on('newuser', (data) => console.log(`${data.user} has connected!`));
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



const $msgForm = document.getElementById('sendMsg');
const $msgList = document.getElementById('messages');


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
