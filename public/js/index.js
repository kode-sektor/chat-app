'use strict';

const timeHumanise = () => {
	let date = new Date();	// get date now
	let day = date.getDate();	// get day

	let hr = date.getHours();	// hours
	let min = date.getMinutes();	// mins
	let sec = date.getSeconds();	// secs 

	let AMPM = (hr >= 12) ? 'PM' : 'AM';

	// Prefix with '0' if second is less than 10
	(sec) = (sec.toString().length == '1') ? ('0' + sec) : sec;
	(min) = (min.toString().length == '1') ? ('0' + min) : min;
	return `<time class='chat-stamp' datetime='${hr}-${min}-${sec}'>${hr}:${min}:${sec} ${AMPM}</time>`;
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

const loadChatHTML = (chat, msgList, me) => {

	console.log(chat);

	const newMsg = document.createElement('li');	// create li tag

	msgList.appendChild(newMsg);	// append message
	// append in human readable format
	// let $msgHTML = `<span class="user">${msgName}: </span>  ${msg.message} - ${timeHumanise()}`;
	let $msgHTML = chat;
	newMsg.innerHTML = $msgHTML;

/*	if (me) {
		// newMsg.querySelector('div').classList.add('msg');
	} else {
		const newmsg = newMsg.querySelectorAll('.msg');
		const newothermsg = newMsg.querySelectorAll('.other-msg');

		for (let i = 0; i < newmsg.length; i++) {    // cycle through accordion headers
		    newmsg[i].classList.add('other-msg');
		        
		};
		for (let i = 0; i < newothermsg.length; i++) {    // cycle through accordion headers
		    newothermsg[i].classList.add('other-msg');
		        
		};*/

	
	console.log(localChatDB);

	/*if (otherUser) {
		newMsg.querySelector('.msg').classList.add('other-msg');
		newMsg.querySelector('.msg').classList.remove('msg');
	}*/
}

const triggerScroll = () => {
	const $chatPane = document.getElementById("messages");
	$chatPane.scrollTop = $chatPane.scrollHeight;
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

	// Fired on response to user joining room
	socket.on('load-chats', (data) => {

		let me = (meVsThey(data.otherName));

		console.log(data);
		if ((data.chats) != undefined) {
			localChatDB = data;	// Store the chat Array locally on connection

			(data.chats[room]).forEach( (chat, indx) => {

				loadChatHTML(chat['$msgHTMLDB'], $msgList);

				if (indx == ((data.chats).length) - 1) {
					triggerScroll();	// Scroll to the end on last iteration
				}
			});
		}
	});

	// Listen to submission of chat and then emit message in room (everyone inc. you)
	$msgForm.addEventListener('submit', (e) => { 
		e.preventDefault();	// prevent default action

		// neutralise XSS attack and eliminate unnecessary whitespace
		let chatMsg = sanitiseHTML(($textbox.value).trim());	

		// On 'emit message' (which happens when user submits form), save details in object
		// then pass as props to server

		const userDetails =  {
			userMoniker,
			chatMsg,
			room,
			humanisedTime
		};

		// socket.emit('message', {chatMsg, room});	
		socket.emit('message', {...userDetails});	

		$textbox.value = '';	// clear textbox

		let isTyping = document.querySelector('.is-typing');
		if (isTyping !== null) {
			isTyping.remove();	// remove any notorious lingering '.is-typing'
		}

	});

	socket.on('message', (data) => {
		// Compare if the username emitted is the same as that which was collected
		// from user input in dialogue modal form
		let moniker = data.moniker;
		let my = (meVsThey(data.otherName)) ? '' : 'other-';  // create new class for others
		let msgName = (meVsThey(data.otherName)) ? 'You' : data.otherName;

		const msgClass = (`${my}msg`); // li class
		
		let msgHTML = `<span class="user">${msgName}: </span>  ${data.message} - ${timeHumanise()}`;
		let $msgHTMLDB = `<div class='${msgClass}'>${msgHTML}</div>`;

		loadChatHTML($msgHTMLDB, $msgList);	// Populate page with chats
		triggerScroll();

		console.log(room);
		// First save chat to local DB (as per the assignment requirement)
		localChatDB["chats"][room].push({$msgHTMLDB});

		// Now save to server database 
		socket.emit('save-chat', {localChatDB});

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