import {
	createApplicationLayers,
	createCrossHairGraphicLayer,
	createNewCrosshairGraphic,
} from './layers.js?v=0.01';

const initPopOutView = async (event, config, hashParams, parseAndFormatURL) => {
	try {
		const viewComponent = document.createElement('arcgis-map');
		viewComponent.componentOnReady();

		const targetView = event.target.closest('arcgis-map');

		const basemapBaseLayers = await createApplicationLayers(
			config.basemapLayers,
		);

		const mapLocation = parseAndFormatURL();

		const previousSessionExt = mapLocation.ext[0]
			? mapLocation?.ext.split(',')
			: null;

		const [View, Map, Basemap, Layer, RasterFunctionUtils] =
			await $arcgis.import([
				'@arcgis/core/views/View.js',
				'@arcgis/core/Map.js',
				'@arcgis/core/Basemap.js',
				'@arcgis/core/layers/Layer.js',
				'@arcgis/core/layers/support/rasterFunctionUtils.js',
			]);

		const targetRasterFunction =
			targetView.map.layers.items[0].layers.items.find((layer) => {
				if (layer.title === config.dependencies__exploreLayer.title) {
					return layer.rasterFunction;
				}
			});
		const operationalLayers = await createApplicationLayers(
			config.operationalLayers,
		);

		viewComponent.view.attributionVisible = true;
		viewComponent.view.popup = null;
		viewComponent.view.center = previousSessionExt || config.view.extCenter;
		viewComponent.view.zoom = mapLocation?.zoom || config.view.zoom;
		viewComponent.view.constraints = {
			snapToZoom: config.view.constraints__zoomSnap,
			minZoom: config.view.constraints__minZoom,
		};
		viewComponent.view.ui = {};

		//GOING TO NEED TO MAKE A FUNCTION THAT WILL PROCESS AN ARRAY OF BASEMAPS THAT WILL THEN BE INSERTED INTO THE MAP CONSTRUCTOR
		const outdoorBasemap = new Basemap({
			baseLayers: basemapBaseLayers,
			// referenceLayers: basemapReferenceLayers,
		});

		viewComponent.map = new Map({
			basemap: outdoorBasemap,
		});

		//THERE HAS TO BE A BETTER WAY TO DO THIS STATEMENT.

		viewComponent.map.layers.add(operationalLayers[0]);

		const targetLayer = viewComponent.map.layers.items[0].layers.items.find(
			(layer) => {
				if (layer.title === config.dependencies__exploreLayer.title) {
					layer.renderer = null;
					layer.rasterFunction = targetRasterFunction.rasterFunction;
					return layer;
				}
			},
		);

		return viewComponent;
	} catch (error) {
		console.log('error during pop-out map creation', error);
	}
};

//not an accurate name at all. This also inits the projection mode.
const initExplorerMapViews = async ({
	viewElements,
	config,
	hashParams,
	formatExtentParametersAndUpdateHashParams,
	sessionToken,
	DOM_id_class_variables,
}) => {
	const basemapBaseLayers = await createApplicationLayers(config.basemapLayers);

	const [View, Map, Basemap, Layer] = await $arcgis.import([
		'@arcgis/core/views/View.js',
		'@arcgis/core/Map.js',
		'@arcgis/core/Basemap.js',
		'@arcgis/core/layers/Layer.js',
	]);

	const previousSessionExt = hashParams?.ext[0]
		? hashParams?.ext.split(',')
		: null;

	const mapViewsArray = viewElements.map(
		//NOT A GOOD FUNCTION NAME

		async (viewComponentElement, index) => {
			viewComponentElement.componentOnReady();

			const operationalLayers = await createApplicationLayers(
				config.operationalLayers,
			);

			//Is this section too crowded? It seems hard to read.
			viewComponentElement.view.attributionVisible = false;
			viewComponentElement.view.popup = null;
			viewComponentElement.view.center =
				previousSessionExt || config.view.extCenter;
			viewComponentElement.view.zoom = hashParams?.zoom || config.view.zoom;
			viewComponentElement.view.constraints = {
				snapToZoom: config.view.constraints__zoomSnap,
				minZoom: config.view.constraints__minZoom,
			};

			//GOING TO NEED TO MAKE A FUNCTION THAT WILL PROCESS AN ARRAY OF BASEMAPS THAT WILL THEN BE INSERTED INTO THE MAP CONSTRUCTOR
			const outdoorBasemap = new Basemap({
				baseLayers: basemapBaseLayers,
			});

			viewComponentElement.map = new Map({
				basemap: outdoorBasemap,
			});

			viewComponentElement.map.layers.addMany(operationalLayers);

			if (
				viewComponentElement.id ===
				DOM_id_class_variables['explorer_ecosystems']
			) {
				const crosshairGraphicLayer = await createCrossHairGraphicLayer();

				addSearchComponent({ viewComponentElement, DOM_id_class_variables });

				viewComponentElement.map.layers.add(crosshairGraphicLayer);
			}

			if (
				viewComponentElement.id ===
				DOM_id_class_variables['projectionMode_mainView']
			) {
				const projectionLayers = await createApplicationLayers(
					config.ecoProjectionLayers__operationalLayers,
				);

				addSearchComponent({ viewComponentElement, DOM_id_class_variables });
				viewComponentElement.map.layers.items[0].addMany(projectionLayers);

				const loadPromises =
					viewComponentElement.map.layers.items[0].layers.map(async (layer) => {
						await layer.when();
					});

				await Promise.all(loadPromises);
			}

			return viewComponentElement;
		},
	);

	const mapViews = await Promise.all(mapViewsArray);

	await initExplorerViewListeners({
		mapViews,
		formatExtentParametersAndUpdateHashParams,
		DOM_id_class_variables,
	});

	return mapViews;
};

const addSearchComponent = ({
	viewComponentElement,
	DOM_id_class_variables,
}) => {
	const expandComponent = document.createElement('arcgis-expand');
	expandComponent.collapseIcon = 'search';

	const searchComponent = document.createElement('arcgis-search');
	searchComponent.resultGraphicDisabled = true;
	searchComponent.locationDisabled = true;

	expandComponent.append(searchComponent);

	const componentContainer = document.createElement('div');
	componentContainer.classList.add(
		`${DOM_id_class_variables['component_container']}`,
	);
	componentContainer.append(expandComponent);

	viewComponentElement.append(componentContainer);
};

let mapCenter;

const initExplorerViewListeners = async ({
	mapViews,
	formatExtentParametersAndUpdateHashParams,
	DOM_id_class_variables,
}) => {
	const reactiveUtils = await $arcgis.import(
		'@arcgis/core/core/reactiveUtils.js',
	);

	//There's a better way to do this, right? Have a function to add each event listener
	const dragUtil = mapViews.map((viewComponent) => {
		reactiveUtils.when(
			() => viewComponent.view['center'],
			() => {
				if (viewComponent.view['center'] === mapCenter) {
					return;
				}

				mapCenter = viewComponent.view['center'];
				recenterMaps({ mapViews, viewComponent });
			},
		);

		reactiveUtils.when(
			() => viewComponent.view['zoom'],
			() => {
				adjustMapZoomLevel({ mapViews, viewComponent, DOM_id_class_variables });
			},
		);

		reactiveUtils.watch(
			() => viewComponent.view['navigating'] === false,
			() => {
				formatExtentParametersAndUpdateHashParams({ viewComponent });
			},
		);
	});
};

const recenterMaps = ({ mapViews, viewComponent }) => {
	mapViews.forEach((view) => {
		view.center = viewComponent['center'];
	});
};

const adjustMapZoomLevel = ({
	mapViews,
	viewComponent,
	DOM_id_class_variables,
}) => {
	console.log('zoom event source', viewComponent.view);
	mapViews.forEach((view) => {
		view.zoom = viewComponent['zoom'];
	});
};
// viewComponent === DOM_id_class_variables['explorer_ecosystems'] &&
// 			view.id !== DOM_id_class_variables['projectionMode_mainView']
// 				? viewComponent['zoom'] + 1
// 				: viewComponent['zoom'];
const viewClickEvent = (
	config,
	sessionToken,
	mapViews,
	mapClickEventDelegation,
	DOM_id_class_variables,
	explorerLookupTable,
	showInvalidNotificationDiv,
	updateHashParamString,
	getString,
) => {
	const IdentifyEvent = mapViews.map((viewComponent) => {
		viewComponent.addEventListener('arcgisViewClick', (event) => {
			if (viewComponent.id === DOM_id_class_variables['explorer_ecosystems']) {
				updateHashParamString({ event });
			}

			mapClickEventDelegation({
				event,
				config,
				sessionToken,
				DOM_id_class_variables,
				explorerLookupTable,
				showInvalidNotificationDiv,
				createNewCrosshairGraphic,
				getString,
			});
		});
	});
};

export {
	initExplorerMapViews,
	initExplorerViewListeners,
	initPopOutView,
	viewClickEvent,
};
