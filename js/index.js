'use strict'

const socket = io();

// Send a message to say that I've connected

// alert(type in your name)
socket.emit('newuser', {user: 'Grace Hopper'});

// Event listener, waiting for an incoming "newuser"
socket.on('newuser', (data) => console.log(`${data.user} has connected!`));


// Listen for the 'submit' of a form
// 	 event.preventDefault()  (prevent the form from leaving the page)
//   Emit a message using "chatmsg"
// Listen for "chatmsg"
//   add a <li> with the chat msg to the <ol>


// Listen to submission of dialogue form 
const $dialogueForm = document.getElementById('#chat-user');
const $dialogModal = document.getElementById('#prompt-modal-bg"');

// On submission of the form
$msgForm.addEventListener('submit', (event) => {
	// Save moniker
});

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
