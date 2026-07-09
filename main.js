import { checkIn } from './check-in.js?v=0.01';
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
	// formatViewModeParametersAndUpdateHashParams,
} from './js/utils/URL_params.js?v=0.01';
import {
	ELU_FeatureStrings,
	getAttributeTable,
	mapClickEventDelegation,
	exploreMaps_SelectionProcess,
} from './js/data.js?v=0.01';
import {
	buildAppHTML,
	buildExplorerMode,
	buildEcosystemProjectionView,
	initExplorerViewComponents,
	DOM_id_class_variables,
	showInvalidNotificationDiv,
	showInvalidMapLocationNotificationDiv,
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
} from './js/utils/applicationEvents.js?v=0.01';

console.log(checkIn);
checkIn();

const initApp = async () => {
	try {
		// console.log('oAuth', oAuthResponse);
		const hashParams = parseAndFormatURL();
		const sessionToken = await get_DEV_token(config);

		const landformELUCategories = ELU_FeatureStrings;
		const explorerLookupTable = await getAttributeTable(
			config.dependencies__exploreLayer.url,
			sessionToken,
		);
		console.log(explorerLookupTable);

		//what is going on here? double check this
		//the variable for the other mapView that will display change in ecosystems
		//I don't think this is a good variable name. It doesn't just contain the 'change mode' HTML. it has everything.
		const changeView = buildAppHTML(
			config,
			changeViewMode,
			hashParams,
			getCredentials,
			updateProjectionModelVisibility,
		);
		const userPortalData = await authorization(config);
		const ecosystem2050ProjectionsViewMap =
			buildEcosystemProjectionView(hashParams);

		console.log(sessionToken);

		console.log('portal data', userPortalData);
		// getCredentials();
		//Setting up 'arcgis-map' elements for . Each of the smaller 'map' elements will contain a dropdown
		const explorerViewComponents = initExplorerViewComponents({
			config,
			DOM_id_class_variables,
			hashParams,
			landformELUCategories,
			dropdownEvents,
			mapClickEventDelegation,
			explorerLookupTable,
			parseAndFormatURL,
			showInvalidNotificationDiv,
			createNewCrosshairGraphic,
		});

		const viewElements = await buildExplorerMode({ explorerViewComponents });
		viewElements.push(ecosystem2050ProjectionsViewMap);

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
		);

		// await initExplorerViewListeners({
		// 	mapViews,
		// 	formatExtentParametersAndUpdateHashParams,
		// });

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

		if (hashParams['loc'] || !hashParams['loc']) {
			console.log('PREVSIOUS SESSION');
			const Point = await $arcgis.import('@arcgis/core/geometry/Point.js');
			const previousSessionLocation = hashParams['loc']?.split(',') || [
				-117.15, 32.73,
			];
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
			});
			// createNewCrosshairGraphic({ mapPoint, mapView });
		}
		// if (hashParams['export'] === true) {
		// 	console.log('export happening');
		// }
	} catch (error) {
		console.log(error);
	}
};

// initApp();

export { initApp };
