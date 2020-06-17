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

const sanitizeHTML = function (str) {
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
		e.preventDefault();

		let chatMsg = sanitizeHTML(($textbox.value).trim());
		socket.emit('message', {chatMsg, room});
		$textbox.value = '';

	});

	socket.on('message', (msg)=> {
		if (meVsThey(msg.name)) alert ('true');
		const newMsg = document.createElement('li');
		newMsg.classList.add('msg');
		$msgList.appendChild(newMsg);
		newMsg.innerHTML= `<span class="other-user">${msg.name}: </span>  ${msg.message} - ${timeHumanise()}`;
	});

}
