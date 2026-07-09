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
		console.log('targetView for the pop out map.', targetView);

		const basemapBaseLayers = await createApplicationLayers(
			config.basemapLayers,
		);
		// const basemapReferenceLayers = await createApplicationLayers(
		// 	config.referenceLayers,
		// );

		const mapLocation = parseAndFormatURL();
		console.log(parseAndFormatURL());
		console.log(mapLocation);
		const previousSessionExt = mapLocation.ext[0]
			? mapLocation?.ext.split(',')
			: null;

		console.log(previousSessionExt);
		// const previousSessionExt = hashParams?.ext[0]
		// 	? hashParams?.ext.split(',')
		// 	: null;

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
					console.log(
						'the title of the layer for the mask in the minimap',
						layer.title,
					);
					console.log(layer);
					return layer.rasterFunction;
				}
			});
		const operationalLayers = await createApplicationLayers(
			config.operationalLayers,
		);

		viewComponent.view.attributionVisible = true;
		viewComponent.view.popup = null;
		viewComponent.view.center = previousSessionExt || config.view.center;
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

		console.log('operational Layers for MAP', operationalLayers);
		viewComponent.map = new Map({
			basemap: outdoorBasemap,
		});

		//THERE HAS TO BE A BETTER WAY TO DO THIS STATEMENT.

		viewComponent.map.layers.add(operationalLayers[0]);

		const targetLayer = viewComponent.map.layers.items[0].layers.items.find(
			(layer) => {
				if (layer.title === config.dependencies__exploreLayer.title) {
					layer.renderer = '';
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
	// const basemapReferenceLayers = await createApplicationLayers(
	// 	config.referenceLayers,
	// );

	// console.log(operationalLayers);
	const [View, Map, Basemap, Layer] = await $arcgis.import([
		'@arcgis/core/views/View.js',
		'@arcgis/core/Map.js',
		'@arcgis/core/Basemap.js',
		'@arcgis/core/layers/Layer.js',
	]);

	console.log("session token for the layer's APIkey?", sessionToken);

	// const worldLandUnits = await Layer.fromPortalItem({
	// 	id: config.dependencies__exploreLayer.itemId,
	// 	apiKey: sessionToken,
	// });

	const previousSessionExt = hashParams?.ext[0]
		? hashParams?.ext.split(',')
		: null;

	const mapViewsArray = viewElements.map(
		//NOT A GOOD FUNCTION NAME

		async (viewComponentElement, index) => {
			viewComponentElement.componentOnReady();

			console.log(
				'the operational layer before being send to the layers function',
				config.operationalLayers,
			);
			const operationalLayers = await createApplicationLayers(
				config.operationalLayers,
			);

			//Is this section too crowded? It seems hard to read.
			viewComponentElement.view.attributionVisible = false;
			viewComponentElement.view.popup = null;
			viewComponentElement.view.center =
				previousSessionExt || config.view.center;
			viewComponentElement.view.zoom = hashParams?.zoom || config.view.zoom;
			viewComponentElement.view.constraints = {
				snapToZoom: config.view.constraints__zoomSnap,
				minZoom: config.view.constraints__minZoom,
			};
			viewComponentElement.view.ui =
				index == 0 || index == viewElements.length - 1 // looking for the first and last indexes in this array.
					? {} //will generate the default 'zoom' widget
					: {
							components: [], // excludes the default 'zoom' widget
						};

			//GOING TO NEED TO MAKE A FUNCTION THAT WILL PROCESS AN ARRAY OF BASEMAPS THAT WILL THEN BE INSERTED INTO THE MAP CONSTRUCTOR
			const outdoorBasemap = new Basemap({
				baseLayers: basemapBaseLayers,
				// referenceLayers: basemapReferenceLayers,
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

				const searchComponent = document.createElement('arcgis-search');
				const searchContainer = document.createElement('div');
				searchContainer.classList.add('search-container');
				searchContainer.append(searchComponent);

				viewComponentElement.append(searchContainer);
				viewComponentElement.map.layers.add(crosshairGraphicLayer);
			}

			if (
				viewComponentElement.id ===
				DOM_id_class_variables['projectionMode_mainView']
			) {
				const projectionLayers = await createApplicationLayers(
					config.ecoProjectionLayers__operationalLayers,
				);

				const searchComponent = document.createElement('arcgis-search');
				const searchContainer = document.createElement('div');
				searchContainer.classList.add('search-container');
				searchContainer.append(searchComponent);

				viewComponentElement.append(searchContainer);
				viewComponentElement.map.layers.items[0].addMany(projectionLayers);
			}

			return viewComponentElement;
		},
	);

	const mapViews = await Promise.all(mapViewsArray);
	console.log(mapViews);

	await initExplorerViewListeners({
		mapViews,
		formatExtentParametersAndUpdateHashParams,
	});

	return mapViews;
};

let mapCenter;

const initExplorerViewListeners = async ({
	mapViews,
	formatExtentParametersAndUpdateHashParams,
}) => {
	const reactiveUtils = await $arcgis.import(
		'@arcgis/core/core/reactiveUtils.js',
	);
	console.log('starting ractions', mapViews);

	// const IdentifyEvent = mapViews.map((viewComponent) => {
	// 	viewComponent.addEventListener('arcgisViewClick', (event) => {

	// 	});
	// });

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
				// formatExtentParametersAndUpdateHashParams({ viewComponent }); // bad idea. Should use a different Utils parameter ('updating'?) to update the URL
			},
		);

		reactiveUtils.when(
			() => viewComponent.view['zoom'],
			() => {
				adjustMapZoomLevel({ mapViews, viewComponent });
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

const adjustMapZoomLevel = ({ mapViews, viewComponent }) => {
	mapViews.forEach((view) => {
		view.zoom = viewComponent['zoom'];
	});
};

const viewClickEvent = (
	config,
	sessionToken,
	mapViews,
	mapClickEventDelegation,
	DOM_id_class_variables,
	explorerLookupTable,
	showInvalidNotificationDiv,
	updateHashParamString,
) => {
	console.log(mapViews);

	const IdentifyEvent = mapViews.map((viewComponent) => {
		console.log(viewComponent.id);

		viewComponent.addEventListener('arcgisViewClick', (event) => {
			if (viewComponent.id === DOM_id_class_variables['explorer_ecosystems']) {
				// createNewCrosshairGraphic(event, viewComponent);
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
