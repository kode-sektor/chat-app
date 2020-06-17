'use strict';

const timeHumanise = () => {
	let date = new Date();	// get date now
	let day = date.getDate();	// get day

	let hr = date.getHours();	// hours
	let min = date.getMinutes();	// mins
	let sec = date.getSeconds();	// secs 

	// Prefix with '0' if second is less than 10
	(sec) = (sec.toString().length == '1') ? ('0' + sec) : sec;
	return `<time class='chat-stamp' datetime='${hr}-${min}-${sec}'>${hr}:${min}:${sec}</time>`;
}

const sanitizeHTML = function (str) {
	let temp = document.createElement('div');	// create new div
	temp.textContent = str;	// populate with string using safe 'textContent' JS set property
	return temp.innerHTML;	// return stripped HTML
};

const logged = ({msgList, state, name}) => {
	// check if it is 'connected' or 'disconnected' event that was fired
	let connected = (state === 'online') ? 'connected' : 'disconnected';

	const newMsg = document.createElement('li');	// create new li to append
	newMsg.classList.add('joined');	// style
	msgList.appendChild(newMsg);	// append HTML 
	// Display logged message
	newMsg.innerHTML= `<span><span class="other-user">${name}</span> has ${connected}</span>`;	
}

const meVsThey = (name) => {
	return userMoniker == (name) ? true : false;
}

const connect = (name, chatRoom, moniker) => {

	const room = chatRoom;

	const $msgForm = document.getElementById('sendMsg');
	const $msgList = document.getElementById('messages'); 
	const $textbox = document.getElementById('txt')

	const socket = io.connect('/tech');

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
		e.preventDefault();	// prevent default action

		// neutralise XSS attack and eliminate unnecessary whitespace
		let chatMsg = sanitizeHTML(($textbox.value).trim());	
		socket.emit('message', {chatMsg, room});	// emit message 
		$textbox.value = '';	// clear textbox

	});

	socket.on('message', (msg)=> {
		// compare if the username emitted is the same as that which was collected
		// from user input in dialogue modal form
		let me = (meVsThey(msg.name)) ? 'other-' : '';	// create new class for others

		const newMsg = document.createElement('li');	// create li tag
		newMsg.classList.add('msg');	// insert message
		$msgList.appendChild(newMsg);	// append message
		// append in human readable format
		newMsg.innerHTML= `<span class="${me}user">${msg.name}: </span>  ${msg.message} - ${timeHumanise()}`;
	});

}
