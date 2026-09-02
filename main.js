import {
	setHTMLLang,
	getLanguageParam,
	getString,
	getStringsJSON,
} from './defaultLanguage.js?v=0.01';
import { config } from './config.js?v=0.01';
import {
	authorization,
	getCredentials,
	get_DEV_token,
} from './js/utils/Oauth.js?v=0.01';
import {
	parseAndFormatURL,
	formatExtentParametersAndUpdateHashParams,
	updateHashParamString,
} from './js/utils/URL_params.js?v=0.01';
import {
	ELU_FeatureStrings,
	getAttributeTable,
	mapClickEventDelegation,
	exploreMaps_SelectionProcess,
	projectionStatistics,
} from './js/data.js?v=0.01';
import {
	buildAppHTML,
	buildExplorerMode,
	buildEcosystemProjectionView,
	initExplorerViewComponents,
	DOM_id_class_variables,
	showInvalidNotificationDiv,
	showInvalidMapLocationNotificationDiv,
	createUserIconElement,
} from './js/components.js?v=0.01';
import {
	updateProjectionModelVisibility,
	createNewCrosshairGraphic,
} from './js/layers.js?v=0.01';
import {
	initExplorerMapViews,
	initExplorerViewListeners,
	viewClickEvent,
} from './js/view.js?v=0.01';
import { addExportFormToMap } from './js/utils/exportMap.js?v=0.01';
import {
	setViewMode,
	changeViewMode,
	dropdownEvents,
	initAppTopLevelEventListener,
	toggle_AGOL_Export,
	manageMobileVersion,
} from './js/utils/applicationEvents.js?v=0.01';

const initApp = async () => {
	try {
		const preferredLanguage = getLanguageParam();

		setHTMLLang(preferredLanguage);
		console.log(preferredLanguage);
		await getStringsJSON(preferredLanguage, config.defaultLanguage);

		const currentWidth = window.innerWidth;

		const logInElement = createUserIconElement(getCredentials);

		const userPortalData = await authorization(config);
		const sessionToken = await get_DEV_token(config);
		const hashParams = parseAndFormatURL();
		console.log('from main', hashParams);

		console.log('the features', ELU_FeatureStrings);
		const wte_categories = ELU_FeatureStrings;
		const explorerLookupTable = await getAttributeTable(
			config.dependencies__exploreLayer.url,
			sessionToken,
		);

		//what is going on here? double check this
		//the variable for the other mapView that will display change in ecosystems
		//I don't think this is a good variable name. It doesn't just contain the 'change mode' HTML. it has everything.
		const appHTML = buildAppHTML(
			config,
			changeViewMode,
			hashParams,
			getCredentials,
			updateProjectionModelVisibility,
			projectionStatistics,
			getString,
		);
		const ecosystem2050ProjectionsViewMap =
			await buildEcosystemProjectionView(hashParams);

		// getCredentials();
		//Setting up 'arcgis-map' elements for . Each of the smaller 'map' elements will contain a dropdown
		const explorerViewComponents = initExplorerViewComponents({
			config,
			DOM_id_class_variables,
			hashParams,
			wte_categories,
			dropdownEvents,
			mapClickEventDelegation,
			explorerLookupTable,
			parseAndFormatURL,
			showInvalidNotificationDiv,
			createNewCrosshairGraphic,
			getString,
		});
		console.log(explorerViewComponents);

		const viewElements = await buildExplorerMode({
			explorerViewComponents,
			wte_categories,
			hashParams,
		});

		viewElements.push(ecosystem2050ProjectionsViewMap);
		console.log(viewElements);

		const mapViews = await initExplorerMapViews({
			viewElements,
			config,
			hashParams,
			formatExtentParametersAndUpdateHashParams,
			sessionToken,
			viewClickEvent,
			DOM_id_class_variables,
		});

		const mapViews_clickEvent = viewClickEvent(
			config,
			sessionToken,
			mapViews,
			mapClickEventDelegation,
			DOM_id_class_variables,
			explorerLookupTable,
			showInvalidMapLocationNotificationDiv,
			updateHashParamString,
			getString,
		);

		initAppTopLevelEventListener(
			config,
			DOM_id_class_variables,
			hashParams,
			mapViews,
			getCredentials,
			addExportFormToMap,
			parseAndFormatURL,
			userPortalData,
		);

		manageMobileVersion(currentWidth, DOM_id_class_variables);

		if (hashParams['mode'] !== 'change') {
			// if (hashParams['mode'] !== 'change' && hashParams['loc']) {
			console.log('PREVSIOUS SESSION');
			const Point = await $arcgis.import('@arcgis/core/geometry/Point.js');

			//intended to use the 'loc' params from the previous session, but if there is not one, will default to the preselected location in the config file.
			const previousSessionLocation =
				hashParams['loc']?.split(',') || config.view.locCenter;
			//the main explorer mode view
			const mapViewElement = viewElements[0];

			const previousMapPoint = new Point({
				latitude: previousSessionLocation[1],
				longitude: previousSessionLocation[0],
			});

			exploreMaps_SelectionProcess({
				config,
				sessionToken,
				DOM_id_class_variables,
				explorerLookupTable,
				showInvalidNotificationDiv,
				createNewCrosshairGraphic,
				previousMapPoint,
				mapViewElement,
				getString,
			});
		}

		if (hashParams['mode'] === 'change' && hashParams['changeType']) {
			console.log('updating change filter');

			const statisticsElement = ecosystem2050ProjectionsViewMap.querySelector(
				`#${DOM_id_class_variables['projection_statistics']}`,
			);

			const projectionModelString = hashParams['model'];
			const changeTypeString = hashParams['changeType'];
			const projectionViewElement = ecosystem2050ProjectionsViewMap;

			updateProjectionModelVisibility(
				config,
				ecosystem2050ProjectionsViewMap,
				projectionModelString,
				changeTypeString,
			);

			console.log('main event');
			projectionStatistics(
				projectionModelString,
				changeTypeString,
				statisticsElement,
				getString,
			);
		}

		if (hashParams['mode'] === 'change') {
			const Point = await $arcgis.import('@arcgis/core/geometry/Point.js');

			const previousSessionLocation = config.view.locCenter;

			//the main explorer mode view
			const mapViewElement = viewElements[0];

			const previousMapPoint = new Point({
				latitude: previousSessionLocation[1],
				longitude: previousSessionLocation[0],
			});

			console.log('sending for map selection');
			exploreMaps_SelectionProcess({
				config,
				sessionToken,
				DOM_id_class_variables,
				explorerLookupTable,
				showInvalidNotificationDiv,
				createNewCrosshairGraphic,
				previousMapPoint,
				mapViewElement,
				getString,
			});
		}
		if (hashParams['export']) {
			addExportFormToMap(
				config,
				DOM_id_class_variables,
				hashParams,
				mapViews,
				parseAndFormatURL,
				userPortalData,
			);
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
};

initApp();

export { initApp };
