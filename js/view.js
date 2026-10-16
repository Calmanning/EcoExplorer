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

			const zoomLevel =
				viewComponentElement.id ===
				DOM_id_class_variables['explorer_ecosystems']
					? config.view.zoom
					: config.view.supplementalZoom;

			const hashZoomLevel =
				viewComponentElement.id ===
					DOM_id_class_variables['explorer_ecosystems'] && hashParams?.zoom
					? hashParams?.zoom
					: hashParams?.zoom - 1;

			const zoomLevelConstraint =
				viewComponentElement.id ===
				DOM_id_class_variables['explorer_ecosystems']
					? config.view.constraints__minZoom
					: config.view.constraints__supplementalMinZoom;

			//Is this section too crowded? It seems hard to read.
			viewComponentElement.view.attributionVisible = false;
			viewComponentElement.view.popup = null;
			viewComponentElement.view.center =
				previousSessionExt || config.view.extCenter;
			viewComponentElement.view.zoom = hashZoomLevel || zoomLevel;
			viewComponentElement.view.constraints = {
				snapToZoom: config.view.constraints__zoomSnap,
				minZoom: zoomLevelConstraint,
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
				const crosshairGraphicLayer = await createCrossHairGraphicLayer(config);

				addSearchComponent({ viewComponentElement, DOM_id_class_variables });

				const projectionLayers = await createApplicationLayers(
					config.ecoProjectionLayers__operationalLayers,
				);

				console.log('PROJECTION LAYERS', projectionLayers);
				viewComponentElement.map.layers.items[0].addMany(projectionLayers);
				// viewComponentElement.map.layers.push(projectionLayers);

				const loadPromises =
					viewComponentElement.map.layers.items[0].layers.map(async (layer) => {
						await layer.when();
					});

				await Promise.all(loadPromises);
				viewComponentElement.map.layers.add(crosshairGraphicLayer);
				console.log(viewComponentElement.map.layers);
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

				const loadLayerPromise =
					viewComponentElement.map.layers.items[0].layers.map(async (layer) => {
						await layer.when();
					});

				await Promise.all(loadLayerPromise);
			}

			return viewComponentElement;
		},
	);

	const mapViews = await Promise.all(mapViewsArray);
	const allViews = mapViews.map((view) => view);

	setUpViewEvent(
		mapViews,
		formatExtentParametersAndUpdateHashParams,
		DOM_id_class_variables,
	);

	console.log(allViews);
	return allViews;
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

const setUpViewEvent = (
	mapViews,
	formatExtentParametersAndUpdateHashParams,
	DOM_id_class_variables,
) => {
	const mainView = mapViews.shift();

	const supplementalViews = mapViews;

	initExplorerViewListeners({
		mainView,
		// mapViews,
		supplementalViews,
		formatExtentParametersAndUpdateHashParams,
		DOM_id_class_variables,
	});
};

let mapCenter;

const initExplorerViewListeners = async ({
	mainView,
	supplementalViews,
	// mapViews,
	formatExtentParametersAndUpdateHashParams,
	DOM_id_class_variables,
}) => {
	const reactiveUtils = await $arcgis.import(
		'@arcgis/core/core/reactiveUtils.js',
	);

	//There's a better way to do this, right? Have a function to add each event listener
	console.log('THIS IS THE MAIN VIEW THAT WE BROUGHT IN', mainView);
	console.log(
		'THIS IS THE SUPPLEMENT VIEWS THAT WE BROUGHT IN',
		supplementalViews,
	);
	reactiveUtils.when(
		() => mainView.view['center'],
		() => {
			if (mainView.view['center'] === mapCenter) {
				return;
			}

			mapCenter = mainView.view['center'];
			recenterMaps({ supplementalViews, mainView });
		},
	);

	reactiveUtils.when(
		() => mainView.view['zoom'],
		() => {
			adjustMapZoomLevel({ supplementalViews, mainView });
		},
	);

	reactiveUtils.watch(
		() => mainView.view['navigating'] === false,
		() => {
			formatExtentParametersAndUpdateHashParams({ mainView });
		},
	);

	const doneUpdatingRemoveLoader = reactiveUtils.watch(
		() => mainView['updating'] === false,
		() => {
			//change class string to variable.
			document.querySelector(`.initAppLoader`)?.remove();
		},
		{ once: true },
	);

	supplementalViews.map((viewComponent) => {
		reactiveUtils.when(
			() => viewComponent.view['center'],
			() => {
				if (viewComponent.view['center'] === mapCenter) {
					return;
				}

				mapCenter = viewComponent.view['center'];
				recenterMaps({ supplementalViews, viewComponent, mainView });
			},
		);

		reactiveUtils.when(
			() => viewComponent.view['zoom'],
			() => {
				adjustMapZoomLevel({ supplementalViews, viewComponent, mainView });
			},
		);

		reactiveUtils.watch(
			() => viewComponent.view['navigating'] === false,
			() => {
				formatExtentParametersAndUpdateHashParams({ viewComponent });
			},
		);

		const doneUpdatingRemoveLoader = reactiveUtils.watch(
			() => viewComponent['updating'] === false,
			() => {
				//change class string to variable.
				document.querySelector(`.initAppLoader`)?.remove();
			},
			{ once: true },
		);
	});
};

const recenterMaps = ({ supplementalViews, viewComponent, mainView }) => {
	// console.log('mainView', mainView.view['center']);
	// console.log('viewComponent', viewComponent['center']);

	supplementalViews.forEach((view) => {
		view.center = viewComponent
			? viewComponent['center']
			: mainView.view['center'];
	});

	if (viewComponent) {
		mainView.view['center'] = viewComponent['center'];
	}
	// viewComponent
	// 	? (mainView.view['center'] = viewComponent['center'])
	// 	: (mainView.view['center'] = mainView.view['center']);
};

const adjustMapZoomLevel = ({ supplementalViews, viewComponent, mainView }) => {
	supplementalViews.forEach((view) => {
		view.zoom = viewComponent
			? viewComponent['zoom']
			: mainView.view['zoom'] - 1;
	});

	if (viewComponent) {
		mainView.view['zoom'] = viewComponent['zoom'] + 1;
	}
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
	getString,
	isMobileDevice,
) => {
	console.log('doing a click event');
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
				isMobileDevice,
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
