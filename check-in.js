import { initApp } from './main.js?v=0.01';

const checkInContainerID = 'checkIn-container';
const inputContainerClass = 'input-container';
const incorrectClass = 'incorrect';
const inputId = 'password';
const buttonId = 'submitBtn';
const phrase = 'DoNotReshare!';

const checkInHTML = `
<div class='${inputContainerClass}'>
  
    <label for="password">Password, please</label>
    <input 
      type="text" 
      id="${inputId}"
      name="password" 
      placeholder="Enter password" 
      autocomplete="off"
    >
    <button type="button" id='${buttonId}' class='btn'>Enter</button>
  
</div>`;

const checkIn = () => {
	console.log('begin check in');
	const checkInComponent = addCheckInToDocument();
	console.log(checkInComponent);

	const passwordInput = document.getElementById(`${inputId}`);
	console.log(passwordInput);

	const buttonElement = document.getElementById(`${buttonId}`);
	console.log(buttonElement);

	passwordInput.addEventListener('keydown', (event) => {
		console.log('keydown');
		if (event.key === 'Enter') {
			const passwordInputValue = passwordInput.value;
			if (passwordInputValue === phrase) {
				event.preventDefault();
				console.log('true', passwordInputValue);
				checkInComponent.remove();
				initApp();
				return true;
			} else {
				passwordInput.value = '';
				passwordInput.placeholder = 'Try again';
			}
		}
	});

	buttonElement.addEventListener('click', (event) => {
		event.preventDefault();

		console.log('input');
		console.log(passwordInput.value);

		const passwordInputValue = passwordInput.value;
		if (passwordInputValue === phrase) {
			console.log('true', passwordInputValue);
			checkInComponent.remove();
			initApp();
			return true;
		} else {
			passwordInput.value = '';
			passwordInput.placeholder = 'Try again';
		}
	});
};

const addCheckInToDocument = () => {
	const checkInContainer = document.createElement('div');
	checkInContainer.id = checkInContainerID;

	checkInContainer.innerHTML = checkInHTML;

	document.body.prepend(checkInContainer);
	return checkInContainer;
};

export { checkIn };
