'use strict';

const timeHumanise = () => {
	let date = new Date();
	let day = date.getDate();	

	let hr = date.getHours();
	let min = date.getMinutes();
	let sec = date.getSeconds();
	(sec) = (sec.toString().length == '1') ? ('0' + sec) : sec;
	return `<time class='chat-stamp' datetime='${hr}-${min}-${sec}'>${hr}:${min}:${sec}</time>`;
}

let timestamp = new Date();

let sanitizeHTML = function (str) {
	let temp = document.createElement('div');
	temp.textContent = str;
	return temp.innerHTML;
};

const logged = ({msgList, state, name}) => {

	let connected = (state === 'online') ? 'connected' : 'disconnected';

	const newMsg = document.createElement('li');
	newMsg.classList.add('joined');
	msgList.appendChild(newMsg);
	newMsg.innerHTML= `<span><span class="other-user">${name}</span> has ${connected}</span>`;	
}

const connect = (name, chatRoom) => {

	const room = chatRoom;

	const $msgForm = document.getElementById('sendMsg');
	const $msgList = document.getElementById('messages'); 
	const $textbox = document.getElementById('txt')

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

	// Listen to submission of chat and then emit message in room
	$msgForm.addEventListener('submit', (e) => {
		e.preventDefault();

		let chatMsg = sanitizeHTML(($textbox.value).trim());
		socket.emit('message', {chatMsg, room});
		$textbox.value = '';

	});

	socket.on('message', (msg)=> {
		const newMsg = document.createElement('li');
		newMsg.classList.add('msg');
		$msgList.appendChild(newMsg);
		newMsg.innerHTML= `<span class="other-user">${msg.name} :</span>  ${msg.message} - ${timeHumanise()}`;
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