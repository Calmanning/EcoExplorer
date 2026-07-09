import { updateHashParamString } from './URL_params.js?v0.01';
// import updateHashParamString from '..utils/URL_params.js?v0.01';

import { initPopOutView } from '../view.js?v=0.01';

const setViewMode = (hashParams) => {
	console.log(hashParams);
};

//gonna need a way to access all these classes and ids
const initAppTopLevelEventListener = (
	config,
	DOM_id_class_variables,
	hashParams,
	mapViews,
	getCredentials,
	addExportFormToMap,
	parseAndFormatURL,
	userPortalData,
) => {
	console.log('in the application events file', userPortalData);
	const mainAppElement = document.querySelector('main');

	mainAppElement.addEventListener('click', (event) => {
		topLevelClickEvent(
			config,
			event,
			DOM_id_class_variables,
			hashParams,
			mapViews,
			getCredentials,
			addExportFormToMap,
			parseAndFormatURL,
			userPortalData,
		);
	});
};

const topLevelClickEvent = (
	config,
	event,
	DOM_id_class_variables,
	hashParams,
	mapViews,
	getCredentials,
	addExportFormToMap,
	parseAndFormatURL,
	userPortalData,
) => {
	if (!event.target.closest('.dropdown-select')) {
		closeAllDropdowns(event);
	}
	// if (event.target.id === DOM_id_class_variables['export_container']) {
	// 	console.log('closing export');
	// 	toggle_AGOL_Export({
	// 		config,
	// 		DOM_id_class_variables,
	// 		hashParams,
	// 		mapViews,
	// 	});
	// }
	if (
		event.target.id === 'pop-out-map-container' ||
		(event.target.icon === 'x' &&
			event.target.closest('#pop-out-map-container'))
	) {
		const popOutContainer = event.target.closest('#pop-out-map-container');
		togglePopOutMapDisplay(popOutContainer);
	}
	if (
		event.target.id === DOM_id_class_variables['agolExport_iconID'] ||
		event.target.icon === 'arcgis-online'
	) {
		console.log('make the export UI and get the mapView Data', mapViews);
		// const exportUI_container = DOM_id_class_variables['export_container'];

		console.log('calling the export form', userPortalData);
		toggle_AGOL_Export({ config, DOM_id_class_variables, mapViews });
		addExportFormToMap(
			config,
			DOM_id_class_variables,
			hashParams,
			mapViews,
			parseAndFormatURL,
			userPortalData,
		);
		getCredentials();
	}
	// if (
	// 	event.target.id === 'export-icon' ||
	// 	event.target.icon === 'arcgis-online'
	// ) {
	// 	console.log('export');
	// }
};

const togglePopOutMapDisplay = (popOutMapElement) => {
	if (popOutMapElement.classList.contains('not-displayed')) {
		popOutMapElement.classList.remove('not-displayed');
	} else {
		popOutMapElement.classList.add('not-displayed');
	}
	// console.log(popOutMapElement);
	// document.querySelector('#pop-out-map arcgis-map').remove();
};
//NEEDS A NEW NAME -- this function does more than just change the view mode. it is the event listener and function dispatcher for all BTN related clicks.
//NOT A GOOD NAME. This does more than just the view mode.
const changeViewMode = (
	config,
	classString,
	hiddenClass,
	selectedBtnClass,
	changeViewElementId,
	viewButtonsUI,
	projectionChangeModelButtons,
	changeTypeButtons,
	event,
	updateProjectionModelVisibility,
) => {
	console.log(selectedBtnClass);
	if (!event.target.closest('button')) {
		return;
	}
	if (event.target.closest('button').classList.contains(selectedBtnClass)) {
		return;
	}
	//this is too convenient?
	const viewElement = document.querySelector(`#${changeViewElementId}`);

	const targetButton = event.target.closest('button');

	console.log(changeTypeButtons);
	const selectedFilterChange = changeTypeButtons.querySelector(
		`.${selectedBtnClass}`,
	)
		? changeTypeButtons.querySelector(`.${selectedBtnClass}`).value
		: '';

	if (targetButton.parentElement.id === 'mode-btns') {
		const viewModeString = event.target.closest('button').value;
		console.log(viewModeString);

		if (viewElement.classList.contains(classString)) {
			viewElement.classList.remove(classString);
			projectionChangeModelButtons.classList.remove(hiddenClass);
			if (projectionChangeModelButtons.querySelector(`.${selectedBtnClass}`)) {
				console.log('TRUE');
				changeTypeButtons.classList.remove(hiddenClass);
			}
		} else {
			viewElement.classList.add(classString);
			projectionChangeModelButtons.classList.add(hiddenClass);
			changeTypeButtons.classList.add(hiddenClass);
		}

		const modeBtns = viewButtonsUI.querySelectorAll('button');
		modeBtns.forEach((btnElement) => {
			btnElement.classList.remove('selected-btn');
		});
		event.target.closest('button').classList.add('selected-btn');

		updateHashParamString({ viewModeString });
	}

	if (targetButton.parentElement.id === 'changeModel-btns') {
		console.log('model');

		changeTypeButtons.classList.remove(hiddenClass);

		const modeBtns = targetButton.parentElement.querySelectorAll('button');
		modeBtns.forEach((btnElement) => {
			btnElement.classList.remove('selected-btn');
		});
		event.target.closest('button').classList.add('selected-btn');

		const changeModelString = event.target.closest('button').value;
		updateHashParamString({ changeModelString });
	}

	console.log(selectedFilterChange);
	if (
		targetButton.parentElement.id === 'changeModel-btns' &&
		selectedFilterChange !== false
	) {
		const changeModelString = event.target.closest('button').value;
		console.log(changeModelString, selectedFilterChange);

		updateProjectionModelVisibility(
			config,
			viewElement,
			changeModelString,
			selectedFilterChange,
		);
	}

	if (targetButton.parentElement.id === 'changeType-btns') {
		const projectionModelString = projectionChangeModelButtons
			.querySelector(`.${selectedBtnClass}`)
			.value.toLowerCase()
			.trim();
		console.log(projectionModelString);
		console.log(
			projectionChangeModelButtons.querySelector(`.${selectedBtnClass}`).value,
		);

		const changeTypeFilterBtns =
			targetButton.parentElement.querySelectorAll('button');
		changeTypeFilterBtns.forEach((btnElement) => {
			btnElement.classList.remove('selected-btn');
		});

		event.target.closest('button').classList.add('selected-btn');
		const changeTypeString = event.target.closest('button').value;
		console.log(changeTypeString);
		updateHashParamString({ changeTypeString });

		updateProjectionModelVisibility(
			config,
			viewElement,
			projectionModelString,
			changeTypeString,
		);
	}
};

//THIS IS NOT A GOOD NAME. THIS HAS BECOME A 'SMALLER MAPS' event listener
const dropdownEvents = async (
	viewDiv,
	DOM_id_class_variables,
	dropdownContainer,
	event,
	config,
	hashParams,
	hiddenClass,
	mapClickEventDelegation,
	explorerLookupTable,
	parseAndFormatURL,
	showInvalidNotificationDiv,
	createNewCrosshairGraphic,
) => {
	console.log('dropdown evenrts', event.target);

	if (event.target.closest('.map-pop-out-icon')) {
		console.log('new map!');

		const popOutContainer = document.querySelector('#pop-out-map-container');

		const popOutMapDiv = document.querySelector('#pop-out-map');
		if (popOutMapDiv.querySelector('arcgis-map')) {
			popOutMapDiv.querySelector('arcgis-map').remove();
		}

		const popOutView = await initPopOutView(
			event,
			config,
			hashParams,
			parseAndFormatURL,
		);

		const popOutTitleHTML = popOutMapDiv.querySelector('.label .pop-out-title');
		const popOutDropdownSelection = dropdownContainer
			.querySelector('.display')
			.textContent.trim();

		console.log(popOutDropdownSelection);

		const newPopOutTitleText = event.target
			.closest('.label')
			.querySelector('.pop-out-title').textContent;

		popOutTitleHTML.textContent = `${newPopOutTitleText}: ${popOutDropdownSelection}`;

		popOutMapDiv.append(popOutView);
		console.log(popOutContainer.classList);

		togglePopOutMapDisplay(popOutContainer, hiddenClass);
		// popOutContainer.classList.remove('not-displayed');
	}

	if (event.target.classList.contains('choice')) //pick a different
	{
		const selectedValue = event.target.getAttribute('value');
		const selectDisplayElement = dropdownContainer.querySelector('.display');

		updateDropdownSelectElement({ selectedValue, selectDisplayElement });
		mapClickEventDelegation({
			event,
			config,
			explorerLookupTable,
			DOM_id_class_variables,
			showInvalidNotificationDiv,
			createNewCrosshairGraphic,
		});
	}
	if (event.target.closest('.dropdown-select')) {
		//This is probably not the best implementation of this condition. But it looks to
		if (
			!dropdownContainer
				.querySelector('ul')
				.classList.contains(`${hiddenClass}`)
		) {
			toggleDropdown(dropdownContainer, hiddenClass);
			return;
		}
		closeAllDropdowns(event);

		toggleDropdown(dropdownContainer, hiddenClass);
	}
};

const updateDropdownSelectElement = ({
	selectedValue,
	selectDisplayElement,
}) => {
	if (selectDisplayElement.classList.contains('placeholder')) {
		selectDisplayElement.classList.remove('placeholder');
	}

	selectDisplayElement.innerHTML = selectedValue;
};

const toggleDropdown = (dropdownContainer, hiddenClass) => {
	console.log(dropdownContainer);
	const list = dropdownContainer.querySelector('ul');
	const isOpen = list.classList.contains(hiddenClass) ? false : true;
	list.classList.toggle(hiddenClass);
	dropdownContainer.setAttribute('aria-expanded', isOpen);
};

const closeAllDropdowns = (event) => {
	if (
		event.target.classList.contains('choice')
		// ||
		// event.target.closest('.dropdown-select')
	) {
		console.log(
			'not closing the drops',
			event.target.closest('.dropdown-select'),
		);
		return;
	}

	console.log('closing dropdowns');
	const dropdowns = document.querySelectorAll('.select-dropdown');

	dropdowns.forEach((dropdownElement) => {
		if (!dropdownElement.classList.contains('hidden')) {
			console.log('hey a thing');
			dropdownElement.classList.toggle('hidden', true);
			dropdownElement.setAttribute('aria-expanded', false);
		}
		// const isOpen = dropdownElement.classList.contains('hidden');
	});
};

const toggle_AGOL_Export = ({ DOM_id_class_variables, mapViews }) => {
	const exportContainerElement = document.querySelector(
		`#${DOM_id_class_variables['export_container']}`,
	);

	// exportContainerElement.classList.toggle(
	// 	DOM_id_class_variables['noDisplayClass'],
	// );
	console.log(exportContainerElement);
	if (exportContainerElement) {
		exportContainerElement.remove();
		const exportState = false;
		updateHashParamString({ exportState });
		return;
	} else {
		const exportState = true;
		updateHashParamString({ exportState });
	}

	// if (
	// 	!exportContainerElement.classList.contains(
	// 		DOM_id_class_variables['noDisplayClass'],
	// 	)
	// ) {
	// 	console.log('true export');
	// 	const exportState = true;
	// 	updateHashParamString({ exportState });
	// } else if (
	// 	exportContainerElement.classList.contains(
	// 		DOM_id_class_variables['noDisplayClass'],
	// 	)
	// ) {
	// 	console.log('false export');
	// 	const exportState = false;
	// 	updateHashParamString({ exportState });
	// }
};
// const addAccountImage = (accountInfo) => {
// 	account = accountInfo;
// 	const profileImg = document.createElement('img');
// 	if (accountInfo.img) {
// 		profileImg.setAttribute('src', `${accountInfo.img}`);
// 		document.querySelector('#user-icon .profile svg').remove();
// 		document.querySelector('#user-icon .profile').append(profileImg);
// 	}

// 	addLogOutElement();
// };

// const addLogOutElement = () => {
// 	const xIcon = `
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 19 19">
//       <path d="M8.5 1.2a7.3 7.3 0 1 0 7.3 7.3 7.3 7.3 0 0 0-7.3-7.3zm3.818 10.128l-.99.99L8.5 9.49l-2.828 2.828-.99-.99L7.51 8.5 4.682 5.672l.99-.99L8.5 7.51l2.828-2.828.99.99L9.49 8.5z"></path>
//     </svg>`;
// 	const logOutIMG = document.createElement('div');
// 	logOutIMG.classList.add('logOut-icon');
// 	logOutIMG.innerHTML = xIcon;

// 	document.querySelector('#user-icon .profile').append(logOutIMG);
// 	logOutListener();
// };

export {
	setViewMode,
	changeViewMode,
	dropdownEvents,
	initAppTopLevelEventListener,
	toggle_AGOL_Export,
};
