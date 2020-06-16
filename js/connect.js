let userMoniker = '';

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

		