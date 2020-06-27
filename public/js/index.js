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

const sanitiseHTML = function (str) {
	let temp = document.createElement('div');	// create new div
	temp.textContent = str;	// populate with string using safe 'textContent' JS set property
	return temp.innerHTML;	// return stripped HTML
};

const logged = ({msgList, state, name}) => {
	// Check if it is 'connected' or 'disconnected' event that was fired
	let connected = (state === 'online') ? 'connected' : 'disconnected';

	const newMsg = document.createElement('li');	// create new li to append
	newMsg.classList.add('joined');	// style
	msgList.appendChild(newMsg);	// append HTML 
	// Display logged message
	newMsg.innerHTML= `<span><span class="other-user">${name.toUpperCase()}</span> has ${connected}</span>`;	
}

const meVsThey = (name) => {
	return (userMoniker == name) ? true : false;
}

const connect = (name, chatRoom, moniker) => {	// called from connect.js

	const room = chatRoom;

	const $msgForm = document.getElementById('sendMsg');
	const $msgList = document.getElementById('messages'); 

	const socket = io.connect('/tech');

	// Moniker and room are the most important details when connecting
	socket.emit('join', {name, room});

	// When user makes connection, inform other users
	socket.on('user-connected', data => {
		logged({
			'msgList' : $msgList,
			'state' : 'online',
			'name' : data.name
		});
	});

	// When user disconnects, inform other users
	socket.on('user-disconnected', data => {
		logged({
			'msgList' : $msgList,
			'state' : 'offline',
			'name' : data.name
		});
	});

	// Listen to submission of chat and then emit message in room (everyone inc. you)
	$msgForm.addEventListener('submit', (e) => { 
		e.preventDefault();	// prevent default action

		// neutralise XSS attack and eliminate unnecessary whitespace
		let chatMsg = sanitiseHTML(($textbox.value).trim());	

		// On 'emit message' (which happens when user submits form), save details in object
		// then pass as props to server

		humanisedTime = timeHumanise();

		const userDetails =  {
			userMoniker,
			chatMsg,
			room,
			humanisedTime
		};

		// socket.emit('message', {chatMsg, room});	
		socket.emit('message', {...userDetails});	

		$textbox.value = '';	// clear textbox

	});

	socket.on('message', (data) => {
		// Compare if the username emitted is the same as that which was collected
		// from user input in dialogue modal form

		let my = (meVsThey(data.id)) ? '' : 'other-';  // create new class for others
		let msgName = (meVsThey(data.id)) ? 'You' : data.id;

		const newMsg = document.createElement('li');	// create li tag
		newMsg.classList.add(`${my}msg`);	// insert message
		$msgList.appendChild(newMsg);	// append message
		// append in human readable format
		// let $msgHTML = `<span class="user">${msgName}: </span>  ${msg.message} - ${timeHumanise()}`;
		let $msgHTML = data.message;
		newMsg.innerHTML = $msgHTML;

	});

	// 'TYPING' LOGIC
	let typing = false;
	let textboxValue = '';

	$textbox.addEventListener("keyup", (e) => {
		textboxValue = (e.target).value;

		if (e.which != 13) {	// Listen to keyup except 'Enter'
			socket.emit('typing', {user:name, typing:true, elm:textboxValue});
		} else {
			socket.emit('typing', {user:name, typing:false, elm:textboxValue});
		}
	});

	// 'TYPING...' RESPONSE FROM SERVER EVENT
	socket.on('display', (data) => {

    	if (data.typing==true) {

    		let $isTyping = document.querySelector('.is-typing');
    		// use null instead of $isTyping.length <= 1 because this condition may not fire
    		// if the typing speed is very fast
    		if ($isTyping == null) {	// Append message to DOM only once
    			const newMsg = document.createElement('li');	// create new li to append
    			newMsg.classList.add('is-typing');	// style
    			$msgList.appendChild(newMsg);	// append HTML 

    			// Display logged message
    			let user = data.user;
    			user = user.charAt(0).toUpperCase() + user.slice(1);
    			newMsg.innerHTML= `<span><span class="other-user">${user}</span> is typing...</span>`;	
    		}

		} else {
			let $isTyping = document.querySelector('.is-typing');
			if ($isTyping !== null) {
				$isTyping.remove();
			}
		}
	});
}