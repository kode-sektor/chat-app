'use strict';

let userMoniker = '';

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
const $dialogueForm = document.getElementById('chat-user');
const $dialogModal = document.getElementById('prompt-modal-bg');
const $moniker = document.getElementById('moniker');


// On submission of the form
$dialogueForm.addEventListener('submit', (e) => {
	e.preventDefault();	// prevent default action
	userMoniker = $moniker.value;	// get username
	if (userMoniker.length < 3) {
		alert('Moniker should be 3 or more words long');
	} else {
		$dialogModal.classList.add('bg-active');	// hide modal	
	}
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
