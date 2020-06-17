let userMoniker = '';

// Listen to submission of dialogue form 
const $dialogueForm = document.getElementById('chat-user');
const $dialogModal = document.getElementById('prompt-modal-bg');
const $moniker = document.getElementById('moniker');
const $textbox = document.getElementById('txt');

let path = window.location.pathname;
let file = path.split("/").pop();
file = file.split('.').shift();

// On submission of the form
$dialogueForm.addEventListener('submit', (e) => {
	e.preventDefault();	// prevent default action
	userMoniker = $moniker.value;	// get username
	if (userMoniker.length < 3) {
		alert('Moniker should be 3 or more words long');
	} else {
		$moniker.removeAttribute('autofocus');
		$textbox.setAttribute('autofocus', '');
		$textbox.focus();	// Switch focus immediately modal disappeaers
		$dialogModal.classList.add('bg-active');	// hide modal	
		connect(userMoniker, file);
	}
});