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
	isMobileDevice,
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
			isMobileDevice,
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
			isMobileDevice,
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

// const test = {
// 	operationalLayers: [
// 		{
// 			id: '19c2ee03009-layer-74',
// 			title: 'Group Layer',
// 			visibility: true,
// 			layers: [
// 				{
// 					id: '19c2ee0145d-layer-73',
// 					title: 'World Imagery',
// 					url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
// 					itemId: '10df2279f9684e4a9f6a7f08febac2a9',
// 					layerType: 'ArcGISTiledMapServiceLayer',
// 					layers: [
// 						{ id: 0 },
// 						{ id: 1 },
// 						{ id: 2 },
// 						{ id: 3 },
// 						{ id: 4 },
// 						{ id: 5 },
// 						{ id: 6 },
// 						{ id: 7 },
// 						{ id: 8 },
// 						{ id: 9 },
// 						{ id: 10 },
// 						{ id: 11 },
// 						{ id: 12 },
// 						{ id: 13 },
// 						{ id: 14 },
// 						{ id: 15 },
// 						{ id: 16 },
// 						{ id: 17 },
// 						{ id: 18, disablePopup: true },
// 					],
// 					effect: [
// 						{ type: 'saturate', amount: 2 },
// 						{ type: 'brightness', amount: 1.3 },
// 						{ type: 'contrast', amount: 0.8 },
// 					],
// 				},
// 				{
// 					id: '19c2ee381a9-layer-136',
// 					title: 'Outdoor Labels',
// 					visibility: true,
// 					itemId: '65605d0db3bd4067ad4805a81a4689b8',
// 					layerType: 'VectorTileLayer',
// 					effect: [
// 						{ type: 'invert', amount: 1 },
// 						{ type: 'hue-rotate', angle: 180 },
// 						{
// 							type: 'drop-shadow',
// 							xoffset: 0,
// 							yoffset: 0,
// 							blurRadius: 2.25,
// 							color: [59, 32, 0, 255],
// 						},
// 					],
// 					styleUrl:
// 						'https://www.arcgis.com/sharing/rest/content/items/65605d0db3bd4067ad4805a81a4689b8/resources/styles/root.json',
// 				},
// 				{
// 					id: '19c2eda9ea6-layer-72',
// 					title: 'NLW v3 Landforms',
// 					url: 'https://services1.arcgis.com/pf6KDbd8NVL1IUHa/arcgis/rest/services/Named_Landforms_of_the_World_v3_(All_Layers)/FeatureServer/0',
// 					visibility: true,
// 					itemId: '882f24d8ea3244eaab0bc0050937374a',
// 					layerType: 'ArcGISFeatureLayer',
// 					layerDefinition: {
// 						minScale: 0,
// 						maxScale: 0,
// 						definitionExpression: "MurphyCode = 'SMh'",
// 						fieldConfigurations: [
// 							{
// 								name: 'AREA_GEO',
// 								fieldFormat: {
// 									type: 'number',
// 									minimumFractionDigits: 2,
// 									useGrouping: 'always',
// 								},
// 							},
// 							{
// 								name: 'MoistDry',
// 								fieldFormat: { type: 'number', useGrouping: 'always' },
// 							},
// 							{
// 								name: 'process',
// 								fieldFormat: { type: 'number', useGrouping: 'always' },
// 							},
// 							{
// 								name: 'Shape__Area',
// 								fieldFormat: {
// 									type: 'number',
// 									minimumFractionDigits: 2,
// 									useGrouping: 'always',
// 								},
// 							},
// 							{
// 								name: 'Shape__Length',
// 								fieldFormat: {
// 									type: 'number',
// 									minimumFractionDigits: 2,
// 									useGrouping: 'always',
// 								},
// 							},
// 							{
// 								name: 'Structure',
// 								fieldFormat: { type: 'number', useGrouping: 'always' },
// 							},
// 							{
// 								name: 'Topog',
// 								fieldFormat: { type: 'number', useGrouping: 'always' },
// 							},
// 							{
// 								name: 'SI_Vol_Num',
// 								fieldFormat: { type: 'number', useGrouping: 'always' },
// 							},
// 						],
// 						drawingInfo: {
// 							labelingInfo: [
// 								{
// 									labelExpression: '[MurphyCode]',
// 									labelExpressionInfo: { expression: '$feature["MurphyCode"]' },
// 									labelPlacement: 'esriServerPolygonPlacementAlwaysHorizontal',
// 									maxScale: 356.599053,
// 									minScale: 4645144.704101,
// 									repeatLabel: true,
// 									symbol: {
// 										type: 'esriTS',
// 										color: [255, 255, 255, 255],
// 										font: {
// 											family: 'Avenir Next LT Pro',
// 											size: 7.5,
// 											weight: 'bold',
// 										},
// 										horizontalAlignment: 'center',
// 										kerning: true,
// 										haloColor: [0, 0, 0, 64],
// 										haloSize: 3,
// 										rotated: false,
// 										text: '',
// 										verticalAlignment: 'baseline',
// 										xoffset: 0,
// 										yoffset: 0,
// 										angle: 0,
// 									},
// 								},
// 							],
// 							renderer: {
// 								type: 'simple',
// 								symbol: {
// 									type: 'esriSFS',
// 									color: [25, 96, 158, 255],
// 									outline: {
// 										type: 'esriSLS',
// 										color: [25, 96, 158, 255],
// 										width: 0.75,
// 										style: 'esriSLSSolid',
// 									},
// 									style: 'esriSFSSolid',
// 								},
// 							},
// 						},
// 					},
// 					blendMode: 'destination-in',
// 					effect: null,
// 					featureEffect: null,
// 					attributeTableInfo: {
// 						attributeTableElements: [
// 							{ type: 'field', fieldName: 'BridNam' },
// 							{ type: 'field', fieldName: 'Division' },
// 							{ type: 'field', fieldName: 'Province' },
// 							{ type: 'field', fieldName: 'Section' },
// 							{ type: 'field', fieldName: 'Structure' },
// 							{ type: 'field', fieldName: 'MoistDry' },
// 							{ type: 'field', fieldName: 'Topog' },
// 							{ type: 'field', fieldName: 'Glaciate' },
// 							{ type: 'field', fieldName: 'Continent' },
// 							{ type: 'field', fieldName: 'NameStr' },
// 							{ type: 'field', fieldName: 'MurphyCode' },
// 							{ type: 'field', fieldName: 'AREA_GEO' },
// 							{ type: 'field', fieldName: 'Plate_1' },
// 							{ type: 'field', fieldName: 'Plate_2' },
// 							{ type: 'field', fieldName: 'Plate_3' },
// 							{ type: 'field', fieldName: 'Plate_4' },
// 							{ type: 'field', fieldName: 'Plate_5' },
// 							{ type: 'field', fieldName: 'notes' },
// 							{ type: 'field', fieldName: 'process' },
// 							{ type: 'field', fieldName: 'Volcanism' },
// 							{ type: 'field', fieldName: 'VolcName' },
// 							{ type: 'field', fieldName: 'SI_Vol_Num' },
// 							{ type: 'field', fieldName: 'Vol_Reg' },
// 							{ type: 'field', fieldName: 'Vol_Prov' },
// 							{ type: 'field', fieldName: 'Shape__Area' },
// 							{ type: 'field', fieldName: 'Shape__Length' },
// 							{ type: 'attachment', displayType: 'auto' },
// 						],
// 						orderByFields: [],
// 					},
// 					showLabels: false,
// 					popupInfo: {
// 						popupElements: [
// 							{
// 								type: 'text',
// 								text: "<p style='text-align:center;'><span style='font-size:18pt;'><span>{expression/expr2}</span><strong> </strong><span><strong>{expression/expr3}</strong></span><strong> </strong>{expression/expr0} <span><strong>{expression/expr1}</strong></span><strong> &nbsp;</strong>Division: <span><strong>{Division}</strong></span></span><span style='color:#7d6508; font-size:18px;'><span>{expression/expr4}</span></span><span style='color:#7d6508; font-size:18pt;'> </span><span style='color:#7d6508; font-size:18px;'><span>{expression/expr5}&nbsp;</span></span></p><p style='text-align:center;'><span style='color:#7d6508; font-size:18px;'><span>{expression/expr7}</span>&nbsp;</span></p>",
// 							},
// 						],
// 						description:
// 							"<p style='text-align:center;'><span style='font-size:18pt;'><span>{expression/expr2}</span><strong> </strong><span><strong>{expression/expr3}</strong></span><strong> </strong>{expression/expr0} <span><strong>{expression/expr1}</strong></span><strong> &nbsp;</strong>Division: <span><strong>{Division}</strong></span></span><span style='color:#7d6508; font-size:18px;'><span>{expression/expr4}</span></span><span style='color:#7d6508; font-size:18pt;'> </span><span style='color:#7d6508; font-size:18px;'><span>{expression/expr5}&nbsp;</span></span></p><p style='text-align:center;'><span style='color:#7d6508; font-size:18px;'><span>{expression/expr7}</span>&nbsp;</span></p>",
// 						expressionInfos: [
// 							{
// 								name: 'expr0',
// 								title: 'BR_ProvHead',
// 								expression:
// 									'var p = IIf(IsEmpty($feature.Province), \'\', "Province: ")\r\nreturn p',
// 								returnType: 'string',
// 							},
// 							{
// 								name: 'expr1',
// 								title: 'Br_ProveHead',
// 								expression:
// 									"var p = IIf(IsEmpty($feature.Province), '', $feature.Province+TextFormatting.NewLine)\r\nreturn p",
// 								returnType: 'string',
// 							},
// 							{
// 								name: 'expr2',
// 								title: 'SectHead',
// 								expression:
// 									'var p = IIf(IsEmpty($feature.Section), \'\', "Section: ")\r\nreturn p',
// 								returnType: 'string',
// 							},
// 							{
// 								name: 'expr3',
// 								title: 'SectName',
// 								expression:
// 									"var p = IIf(IsEmpty($feature.Section), '', $feature.Section+TextFormatting.NewLine)\r\nreturn p",
// 								returnType: 'string',
// 							},
// 							{
// 								name: 'expr4',
// 								title: 'TPHead',
// 								expression:
// 									'var p = IIf(DomainName($feature,"process") == "None", \'\', TextFormatting.NewLine+"Tectonic Process: ")\r\nreturn p',
// 								returnType: 'string',
// 							},
// 							{
// 								name: 'expr5',
// 								title: 'TPName',
// 								expression:
// 									'var p = IIf(DomainName($feature,"process") == "None", \'\', DomainName($feature,"process"))\r\nreturn p',
// 								returnType: 'string',
// 							},
// 							{
// 								name: 'expr6',
// 								title: 'TP_List',
// 								expression:
// 									'var p1 = $feature["Plate_1"]\r\nvar p2 = IIf(IsEmpty($feature["Plate_2"]), \'\', $feature["Plate_2"] )\r\nvar p3 = IIf(IsEmpty($feature["Plate_3"]), \'\', $feature["Plate_3"] )\r\nvar n = ""\r\nvar x = ""\r\n\r\nif (p2 != n) {\r\n    if (p3 == n) {\r\n        x = p1 + \' and \' + p2 + " Tectonic Plates"\r\n    }\r\n    if (p3!=\'\') {\r\n        x = p1 + \', \' + p2 + ", and " + p3 + " Tectonic Plates"\r\n    }\r\n}\r\nif (p2 == \'\') {\r\n    if (p3 == \'\') {\r\n        x =  p1 +" Tectonic Plate"\r\n    }\r\n}\r\nreturn x',
// 								returnType: 'string',
// 							},
// 							{
// 								name: 'expr7',
// 								title: 'MurphyDesc',
// 								expression:
// 									'var t = DomainName($feature,"Topog")\r\nvar s = DomainName($feature,"Structure")\r\nvar g = $feature.Glaciate\r\nvar m = DomainName($feature,"MoistDry")\r\nvar a = $feature["AREA_GEO"]\r\nvar tp = DomainName($feature,"process")\r\nvar x = ""\r\nif (t == "Mountains") {\r\n    if (a > 3000) {\r\n        x = x + "A mountainous area"\r\n    }\r\n    if (a <= 3000) {\r\n        x = x + "An area of mountains"\r\n    }\r\n}\r\nif (t == \'Plains\') {\r\n    if (a >= 100000) {\r\n        x = x + "A vast plain"\r\n    }\r\n    if (a < 100000) {\r\n        x = x + "Plains"\r\n    }\r\n}\r\nif (t == \'Depressions or Basins\') {\r\n    if (a >= 50000) {\r\n        x = x + "A vast basin"\r\n    }\r\n    if (a < 50000) {\r\n        x = x + "A depression"\r\n    }\r\n}\r\nif (t == "Hills") {\r\n    x = x + "An area of hills"\r\n}\r\nif (t == "High Tablelands") {\r\n    x = x + "An area of high tablelands"\r\n}\r\nif (g == \'Wisconsin Wurm\'){\r\n    x = x + " subjected to the most recent period of glaciation"\r\n}\r\nif (g == \'Pre-Wisconsin Wurm\'){\r\n    x = x + " subjected to older glaciation"\r\n}\r\nif (m == \'Moist\') {\r\n    x = x + " in a moist climate"\r\n}\r\nif (m == \'Dry\') {\r\n    x = x + " in an arid climate"\r\n}\r\nif (s == \'Sedimentary Covers\') {\r\n    x = x + " underlaid by recent sedimentary deposits."\r\n}\r\nif (s == \'Laurasian Shield\') {\r\n    x = x + " underlaid by very old Laurasian Shield rock."\r\n}\r\nif (s == \'Gondwana Shield\') {\r\n    x = x + " underlaid by very old Gondwana Shield rock."\r\n}\r\nvar tx = \'.\'\r\nif (tp == \'Orogenic\'){\r\n    tx = \' formed by orogenic processes.\'\r\n}\r\nif (tp == \'Above subducting plate\'){\r\n    tx = \' formed by subduction processes.\'\r\n}\r\nif (tp == \'Rift zone\'){\r\n    tx = \' formed by rifting process.\'\r\n}\r\n\r\nif (s == \'Alpine Fold Systems\') {\r\n    x = x + " within newer ranges" + tx\r\n}\r\nif (s == \'Caledonian, Hercynian, or Appalachian Remnants\') {\r\n    x = x + " within older ranges" + tx\r\n}\r\nif (s == \'Rifted Area\') {\r\n    x = x + " in rift zones."\r\n}\r\nif (s == \'Isolated Volcanics\') {\r\n    x = x + " within a region of volcanic activity that is isolated or at the margins of shield structures."\r\n}\r\nreturn x',
// 								returnType: 'string',
// 							},
// 						],
// 						fieldInfos: [
// 							{
// 								fieldName: 'OBJECTID',
// 								isEditable: false,
// 								label: 'OBJECTID',
// 								visible: false,
// 							},
// 							{
// 								fieldName: 'AREA_GEO',
// 								format: { digitSeparator: true, places: 2 },
// 								isEditable: true,
// 								label: 'Area (km2)',
// 								visible: true,
// 							},
// 							{
// 								fieldName: 'Division',
// 								isEditable: true,
// 								label: 'Bridges Division',
// 								visible: true,
// 							},
// 							{
// 								fieldName: 'BridNam',
// 								isEditable: true,
// 								label: 'Bridges Full Name',
// 								visible: true,
// 							},
// 							{
// 								fieldName: 'Province',
// 								isEditable: true,
// 								label: 'Bridges Province',
// 								visible: true,
// 							},
// 							{
// 								fieldName: 'Section',
// 								isEditable: true,
// 								label: 'Bridges Section',
// 								visible: true,
// 							},
// 							{
// 								fieldName: 'NameStr',
// 								isEditable: true,
// 								label: 'Bridges Short Name',
// 								visible: true,
// 							},
// 							{
// 								fieldName: 'Continent',
// 								isEditable: true,
// 								label: 'Continent Name',
// 								visible: true,
// 							},
// 							{
// 								fieldName: 'Glaciate',
// 								isEditable: true,
// 								label: 'Glaciation Type',
// 								visible: true,
// 							},
// 							{
// 								fieldName: 'MoistDry',
// 								format: { digitSeparator: true, places: 0 },
// 								isEditable: true,
// 								label: 'Moist or Dry',
// 								visible: true,
// 							},
// 							{
// 								fieldName: 'MurphyCode',
// 								isEditable: true,
// 								label: 'Murphy Landform Code',
// 								visible: true,
// 							},
// 							{
// 								fieldName: 'notes',
// 								isEditable: true,
// 								label: 'All Notes',
// 								visible: true,
// 							},
// 							{
// 								fieldName: 'Plate_1',
// 								isEditable: true,
// 								label: 'Topmost Tectonic Plate',
// 								visible: true,
// 							},
// 							{
// 								fieldName: 'Plate_2',
// 								isEditable: true,
// 								label: 'Second Tectonic Plate',
// 								visible: true,
// 							},
// 							{
// 								fieldName: 'Plate_3',
// 								isEditable: true,
// 								label: 'Third Tectonic Plate',
// 								visible: true,
// 							},
// 							{
// 								fieldName: 'Plate_4',
// 								isEditable: true,
// 								label: 'Fourth Tectonic Plate',
// 								visible: true,
// 							},
// 							{
// 								fieldName: 'Plate_5',
// 								isEditable: true,
// 								label: 'Fifth Tectonic Plate',
// 								visible: true,
// 							},
// 							{
// 								fieldName: 'process',
// 								format: { digitSeparator: true, places: 0 },
// 								isEditable: true,
// 								label: 'Tectonic Process',
// 								visible: true,
// 							},
// 							{
// 								fieldName: 'Shape__Area',
// 								format: { digitSeparator: true, places: 2 },
// 								isEditable: false,
// 								label: 'Shape__Area',
// 								visible: true,
// 							},
// 							{
// 								fieldName: 'Shape__Length',
// 								format: { digitSeparator: true, places: 2 },
// 								isEditable: false,
// 								label: 'Shape__Length',
// 								visible: true,
// 							},
// 							{
// 								fieldName: 'Structure',
// 								format: { digitSeparator: true, places: 0 },
// 								isEditable: true,
// 								label: 'Geologic Structure',
// 								visible: true,
// 							},
// 							{
// 								fieldName: 'Topog',
// 								format: { digitSeparator: true, places: 0 },
// 								isEditable: true,
// 								label: 'Topographic',
// 								visible: true,
// 							},
// 							{
// 								fieldName: 'Vol_Prov',
// 								isEditable: true,
// 								label: 'Volcanic Province (SI)',
// 								visible: true,
// 							},
// 							{
// 								fieldName: 'Vol_Reg',
// 								isEditable: true,
// 								label: 'Volcanic Region (SI)',
// 								visible: true,
// 							},
// 							{
// 								fieldName: 'Volcanism',
// 								isEditable: true,
// 								label: 'Description of Volcanism',
// 								visible: true,
// 							},
// 							{
// 								fieldName: 'SI_Vol_Num',
// 								format: { digitSeparator: true, places: 0 },
// 								isEditable: true,
// 								label: 'Volcano ID (SI)',
// 								visible: true,
// 							},
// 							{
// 								fieldName: 'VolcName',
// 								isEditable: true,
// 								label: 'Volcano Name (SI)',
// 								visible: true,
// 							},
// 							{
// 								fieldName: 'expression/expr0',
// 								isEditable: true,
// 								visible: false,
// 							},
// 							{
// 								fieldName: 'expression/expr1',
// 								isEditable: true,
// 								visible: false,
// 							},
// 							{
// 								fieldName: 'expression/expr2',
// 								isEditable: true,
// 								visible: false,
// 							},
// 							{
// 								fieldName: 'expression/expr3',
// 								isEditable: true,
// 								visible: false,
// 							},
// 							{
// 								fieldName: 'expression/expr4',
// 								isEditable: true,
// 								visible: false,
// 							},
// 							{
// 								fieldName: 'expression/expr5',
// 								isEditable: true,
// 								visible: false,
// 							},
// 							{
// 								fieldName: 'expression/expr6',
// 								isEditable: true,
// 								visible: false,
// 							},
// 							{
// 								fieldName: 'expression/expr7',
// 								isEditable: true,
// 								visible: false,
// 							},
// 						],
// 						title: 'NLW v3 Landforms: {NameStr}',
// 					},
// 				},
// 			],
// 			layerType: 'GroupLayer',
// 			effect: [
// 				{
// 					type: 'drop-shadow',
// 					xoffset: 0.75,
// 					yoffset: 0.75,
// 					blurRadius: 6,
// 					color: [0, 0, 0, 255],
// 				},
// 			],
// 			visibilityMode: 'independent',
// 		},
// 	],
// 	baseMap: {
// 		baseMapLayers: [
// 			{
// 				id: '19f1360f2af-layer-67',
// 				opacity: 1,
// 				title: 'World Hillshade (Dark)',
// 				url: 'https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade_Dark/MapServer',
// 				visibility: true,
// 				itemId: '428539ef9cab4017b69d15a40a9ee98b',
// 				layerType: 'ArcGISTiledMapServiceLayer',
// 				effect: [
// 					{ type: 'brightness', amount: 0.5 },
// 					{ type: 'contrast', amount: 1 },
// 				],
// 			},
// 			{
// 				id: '19f136a4e4d-layer-192',
// 				opacity: 0.75,
// 				title: 'Human Geography Dark Detail',
// 				visibility: true,
// 				itemId: '1ddbb25aa29c4811aaadd94de469856a',
// 				layerType: 'VectorTileLayer',
// 				blendMode: 'multiply',
// 				styleUrl:
// 					'https://www.arcgis.com/sharing/rest/content/items/1ddbb25aa29c4811aaadd94de469856a/resources/styles/root.json',
// 			},
// 			{
// 				id: '19f13680b88-layer-130',
// 				opacity: 0.4,
// 				title: 'Outdoor Labels',
// 				visibility: true,
// 				itemId: '65605d0db3bd4067ad4805a81a4689b8',
// 				layerType: 'VectorTileLayer',
// 				effect: [
// 					{ type: 'hue-rotate', angle: 180 },
// 					{ type: 'invert', amount: 1 },
// 				],
// 				styleUrl:
// 					'https://www.arcgis.com/sharing/rest/content/items/65605d0db3bd4067ad4805a81a4689b8/resources/styles/root.json',
// 			},
// 		],
// 		title: 'Dark Hillshade',
// 	},
// 	authoringApp: 'ArcGISMapViewer',
// 	authoringAppVersion: '2026.2',
// 	background: { color: [0, 0, 0, 255] },
// 	initialState: {
// 		viewpoint: {
// 			targetGeometry: {
// 				spatialReference: { latestWkid: 3857, wkid: 102100 },
// 				xmin: 400900.71142339427,
// 				ymin: 4589288.452104007,
// 				xmax: 2206037.571405637,
// 				ymax: 7558714.126925745,
// 			},
// 		},
// 	},
// 	spatialReference: { latestWkid: 3857, wkid: 102100 },
// 	timeZone: 'system',
// 	version: '2.37',
// };

export { initApp };
