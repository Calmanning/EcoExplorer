import { updateHashParamString } from './URL_params.js?v0.01';
// import updateHashParamString from '..utils/URL_params.js?v0.01';

import { initPopOutView } from '../view.js?v=0.01';

const setViewMode = (hashParams) => {
	console.log(hashParams);
};

const isMobileDevice = () => {
	//checking for device type. Checking if it's a mobile user.
	let istouchEnabled;
	let isMobileDeviceDetected;

	if (navigator.maxTouchPoints > 0) {
		istouchEnabled = true;
	}

	if (
		/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
			navigator.userAgent,
		)
	) {
		isMobileDeviceDetected = true;
	}

	if (istouchEnabled && isMobileDeviceDetected) {
		return true;
	}

	//if neither are true than this is not likely a mobile device.
	return false;
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

	window.addEventListener('resize', (event) => {
		const currentWidth = event.target.innerWidth;
		manageMobileVersion(currentWidth, DOM_id_class_variables);
	});
	// manageMobileVersion(event, DOM_id_class_variables),
};

const manageMobileVersion = (currentWidth, DOM_id_class_variables) => {
	const targetWidth = 850;

	if (currentWidth < targetWidth) {
		initMobileFormat(DOM_id_class_variables);
	} else {
		revertMobileFormat(DOM_id_class_variables);
	}
};

const initMobileFormat = (DOM_id_class_variables) => {
	const userIconElement = document.querySelector(
		`#${DOM_id_class_variables['user_icon_element']}`,
	);

	const explorerDiv = document.querySelector(
		`#${DOM_id_class_variables['explorer_mainView']}`,
	);
	const mobileUIBackground = document.querySelector(
		`#${DOM_id_class_variables['mobile_UI']}`,
	);
	const explorerSupplementalViewContainer = document.querySelector(
		`#${DOM_id_class_variables['explorer_supplementalViews']}`,
	);
	const explorerSupplementalViews = document.querySelectorAll(
		`#${DOM_id_class_variables['explorer_supplementalViews']} arcgis-map`,
	);
	const explorerSupplementalViewsDropdowns = document.querySelectorAll(
		`.${DOM_id_class_variables['dropdownElement']}`,
	);

	const dropDownListElement = document.querySelectorAll(
		`.${DOM_id_class_variables['dropDownClass']}`,
	);

	const selectedViewMode = document.querySelector(
		`#${DOM_id_class_variables['mode_btns_containerID']} .${DOM_id_class_variables['selectedBtnClass']}`,
	).value;

	const viewUIBtns = document.querySelectorAll(
		`.${DOM_id_class_variables['UI_btnsClass']}`,
	);

	const btnLabels = document.querySelectorAll(
		`.${DOM_id_class_variables['projection_btn_label']}`,
	);

	const labelArrows = document.querySelectorAll(
		`.${DOM_id_class_variables['projection_btn_arrow']}`,
	);

	const viewBtnsContainers = document.querySelectorAll(
		`.${DOM_id_class_variables['view_btn_containerClass']}`,
	);

	const zoomComponentContainer = document.querySelectorAll(
		`.${DOM_id_class_variables['zoom_component_container']}`,
	);

	const exportComponentContainer = document.querySelector(
		`#${DOM_id_class_variables['agolExport_iconID']}`,
	);

	const searchComponentContainer = document.querySelectorAll(
		`.${DOM_id_class_variables['component_container']}`,
	);

	userIconElement.classList.add(DOM_id_class_variables['mobileClass']);

	explorerDiv.classList.add(DOM_id_class_variables['mobileClass']);

	explorerSupplementalViewContainer.classList.add(
		`${DOM_id_class_variables['mobileClass']}`,
	);

	explorerSupplementalViews.forEach((mapView) =>
		mapView.classList.add(`${DOM_id_class_variables['mobileClass']}`),
	);

	explorerSupplementalViewsDropdowns.forEach((dropDown) =>
		dropDown.classList.add(`${DOM_id_class_variables['mobileClass']}`),
	);

	dropDownListElement.forEach((dropDownList) => {
		dropDownList.classList.add(`${DOM_id_class_variables['mobileClass']}`);
	});

	viewUIBtns.forEach((btnElement) => {
		btnElement.classList.add(`${DOM_id_class_variables['mobileClass']}`);
	});

	viewBtnsContainers.forEach((containerElement) => {
		containerElement.classList.add(`${DOM_id_class_variables['mobileClass']}`);
	});

	btnLabels.forEach((btnLabelsElement) => {
		btnLabelsElement.classList.add(
			`${DOM_id_class_variables['noDisplayClass']}`,
		);
	});

	labelArrows.forEach((btnLabelArrowElement) => {
		btnLabelArrowElement.classList.add(
			`${DOM_id_class_variables['noDisplayClass']}`,
		);
	});

	zoomComponentContainer.forEach((zoomContainer) => {
		zoomContainer.classList.add(`${DOM_id_class_variables['mobileClass']}`);
	});

	exportComponentContainer.classList.add(
		`${DOM_id_class_variables['mobileClass']}`,
	);

	searchComponentContainer.forEach((searchContainer) => {
		searchContainer.classList.add(`${DOM_id_class_variables['mobileClass']}`);
	});

	if (selectedViewMode !== 'change') {
		mobileUIBackground.classList.remove(
			`${DOM_id_class_variables['hiddenClass']}`,
		);
	}
};

const revertMobileFormat = (DOM_id_class_variables) => {
	const userIconElement = document.querySelector(
		`#${DOM_id_class_variables['user_icon_element']}`,
	);

	const explorerDiv = document.querySelector(
		`#${DOM_id_class_variables['explorer_mainView']}`,
	);
	const mobileUIBackground = document.querySelector(
		`#${DOM_id_class_variables['mobile_UI']}`,
	);
	const explorerSupplementalViewContainer = document.querySelector(
		`#${DOM_id_class_variables['explorer_supplementalViews']}`,
	);
	const explorerSupplementalViews = document.querySelectorAll(
		`#${DOM_id_class_variables['explorer_supplementalViews']} arcgis-map`,
	);
	const explorerSupplementalViewsDropdowns = document.querySelectorAll(
		`.${DOM_id_class_variables['dropdownElement']}`,
	);

	const selectedViewMode = document.querySelector(
		`#${DOM_id_class_variables['mode_btns_containerID']} .${DOM_id_class_variables['selectedBtnClass']}`,
	).value;
	console.log(selectedViewMode);
	const viewUIBtns = document.querySelectorAll(
		`.${DOM_id_class_variables['UI_btnsClass']}`,
	);

	const btnLabels = document.querySelectorAll(
		`.${DOM_id_class_variables['projection_btn_label']}`,
	);

	const labelArrows = document.querySelectorAll(
		`.${DOM_id_class_variables['projection_btn_arrow']}`,
	);

	const viewBtnsContainers = document.querySelectorAll(
		`.${DOM_id_class_variables['view_btn_containerClass']}`,
	);

	const zoomComponentContainer = document.querySelectorAll(
		`.${DOM_id_class_variables['zoom_component_container']}`,
	);

	const exportComponentContainer = document.querySelector(
		`#${DOM_id_class_variables['agolExport_iconID']}`,
	);

	const searchComponentContainer = document.querySelectorAll(
		`.${DOM_id_class_variables['component_container']}`,
	);

	userIconElement.classList.remove(DOM_id_class_variables['mobileClass']);
	explorerDiv.classList.remove(DOM_id_class_variables['mobileClass']);

	explorerSupplementalViewContainer.classList.remove(
		`${DOM_id_class_variables['mobileClass']}`,
	);

	explorerSupplementalViews.forEach((mapView) =>
		mapView.classList.remove(`${DOM_id_class_variables['mobileClass']}`),
	);

	explorerSupplementalViewsDropdowns.forEach((dropDown) =>
		dropDown.classList.remove(`${DOM_id_class_variables['mobileClass']}`),
	);

	viewUIBtns.forEach((btnElement) => {
		btnElement.classList.remove(`${DOM_id_class_variables['mobileClass']}`);
	});

	viewBtnsContainers.forEach((containerElement) => {
		containerElement.classList.remove(
			`${DOM_id_class_variables['mobileClass']}`,
		);
	});

	mobileUIBackground.classList.add(`${DOM_id_class_variables['hiddenClass']}`);

	btnLabels.forEach((btnLabelsElement) => {
		btnLabelsElement.classList.remove(
			`${DOM_id_class_variables['noDisplayClass']}`,
		);
	});

	labelArrows.forEach((btnLabelArrowElement) => {
		btnLabelArrowElement.classList.remove(
			`${DOM_id_class_variables['noDisplayClass']}`,
		);
	});

	zoomComponentContainer.forEach((zoomContainer) => {
		zoomContainer.classList.remove(`${DOM_id_class_variables['mobileClass']}`);
	});

	exportComponentContainer.classList.remove(
		`${DOM_id_class_variables['mobileClass']}`,
	);

	searchComponentContainer.forEach((searchContainer) => {
		searchContainer.classList.remove(
			`${DOM_id_class_variables['mobileClass']}`,
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
	if (event.target.classList.contains('cancel')) {
		toggle_AGOL_Export({ config, DOM_id_class_variables, mapViews });
	}
};

const togglePopOutMapDisplay = (popOutMapElement) => {
	if (popOutMapElement.classList.contains('not-displayed')) {
		popOutMapElement.classList.remove('not-displayed');
	} else {
		popOutMapElement.classList.add('not-displayed');
	}
};
//NOT A GOOD NAME. This does more than just the view mode.
//NEEDS A NEW NAME -- this function does more than just change the view mode.
// it is the event listener and function dispatcher for all BTN related clicks.
//this function relates to any of the view related buttons in the top-right corner that are clicked
const changeViewMode = (
	config,
	noDisplayClass,
	hiddenClass,
	selectedBtnClass,
	DOM_id_class_variables,
	viewButtonsUI,
	projectionChangeModelButtons,
	changeTypeButtons,
	event,
	updateProjectionModelVisibility,
	projectionStatistics,
	getString,
) => {
	if (!event.target.closest('button')) {
		return;
	}
	if (event.target.closest('button').classList.contains(selectedBtnClass)) {
		return;
	}

	const ecosystemExploreView = document.querySelector(
		`#${DOM_id_class_variables['explorer_containerDiv']}`,
	);

	const projectionViewContainer = document.querySelector(
		`#${DOM_id_class_variables['projection_containerDiv']}`,
	);
	const projectionViewElement = document.querySelector(
		`#${DOM_id_class_variables[['projectionMode_mainView']]}`,
	);

	const projectionStatisticsElement = projectionViewElement.querySelector(
		`#${DOM_id_class_variables['projection_statistics']}`,
	);

	const explorerMobileComponent = document.querySelector(
		`#${DOM_id_class_variables['explore_mobile_component']}`,
	);

	const targetButton = event.target.closest('button');

	const selectedFilterChange = changeTypeButtons.querySelector(
		`.${selectedBtnClass}`,
	)
		? changeTypeButtons.querySelector(`.${selectedBtnClass}`).value
		: '';

	console.log(selectedFilterChange);
	//determines if the buttons to change the view-mode have been clicked
	if (targetButton.parentElement.id === 'mode-btns') {
		const viewModeString = event.target.closest('button').value;

		const cascadeLabelForBtn = viewButtonsUI.querySelectorAll(`.cascade-label`);
		// const cascadeLabelForBtn = viewButtonsUI.querySelectorAll(
		// 	`.${DOM_id_class_variables['projection_label_element']}`,
		// );
		const modeBtnCascadeLabelArrow = viewButtonsUI.querySelector(
			`.${DOM_id_class_variables['projection_btn_arrow']}`,
		);

		if (projectionViewContainer.classList.contains(noDisplayClass)) {
			projectionViewContainer.classList.remove(noDisplayClass);
			projectionChangeModelButtons.classList.remove(hiddenClass);
			modeBtnCascadeLabelArrow.classList.remove(hiddenClass);

			//putting 'no display' on the ecosystem explorer
			ecosystemExploreView.classList.add(
				DOM_id_class_variables['noDisplayClass'],
			);

			cascadeLabelForBtn.forEach((hiddenElement) => {
				hiddenElement.classList.remove(DOM_id_class_variables['hiddenClass']);
			});
			if (projectionChangeModelButtons.querySelector(`.${selectedBtnClass}`)) {
				changeTypeButtons.classList.remove(hiddenClass);
			}
			if (window.innerWidth < 850) {
				explorerMobileComponent.parentElement.classList.add(hiddenClass);
			}
		} else {
			projectionViewContainer.classList.add(noDisplayClass);

			//removing the no display from the ecosystem explorer parent div
			ecosystemExploreView.classList.remove(
				DOM_id_class_variables['noDisplayClass'],
			);

			projectionChangeModelButtons.classList.add(hiddenClass);
			modeBtnCascadeLabelArrow.classList.add(hiddenClass);
			changeTypeButtons.classList.add(hiddenClass);
			cascadeLabelForBtn.forEach((hiddenElement) => {
				hiddenElement.classList.add(DOM_id_class_variables['hiddenClass']);
			});
			if (window.innerWidth < 850) {
				explorerMobileComponent.parentElement.classList.remove(hiddenClass);
			}
		}

		const modeBtns = viewButtonsUI.querySelectorAll('button');
		modeBtns.forEach((btnElement) => {
			btnElement.classList.remove('selected-btn');
		});
		event.target.closest('button').classList.add('selected-btn');

		updateHashParamString({ viewModeString });
	}

	if (targetButton.parentElement.id === 'changeModel-btns') {
		changeTypeButtons.classList.remove(hiddenClass);

		const modelLabelArrow = projectionChangeModelButtons.querySelector(
			`.${DOM_id_class_variables['projection_btn_arrow']}`,
		);
		modelLabelArrow.classList.remove(DOM_id_class_variables['hiddenClass']);

		const hidden_filterBtn_UI = viewButtonsUI.querySelectorAll(
			`.${DOM_id_class_variables['hiddenClass']}`,
		);
		console.log(
			'these are hidden elements for the change filter selection',
			hidden_filterBtn_UI,
		);
		hidden_filterBtn_UI.forEach((hiddenElement) => {
			hiddenElement.classList.remove(DOM_id_class_variables['hiddenClass']);
		});

		const modeBtns = targetButton.parentElement.querySelectorAll('button');
		modeBtns.forEach((btnElement) => {
			btnElement.classList.remove('selected-btn');
		});
		event.target.closest('button').classList.add('selected-btn');

		const changeModelString = event.target.closest('button').value;
		updateHashParamString({ changeModelString });
	}

	if (
		targetButton.parentElement.id === 'changeModel-btns' &&
		selectedFilterChange !== ''
	) {
		console.log(
			'the param is true in the applicationEnvents',
			selectedFilterChange,
		);
		//this is not a good query phrase 'button' might be too vague.
		const changeModelString = event.target.closest('button').value;

		const projectionStatisticsCategory = changeTypeButtons.querySelector(
			`.${selectedBtnClass}`,
		)
			? changeTypeButtons
					.querySelector(`.${selectedBtnClass}`)
					.getAttribute('category')
			: '';

		updateProjectionModelVisibility(
			config,
			projectionViewElement,
			changeModelString,
			selectedFilterChange,
		);

		projectionStatistics(
			changeModelString,
			projectionStatisticsCategory,
			projectionStatisticsElement,
			getString,
		);
	}

	if (targetButton.parentElement.id === 'changeType-btns') {
		const projectionModelString = projectionChangeModelButtons
			.querySelector(`.${selectedBtnClass}`)
			.value.toLowerCase()
			.trim();

		const changeTypeFilterBtns =
			targetButton.parentElement.querySelectorAll('button');
		changeTypeFilterBtns.forEach((btnElement) => {
			btnElement.classList.remove('selected-btn');
		});

		event.target.closest('button').classList.add('selected-btn');
		const changeTypeString = event.target.closest('button').value;
		const projectionStatisticsCategory = event.target
			.closest('button')
			.getAttribute('category');

		updateHashParamString({ changeTypeString });

		updateProjectionModelVisibility(
			config,
			projectionViewElement,
			projectionModelString,
			changeTypeString,
		);

		console.log('the filter value', projectionStatisticsCategory);
		console.log(getString);
		//not a thing yet.
		projectionStatistics(
			projectionModelString,
			projectionStatisticsCategory,
			projectionStatisticsElement,
			getString,
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
	getString,
) => {
	console.log('dropdown evenrts', getString);
	console.log('dropdown evenrts', event.target);
	console.log('dropdown evenrts', event.target.closest('.choice'));

	if (event.target.closest('.map-pop-out-icon')) {
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
		const popOutTooltip = popOutMapDiv.querySelector('.tooltipText');

		console.log('popup icon div', popOutTooltip);

		const popOutDropdownSelection = dropdownContainer
			.querySelector('.display')
			.textContent.trim();

		const dropdownSelectedTooltip = dropdownContainer.querySelector(
			'.selected-tooltip calcite-tooltip span',
		);

		console.log(dropdownSelectedTooltip.innerHTML);
		console.log(popOutTooltip);

		const newPopOutTitleText = event.target
			.closest('.label')
			.querySelector('.pop-out-title').textContent;

		popOutTitleHTML.textContent = `${newPopOutTitleText}: ${popOutDropdownSelection}`;
		popOutTooltip.textContent = dropdownSelectedTooltip.innerHTML;

		popOutMapDiv.append(popOutView);

		togglePopOutMapDisplay(popOutContainer, hiddenClass);
		// popOutContainer.classList.remove('not-displayed');
	}

	if (event.target.classList.contains('choice')) //pick a different
	{
		const target = event.target.closest('.choice');
		const selectedDataId = target.getAttribute('data-id');
		const selectedValue = target.getAttribute('value');
		const selectDisplayElement = dropdownContainer.querySelector('.display');

		updateDropdownSelectElement({
			selectedValue,
			selectDisplayElement,
			selectedDataId,
			getString,
		});
		mapClickEventDelegation({
			event,
			config,
			explorerLookupTable,
			DOM_id_class_variables,
			showInvalidNotificationDiv,
			createNewCrosshairGraphic,
			getString,
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
	selectedDataId,
	getString,
}) => {
	if (selectDisplayElement.classList.contains('placeholder')) {
		selectDisplayElement.classList.remove('placeholder');
	}
	console.log('new selection string', getString(selectedValue));
	selectDisplayElement.innerHTML = getString(selectedValue);
	selectDisplayElement.setAttribute('value', `${selectedValue}`);
};

const toggleDropdown = (dropdownContainer, hiddenClass) => {
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
		return;
	}

	const dropdowns = document.querySelectorAll('.select-dropdown');

	dropdowns.forEach((dropdownElement) => {
		if (!dropdownElement.classList.contains('hidden')) {
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
	console.log('export toggling');
	console.log(exportContainerElement);
	console.log(exportContainerElement !== null);

	if (exportContainerElement) {
		console.log('removing element');
		exportContainerElement.remove();
		const exportState = false;
		updateHashParamString({ exportState });
		return;
	} else {
		const exportState = true;
		updateHashParamString({ exportState });
	}
};

export {
	isMobileDevice,
	setViewMode,
	changeViewMode,
	dropdownEvents,
	initAppTopLevelEventListener,
	toggle_AGOL_Export,
	manageMobileVersion,
};
