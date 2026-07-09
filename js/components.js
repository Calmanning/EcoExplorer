const DOM_id_class_variables = {
	explorer_containerDiv: 'explore',
	explorer_mainView: 'explore-main-view',
	viewStyle_shadow: 'shadow',
	explorer_ecosystems: 'explorer-main-ecosystem',
	explorer_supplementalViews: 'supplemental-explorer-views',
	explorer_landCoverView: 'land-cover-view',
	explorer_landFormView: 'landform-view',
	explorer_climateRegionView: 'climate-region-view',
	projection_containerDiv: 'projection-container',
	projectionMode_mainView: 'projection-main-view',
	export_container: 'export-container',
	agolExport_iconID: 'export-icon',
	agolExport_form: 'export-form',
	noDisplayClass: 'not-displayed',
	dropDownClass: 'select-dropdown',
	dropDownBtn: 'select-button',
	dropDownDisplayClass: 'display',
	dropDownPlaceHolderClass: 'placeholder',
};

const noDisplayClass = 'not-displayed';
const hiddenClass = 'hidden';

const mapPopOutClass = 'map-pop-out-icon';
const selectedBtnClass = 'selected-btn';

// const viewComponentIDs = [
// 	'view-map',
// 	'land-cover-view',
// 	'land-form-view',
// 	'climate-region-view',
// ];

//This isn't a good function. It does too much? I builds the 2050 projection view, but it also builds a  lot of the general achetechture for the app. view,
const buildAppHTML = (
	config,
	changeViewModeCallback,
	hashParams,
	getCredentialsCallback,
	updateProjectionModelVisibility,
) => {
	// const popOutMap = popOutMapComponent();
	// const exportBtnComponent = agolExportBtnIcon();
	// const exportForm = buildExportUI();

	const dropShadowDiv = document.createElement('div');
	dropShadowDiv.classList.add(DOM_id_class_variables['viewStyle_shadow']);

	document.querySelector('main').append(dropShadowDiv);
	// document.querySelector('main').append(exportForm);
	document.querySelector('main').append(popOutMap);
	document
		.querySelector('main')
		.append(userIconElement(getCredentialsCallback), exportBtnComponent);

	// const searchComponent = document.createElement('arcgis-search');
	// const searchContainer = document.createElement('div');
	// searchContainer.id = 'search-container';
	// searchContainer.append(searchComponent);
	// document.querySelector('main').append(searchContainer);

	createViewButtonsUI(
		config,
		changeViewModeCallback,
		hashParams,
		updateProjectionModelVisibility,
	);

	// return changeModeView;
};

const buildEcosystemProjectionView = (hashParams) => {
	const projectionModeContainer = createProjectionViewContainer(
		hashParams.mode,
	);
	const ecoSystem2050ProjectionView = createMainView(
		DOM_id_class_variables['projectionMode_mainView'],
	);
	console.log(ecoSystem2050ProjectionView);

	projectionModeContainer.append(ecoSystem2050ProjectionView);
	document.querySelector('main').append(projectionModeContainer);
	return ecoSystem2050ProjectionView;
};

const createProjectionViewContainer = (viewModeHashParams) => {
	console.log(viewModeHashParams);
	const changeModeContainer = document.createElement('div');

	changeModeContainer.id = DOM_id_class_variables['projection_containerDiv'];

	if (viewModeHashParams !== 'change') {
		changeModeContainer.classList.add(noDisplayClass);
	}

	return changeModeContainer;
};

const buildExplorerMode = ({ explorerViewComponents }) => {
	const viewContainer = buildExplorerModeHTML(explorerViewComponents);
	// explorerViewComponents.map((component) => {
	// 	viewContainer.append(component);
	// });

	return explorerViewComponents;
};

const buildExplorerModeHTML = (explorerViewComponents) => {
	const nonValidNotificationDiv = nonValidCombinationSelection();
	const nonValidMapLocationDiv = nonValidMapPixel();

	//create container divs for the entire 'Explorer Mode', the mode's main view and the mode's smaller, supplemental divs
	const explorerModeContainerDiv = document.createElement('div');
	const explorerModeMainDiv = document.createElement('div');
	const explorerModeSupplementalsDiv = document.createElement('div');

	//assign IDs to the container divs
	explorerModeContainerDiv.id = DOM_id_class_variables.explorer_containerDiv;
	explorerModeMainDiv.id = DOM_id_class_variables.explorer_mainView;
	explorerModeSupplementalsDiv.id =
		DOM_id_class_variables.explorer_supplementalViews;

	//append the views in the explorerViewComponents array to their respective divs
	explorerViewComponents.forEach((viewComponent, index) => {
		//The first element in the array should de designated to the 'main' view.
		if (viewComponent.id === DOM_id_class_variables['explorer_ecosystems']) {
			explorerModeMainDiv.append(
				viewComponent,
				nonValidNotificationDiv,
				nonValidMapLocationDiv,
			);
			return;
		}
		//all other view components go into the supplemental container
		explorerModeSupplementalsDiv.append(viewComponent);
	});
	explorerModeContainerDiv.append(explorerModeMainDiv);
	explorerModeContainerDiv.append(explorerModeSupplementalsDiv);
	document.querySelector('main').append(explorerModeContainerDiv);
	return explorerModeContainerDiv;
};

const initExplorerViewComponents = ({
	config, /////////////
	DOM_id_class_variables,
	hashParams,
	landformELUCategories,
	dropdownEvents,
	mapClickEventDelegation,
	explorerLookupTable,
	parseAndFormatURL,
	showInvalidNotificationDiv,
	createNewCrosshairGraphic,
}) => {
	const arrayOfExplorerViewComponents = [];

	const mainExplorerViewComponent = createMainView(
		DOM_id_class_variables['explorer_ecosystems'],
	);

	arrayOfExplorerViewComponents.push(mainExplorerViewComponent);

	const supplementalViewComponentsElements = landformELUCategories.map(
		(category) => {
			const supplementalExplorerViewComponent = createSupplementalViewHTMLs({
				config,
				DOM_id_class_variables,
				hashParams,
				category,
				dropdownEvents,
				mapClickEventDelegation,
				explorerLookupTable,
				parseAndFormatURL,
				showInvalidNotificationDiv,
				createNewCrosshairGraphic,
			});

			arrayOfExplorerViewComponents.push(supplementalExplorerViewComponent);
		},
	);

	return arrayOfExplorerViewComponents;
};

//this function is used to create the main view for each view's 'mode'.
const createMainView = (idString) => {
	const mainViewDiv = document.createElement('arcgis-map');

	mainViewDiv.id = idString;
	// mainViewDiv.innerHTML = `<arcgis-search slot="top-left" style:"position: absolute; top: 115px;" view="Map"></arcgis-search>`;

	return mainViewDiv;
};

// const createViewLeftUI = () => {
// 	const topLeftUI = document.createElement('div');
// 	const zoomComponent = document.createElement('arcgis-zoom');
// 	const searchContainer = document.createElement('div');
// 	const searchComponent = document.createElement('arcgis-search');

// 	searchContainer.append(searchComponent);

// 	topLeftUI.append(zoomComponent, searchContainer);

// 	return zoomComponent;
// };

const createViewButtonsUI = (
	config,
	changeViewModeCallback,
	hashParams,
	updateProjectionModelVisibility,
) => {
	console.log('the hash params for the button UI build', hashParams);
	// const containerDiv = document.createElement('div');
	const buttonsContainer = document.createElement('div');
	// const modeButtons = document.createElement('div');
	const projectionChangeModelButtons = document.createElement('div');
	// const changeTypeButtons = document.createElement('div');
	const changeTypeButtons = document.createElement('div');

	///////THIS IS INCOMPLETE. ADDING INFO ICONS TO ALL BUTTONS
	const infoIcon = `
  <calcite-link id='test-tooltip'>
    <calcite-icon icon="information" scale="s"></calcite-icon>
  </calcite-link>
  <calcite-tooltip reference-element="test-tooltip">
    <span>What a helpful tooltip for the test</span>
  </calcite-tooltip>
  `;

	const modeButtonsHTML = `
                            <button value='explore' class="viewMode btn ${hashParams.mode === 'explore' || hashParams.mode === '' ? selectedBtnClass : ''}">
                              <calcite-icon id='explore-mode-tooltip' icon="information" scale="s"></calcite-icon>
                                <calcite-tooltip reference-element="explore-mode-tooltip">
                                <span>Explore current world terrestrial ecosystems. Three smaller map views below show the landform, land cover, and climate contributing to each distinct ecosystem.</span>
                              </calcite-tooltip>
                              <span>Current Ecosystems</span>
                            </button>
                            <button value='change' class="viewMode btn ${hashParams.mode === 'change' ? selectedBtnClass : ''}">
                              <calcite-icon id='projection-mode-tooltip' icon="information" scale="s"></calcite-icon>
                                <calcite-tooltip reference-element="projection-mode-tooltip">
                                <span>Explore how ecosystems may change by 2050, based on the projections of two divergent global climate models.</span>
                              </calcite-tooltip>
                              <span>2050 Change Projections</span>
                            </button>
                            `;

	//after talking with Charlie we've been informed that the 'gas-powered' 2050 model is no longer being used.
	const projectionChangeModelButtonsHTML = `
                            <button value="sustainable" class="changeModel btn ${hashParams.model === 'sustainable' ? selectedBtnClass : ''}">
                              <calcite-icon id='sustainable-model-tooltip' icon="information" scale="s"></calcite-icon>
                                <calcite-tooltip reference-element="sustainable-model-tooltip">
                                <span>A scenario where the world shifts toward environmentally friendly practices, develops toward lower inequality. Assumes a rapid decline in greenhouse gas emissions.</span>
                              </calcite-tooltip>
                              <span>Sustainable Future</span>
                            </button>
                            <button value="current" class="changeModel btn ${hashParams.model === 'current' ? selectedBtnClass : ''}">
                              <calcite-icon id='high-emissions-tooltip' icon="information" scale="s"></calcite-icon>
                                <calcite-tooltip reference-element="high-emissions-tooltip">
                                <span>A scenario defined by slow economic growth and material-intensive consumption that will likely double the about of current CO2 by 2100.</span>
                              </calcite-tooltip>
                              <span>Current</span>
                            </button>
                            `;

	//below is an older format of this HTML. 'value' was originally a string value, the hash params used that string value. Now its a numbers string...see about changing this
	//that numbers string...it should probably come from some information in the config file. don't hard code it in.
	// <button value='drier' class='filterChangeType btn ${hashParams.changeType === 'drier' ? selectedBtnClass : ''}'> Drier </button>
	const filterChangeTypeBtnsHTML = `
                          <button value='2,4,6' class='filterChangeType btn ${hashParams.changeType === 'drier' ? selectedBtnClass : ''}'> 
                            <calcite-icon id='drier-filter-tooltip' icon="information" scale="s"></calcite-icon>
                            <calcite-tooltip reference-element="drier-filter-tooltip">
                            <span>Areas projected to increase in aridity by 2025</span>
                            </calcite-tooltip>
                            <span>Drier</span> 
                          </button>
                          <button value='1,4,5' class='filterChangeType btn ${hashParams.changeType === 'warmer' ? selectedBtnClass : ''}'> 
                            <calcite-icon id='warmer-filter-tooltip' icon="information" scale="s"></calcite-icon>
                            <calcite-tooltip reference-element="warmer-filter-tooltip">
                            <span>Areas projected to increase in temperature  by 2025</span>
                            </calcite-tooltip>
                            <span>Warmer</span>
                          </button>
                          <button value='3,5,6' class='filterChangeType btn ${hashParams.changeType === 'landCover' ? selectedBtnClass : ''}'> 
                            <calcite-icon id='landcover-filter-tooltip' icon="information" scale="s"></calcite-icon>
                            <calcite-tooltip reference-element="landcover-filter-tooltip">
                            <span>Areas where land cover type is expected to change by 2050</span>
                            </calcite-tooltip>
                            <span>Land Cover</span>
                          </button>
                          <button value='1,2,3,4,5,6' class='filterChangeType btn ${hashParams.changeType === 'any' ? selectedBtnClass : ''}'> 
                            <calcite-icon id='anyChange-filter-tooltip' icon="information" scale="s"></calcite-icon>
                            <calcite-tooltip reference-element="anyChange-filter-tooltip">
                            <span>Areas where aridity, temperature, or land cover are expected to change by 2050</span>
                            </calcite-tooltip>
                            <span>Any Change</span>
                           </button>
                          <button value='7' class='filterChangeType btn ${hashParams.changeType === 'all' ? selectedBtnClass : ''}'>
                            <calcite-icon id='allChange-filter-tooltip' icon="information" scale="s"></calcite-icon>
                            <calcite-tooltip reference-element="allChange-filter-tooltip">
                            <span>Areas where aridity, temperature, and land cover are all expected to change by 2050</span>
                            </calcite-tooltip>
                            <span>All Change</span>
                          </button>
                          `;

	buttonsContainer.innerHTML = modeButtonsHTML;
	buttonsContainer.id = 'mode-btns';

	projectionChangeModelButtons.innerHTML = projectionChangeModelButtonsHTML;
	projectionChangeModelButtons.id = 'changeModel-btns';

	changeTypeButtons.innerHTML = filterChangeTypeBtnsHTML;
	changeTypeButtons.id = 'changeType-btns';

	console.log(hashParams?.model);
	if (!hashParams.model) {
		changeTypeButtons.classList.add(hiddenClass);
	}

	if (hashParams.mode !== 'change') {
		projectionChangeModelButtons.classList.add('hidden');
		changeTypeButtons.classList.add('hidden');
	}

	document.querySelector('main').addEventListener('click', (event) => {
		event.stopImmediatePropagation;
		event.preventDefault;
		changeViewModeCallback(
			config,
			noDisplayClass,
			hiddenClass,
			selectedBtnClass,
			DOM_id_class_variables['projection_containerDiv'],
			buttonsContainer,
			projectionChangeModelButtons,
			changeTypeButtons,
			event,
			updateProjectionModelVisibility,
		);
	});

	// containerDiv.id = 'btn-container';
	// containerDiv.append(
	// 	buttonsContainer,
	// 	modeButtons,
	// 	projectionChangeModelButtons,
	// 	changeTypeButtons,
	// );
	document
		.querySelector('main')
		.append(buttonsContainer, projectionChangeModelButtons, changeTypeButtons);

	// modeButtons.addEventListener('click', (event) => {
	// 	changeDisplayStatus(noDisplayClass, changeModeContainer, event);
	// });
	// return containerDiv;
};

const createSupplementalViewHTMLs = ({
	config,
	DOM_id_class_variables,
	hashParams,
	category,
	dropdownEvents,
	mapClickEventDelegation,
	explorerLookupTable,
	parseAndFormatURL,
	showInvalidNotificationDiv,
	createNewCrosshairGraphic,
}) => {
	//
	const componentTitle = category.title;
	const dropdownFeatures = category.features;

	//the main 'arcgis-map' will not need a dropdown selector
	const dropdownElement = createDropdownComponent({
		dropdownFeatures,
	});
	//
	const bottomLabel = createComponentLabel({ componentTitle });

	const viewDiv = document.createElement('arcgis-map');
	viewDiv.id = category.title;

	viewDiv.append(dropdownElement, bottomLabel);

	viewDiv.addEventListener('click', (event) => {
		//add the popout ID as a parameter?
		dropdownEvents(
			viewDiv,
			DOM_id_class_variables,
			dropdownElement,
			event,
			config,
			hashParams,
			hiddenClass,
			mapClickEventDelegation,
			explorerLookupTable,
			parseAndFormatURL,
			showInvalidNotificationDiv,
			createNewCrosshairGraphic,
		);
	});

	return viewDiv;
};

const toggleDropdown = (dropdownContainer, expand = null) => {
	console.log(dropdownContainer);
	const list = dropdownContainer.querySelector('ul');
	const isOpen = expand !== null ? expand : list.classList.contains('hidden');
	list.classList.toggle('hidden', !isOpen);
	dropdownContainer.setAttribute('aria-expanded', isOpen);
};

const createDropdownComponent = ({ dropdownFeatures }) => {
	const dropdownSelections = dropdownFeatures
		.map((featureEntry, index) => {
			const selection = `<li class="choice" value="${featureEntry}">${featureEntry}</li>`;
			return selection;
		})
		.join('');

	const dropdownHTML = `
	<button class=${DOM_id_class_variables['dropDownBtn']}> 
    <span class="placeholder ${DOM_id_class_variables[`dropDownDisplayClass`]}">Select a choice</span>
	  <span class="selected-value"></span>
	  <span class="arrow"></span>

	</button>

	<ul class="${DOM_id_class_variables['dropDownClass']} ${hiddenClass}">
	  ${dropdownSelections}
	</ul>`;

	const dropdownContainer = document.createElement('div');
	dropdownContainer.classList.add('dropdown-select');
	dropdownContainer.innerHTML = dropdownHTML;

	return dropdownContainer;
};

const createComponentLabel = ({ componentTitle }) => {
	const infoIcon = `
  <calcite-link id='${componentTitle}-tooltip'>
    <calcite-icon icon="information" scale="s"></calcite-icon>
  </calcite-link>
  <calcite-tooltip reference-element="${componentTitle}-tooltip">
    <span>What a helpful tooltip for the ${componentTitle}</span>
  </calcite-tooltip>
  `;
	const labelString = `<span class="pop-out-title">${componentTitle}</span>`;
	const fullScreenIcon = `<calcite-icon class='${mapPopOutClass}' icon="full-screen" scale="l"> </calcite-icon>`;

	// const labelDiv = document.createElement('span');
	// labelDiv.innerHTML = labelString;

	const labelComponent = document.createElement('div');
	labelComponent.classList.add('label');

	labelComponent.innerHTML = `<div>${infoIcon} ${labelString}</div> <div>${fullScreenIcon}</div>`;
	// labelComponent.append(infoIcon, labelDiv, fullScreenIcon);

	return labelComponent;
};

const userIconElement = (getCredentialsCallback) => {
	const userAccountContainer = document.createElement('div');
	userAccountContainer.id = 'user-icon';
	const userAccountElement = `
  <div class="profile">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="1.5 -2 24 24" height="30" width="30"><path d="M19.5 15h-7A6.508 6.508 0 0 0 6 21.5V29h20v-7.5a6.508 6.508 0 0 0-6.5-6.5zM25 28H7v-6.5a5.506 5.506 0 0 1 5.5-5.5h7a5.506 5.506 0 0 1 5.5 5.5zm-9-14.2A5.8 5.8 0 1 0 10.2 8a5.806 5.806 0 0 0 5.8 5.8zm0-10.633A4.833 4.833 0 1 1 11.167 8 4.839 4.839 0 0 1 16 3.167z"></path></svg>
    </div>
  <div class="grabbedItemImage"></div>
  `;

	userAccountContainer.innerHTML = userAccountElement;

	userAccountContainer.addEventListener('click', getCredentialsCallback);

	return userAccountContainer;
};

const agolExportBtnIcon = () => {
	const agolExportContainer = document.createElement('div');
	agolExportContainer.id = 'export-icon';

	agolExportContainer.innerHTML = `<calcite-icon icon="arcgis-online" />`;

	return agolExportContainer;
};
const popOutMapComponent = () => {
	const popOutMapContainer = document.createElement('div');
	popOutMapContainer.id = 'pop-out-map-container';
	popOutMapContainer.classList.add('not-displayed');
	const popOutMapHTML = `
                          <div id="pop-out-map">
                          <div class="label"><div><calcite-icon icon="information" scale="s" aria-hidden="true" calcite-hydrated=""><template shadowrootmode="open"><!----><svg aria-hidden="true" fill="currentColor" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" class=" svg " viewBox="0 0 16 16"><!--?lit$398454607$--><!----><path d="M8.5 6.5a1 1 0 1 1 1-1 1 1 0 0 1-1 1M8 13h1V8H8zm2-1H7v1h3zm5.8-3.5a7.3 7.3 0 1 1-7.3-7.3 7.3 7.3 0 0 1 7.3 7.3m-1 0a6.3 6.3 0 1 0-6.3 6.3 6.307 6.307 0 0 0 6.3-6.3"></path><!----></svg></template></calcite-icon> <span class="pop-out-title"></span></div> <div><calcite-icon icon="x" /></div></div>
                          </div>
                        `;

	popOutMapContainer.innerHTML = popOutMapHTML;

	return popOutMapContainer;
};

const buildExportUI = (hashParams) => {
	//building HTML for the export
	//this could be generated on app load, depending on the hash params.
	const exportUIContainer = document.createElement('div');
	exportUIContainer.id = DOM_id_class_variables['export_container'];
	exportUIContainer.classList.add(`${noDisplayClass}`);
	const exportFormHTML = `
                          <div class="form-container">
                            <form id="export-form">
                              <div class='form-element'>
                                <label> ArcGIS Online Web Map Name* </label>
                                <br>
                                <textarea class='title' type='text' contenteditable='true'></textarea>
                              </div>
                              <div class='form-element'>
                                <label>Tags</label>
                                <br>
                                <textarea class='tags' type='text' contenteditable='true'></textarea>
                              </div>
                              <div class='form-element'>
                                <label>Summary</label>
                                <br>
                                <textarea class='summary' type='text' contenteditable='true'></textarea>
                              </div>
                              <div class='form-btn-container'>
                                <div class='btn'>CANCEL</div>
                                <div class='btn export'>CREATE WEB MAP</div>
                              </div>

                            </form>
                          </div>
                          `;

	exportUIContainer;
	exportUIContainer.innerHTML = exportFormHTML;
	return exportUIContainer;
	//<div class='${promptBtnsClass}'>CANCEL</div>
	// <div class='${promptBtnsClass} export'>CREATE WEB MAP</div>
};

const nonValidCombinationSelection = () => {
	console.log('NOTIFICATION');
	const mapSelectionNotificationDiv = document.createElement('div');
	mapSelectionNotificationDiv.classList.add(
		'invalidSelectionNotification',
		'combination',
	);

	const nonValidNotifictionHTML = `
                                    <div class='notification-container'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" height="48" width="48"> <path class="white-path" d="M5.828 3H29v23.172l-1-1v-4.274c-.07.026-.142.053-.207.079a2.6 2.6 0 0 1-.902.248l-1.601.007a2.37 2.37 0 0 1-1.674-.545 2.6 2.6 0 0 1-.582-.805l-.104.147c-.008.012-.023.028-.032.04l-.715-.714.034-.048a1.01 1.01 0 0 1 .815-.419l.072.003a1 1 0 0 1 .817.53 1.7 1.7 0 0 0 .355.515 1.4 1.4 0 0 0 1.014.296l1.6-.006a3 3 0 0 0 .54-.181l.218-.084a1 1 0 0 1 .352-.063V4h-4.453a.99.99 0 0 1-.524.885l-.204.107c-.624.325-1.391.725-1.478 1.066a4 4 0 0 0 .321.415 3 3 0 0 1 .32.424 1.5 1.5 0 0 1 .204.498 1 1 0 0 1-.424.998l-.107.09a5 5 0 0 1-.312.241 2 2 0 0 0-.395.341.6.6 0 0 0-.028.193 2 2 0 0 0 .049.352 1.03 1.03 0 0 1-.179.801 1 1 0 0 1-.7.41.92.92 0 0 0-.528.34.52.52 0 0 0-.162.345l.02.098c.139.676.4 1.942-.712 2.541a2.14 2.14 0 0 0-.618.832l-.1.185-.738-.738a2.67 2.67 0 0 1 .981-1.159c.346-.186.396-.542.206-1.465l-.02-.102a1.42 1.42 0 0 1 .374-1.175 1.9 1.9 0 0 1 1.2-.696l-.007-.03a3 3 0 0 1-.067-.54 1.6 1.6 0 0 1 .085-.52c.16-.478.714-.77.966-.985a3 3 0 0 1 .23-.187 1 1 0 0 0-.09-.178c-.124-.22-.777-.796-.777-1.267 0-1.022 1.128-1.543 2.226-2.12H6.829zm19.344 25H18.28a6 6 0 0 0 .33-1.434v-.606l-.384-.175a1 1 0 0 0 .007-.127c.026-.019.217-.127.343-.198a1.96 1.96 0 0 0 1.226-1.707 1.35 1.35 0 0 0-.268-.794c.04-.045.096-.101.138-.143.046-.046.1-.106.152-.164l-.714-.714c-.05.059-.09.115-.154.179-.05.051-.116.118-.165.172a1 1 0 0 0-.071 1.251.35.35 0 0 1 .082.213c0 .368-.23.562-.718.836a12 12 0 0 0-.427.25 1.02 1.02 0 0 0-.425.83 1 1 0 0 0 .378.905 8 8 0 0 1-.286 1.133 1 1 0 0 0-.018.293h-4.34a1 1 0 0 0 .02-.197 3.1 3.1 0 0 1 .237-1.095l.06-.168a3.2 3.2 0 0 0 .179-.756 1 1 0 0 0-.653-1.039 6 6 0 0 0-.612-.168c-.844-.198-.985-.404-1.005-.443-.254-.506-.112-.753.506-1.341l.18-.174a1.8 1.8 0 0 0 .705-1.241 1 1 0 0 0-1.325-.946l-.16.06a1.5 1.5 0 0 1-.61.134.577.577 0 0 1-.624-.49 1.53 1.53 0 0 1 .248-.758 1.75 1.75 0 0 0 .286-.892 2.3 2.3 0 0 0-.094-.597 2 2 0 0 1-.083-.516.94.94 0 0 1 .891-.982c.398 0 .596.227.943.845a1.23 1.23 0 0 0 1.197.625 1.39 1.39 0 0 0 1.11-.671l-.726-.726c-.107.212-.256.398-.384.398-.263 0-.295-.058-.312-.09a2.11 2.11 0 0 0-1.828-1.381 1.94 1.94 0 0 0-1.891 1.982 3 3 0 0 0 .116.775 1.3 1.3 0 0 1 .061.339.9.9 0 0 1-.161.41 2.5 2.5 0 0 0-.373 1.24 1.563 1.563 0 0 0 1.625 1.49 2.5 2.5 0 0 0 .974-.204l.12-.045v.006c0 .116-.236.35-.425.54-.48.48-1.548 1.284-.86 2.658a2.45 2.45 0 0 0 1.672.968 5 5 0 0 1 .496.135 2.3 2.3 0 0 1-.128.527l-.058.163a4 4 0 0 0-.295 1.428l-.012.063-.015.134H4V6.828l-1-1V29h23.172zm5.474 3.354-30-30 .707-.707 30 30z"></path> </svg>
                                      <span>Well look at that; you've created an ecological combination that doesn't exist!</span>
                                    </div>`;
	// const nonValidNotifictionHTML = `<div class='notification-container'><calcite-icon stroke="#efefef" icon="no-map" scale="m"></calcite-icon> <span>Well look at that; you've created an ecological combination that doesn't exist!</span></div>`;

	mapSelectionNotificationDiv.innerHTML = nonValidNotifictionHTML;
	// mainExplorerContainer.append(mapSelectionNotificationDiv);

	return mapSelectionNotificationDiv;
};

const showInvalidNotificationDiv = ({ DOM_id_class_variables }) => {
	const notificationDiv = document.querySelector('.combination');

	notificationDiv.classList.add('show');

	setTimeout(() => {
		notificationDiv.classList.remove('show');
	}, 5000);
};
const showInvalidMapLocationNotificationDiv = ({ DOM_id_class_variables }) => {
	const notificationDiv = document.querySelector('.mapLocation');

	notificationDiv.classList.add('show');

	setTimeout(() => {
		notificationDiv.classList.remove('show');
	}, 5000);
};

const nonValidMapPixel = () => {
	const mapSelectionNotificationDiv = document.createElement('div');
	mapSelectionNotificationDiv.classList.add(
		'invalidSelectionNotification',
		'mapLocation',
	);

	console.log('notifications', mapSelectionNotificationDiv.classList);
	const nonValidNotifictionHTML = `
                                    <div class='notification-container'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" height="48" width="48"> <path class="white-path" d="M5.828 3H29v23.172l-1-1v-4.274c-.07.026-.142.053-.207.079a2.6 2.6 0 0 1-.902.248l-1.601.007a2.37 2.37 0 0 1-1.674-.545 2.6 2.6 0 0 1-.582-.805l-.104.147c-.008.012-.023.028-.032.04l-.715-.714.034-.048a1.01 1.01 0 0 1 .815-.419l.072.003a1 1 0 0 1 .817.53 1.7 1.7 0 0 0 .355.515 1.4 1.4 0 0 0 1.014.296l1.6-.006a3 3 0 0 0 .54-.181l.218-.084a1 1 0 0 1 .352-.063V4h-4.453a.99.99 0 0 1-.524.885l-.204.107c-.624.325-1.391.725-1.478 1.066a4 4 0 0 0 .321.415 3 3 0 0 1 .32.424 1.5 1.5 0 0 1 .204.498 1 1 0 0 1-.424.998l-.107.09a5 5 0 0 1-.312.241 2 2 0 0 0-.395.341.6.6 0 0 0-.028.193 2 2 0 0 0 .049.352 1.03 1.03 0 0 1-.179.801 1 1 0 0 1-.7.41.92.92 0 0 0-.528.34.52.52 0 0 0-.162.345l.02.098c.139.676.4 1.942-.712 2.541a2.14 2.14 0 0 0-.618.832l-.1.185-.738-.738a2.67 2.67 0 0 1 .981-1.159c.346-.186.396-.542.206-1.465l-.02-.102a1.42 1.42 0 0 1 .374-1.175 1.9 1.9 0 0 1 1.2-.696l-.007-.03a3 3 0 0 1-.067-.54 1.6 1.6 0 0 1 .085-.52c.16-.478.714-.77.966-.985a3 3 0 0 1 .23-.187 1 1 0 0 0-.09-.178c-.124-.22-.777-.796-.777-1.267 0-1.022 1.128-1.543 2.226-2.12H6.829zm19.344 25H18.28a6 6 0 0 0 .33-1.434v-.606l-.384-.175a1 1 0 0 0 .007-.127c.026-.019.217-.127.343-.198a1.96 1.96 0 0 0 1.226-1.707 1.35 1.35 0 0 0-.268-.794c.04-.045.096-.101.138-.143.046-.046.1-.106.152-.164l-.714-.714c-.05.059-.09.115-.154.179-.05.051-.116.118-.165.172a1 1 0 0 0-.071 1.251.35.35 0 0 1 .082.213c0 .368-.23.562-.718.836a12 12 0 0 0-.427.25 1.02 1.02 0 0 0-.425.83 1 1 0 0 0 .378.905 8 8 0 0 1-.286 1.133 1 1 0 0 0-.018.293h-4.34a1 1 0 0 0 .02-.197 3.1 3.1 0 0 1 .237-1.095l.06-.168a3.2 3.2 0 0 0 .179-.756 1 1 0 0 0-.653-1.039 6 6 0 0 0-.612-.168c-.844-.198-.985-.404-1.005-.443-.254-.506-.112-.753.506-1.341l.18-.174a1.8 1.8 0 0 0 .705-1.241 1 1 0 0 0-1.325-.946l-.16.06a1.5 1.5 0 0 1-.61.134.577.577 0 0 1-.624-.49 1.53 1.53 0 0 1 .248-.758 1.75 1.75 0 0 0 .286-.892 2.3 2.3 0 0 0-.094-.597 2 2 0 0 1-.083-.516.94.94 0 0 1 .891-.982c.398 0 .596.227.943.845a1.23 1.23 0 0 0 1.197.625 1.39 1.39 0 0 0 1.11-.671l-.726-.726c-.107.212-.256.398-.384.398-.263 0-.295-.058-.312-.09a2.11 2.11 0 0 0-1.828-1.381 1.94 1.94 0 0 0-1.891 1.982 3 3 0 0 0 .116.775 1.3 1.3 0 0 1 .061.339.9.9 0 0 1-.161.41 2.5 2.5 0 0 0-.373 1.24 1.563 1.563 0 0 0 1.625 1.49 2.5 2.5 0 0 0 .974-.204l.12-.045v.006c0 .116-.236.35-.425.54-.48.48-1.548 1.284-.86 2.658a2.45 2.45 0 0 0 1.672.968 5 5 0 0 1 .496.135 2.3 2.3 0 0 1-.128.527l-.058.163a4 4 0 0 0-.295 1.428l-.012.063-.015.134H4V6.828l-1-1V29h23.172zm5.474 3.354-30-30 .707-.707 30 30z"></path> </svg>
                                      <span>This location doesn't have an associated terrestrial ecosystem unit.</span>
                                    </div>`;
	// const nonValidNotifictionHTML = `<div class='notification-container'><calcite-icon stroke="#efefef" icon="no-map" scale="m"></calcite-icon> <span>Well look at that; you've created an ecological combination that doesn't exist!</span></div>`;

	mapSelectionNotificationDiv.innerHTML = nonValidNotifictionHTML;
	// mainExplorerContainer.append(mapSelectionNotificationDiv);

	return mapSelectionNotificationDiv;
};

const popOutMap = popOutMapComponent();
const exportBtnComponent = agolExportBtnIcon();
const exportForm = buildExportUI();

export {
	buildAppHTML,
	buildExplorerMode,
	buildEcosystemProjectionView,
	initExplorerViewComponents,
	DOM_id_class_variables,
	showInvalidNotificationDiv,
	showInvalidMapLocationNotificationDiv,
};
