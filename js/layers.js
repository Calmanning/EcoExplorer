const graphicLayerId = 'crosshair';

const createApplicationLayers = async (basemapLayersConfigArray) => {
	const layersArray = [];
	try {
		for (const layer of basemapLayersConfigArray) {
			if (layer.type === 'group') {
				const groupLayer = await initGroupLayer(layer);

				layersArray.push(groupLayer);
			}
			if (layer.type === 'ArcGISTiledMapServiceLayer') {
				const tileLayer = await initTileBasemapLayer(layer);

				layersArray.push(tileLayer);
			}
			if (layer.type === 'imageryLayer') {
				const tileLayer = await initImageryLayer(layer);

				layersArray.push(tileLayer);
			}
			if (layer.type === 'imageryTileLayer') {
				const imageryTileLayer = await initImageryTileLayer(layer);

				layersArray.push(imageryTileLayer);
			}
			if (layer.type === 'VectorTileLayer') {
				let vectorTileLayer;
				if (!layer.language) {
					vectorTileLayer = await initVectorTileBasemapLayer(layer);

					layersArray.push(vectorTileLayer);
				}
				if (layer.language && layer.language === targetLanguage) {
					vectorTileLayer = await initVectorTileBasemapLayer(layer);
				} else {
					continue;
				}
			}
		}

		return layersArray;
	} catch (error) {
		console.log('error encountered while initializing all layers', error);
	}
};

const initImageryLayer = async (layerData) => {
	try {
		const ImageryLayer = await $arcgis.import(
			'@arcgis/core/layers/ImageryLayer.js',
		);

		const noMask = await newRasterFunction(layerData.rasterFunction);
		const layer = new ImageryLayer({
			title: layerData.title,
			portalItem: {
				id: layerData.itemId,
			},
			effect: layerData.effect || '',
			maxScale: layerData.maxScale || 0,
			minScale: layerData.minScale || 0,
			visible: layerData?.visible === false ? layerData.visible : true,
			blendMode: layerData.blendMode || 'normal',
			interpolation: layerData.interpolation || '',
			noData: layerData.noData || 0,
			opacity: layerData.opacity || 1,
		});

		layer.rasterFunction = noMask;

		return layer;
	} catch (error) {
		throw ('issue with the imagery layer construction', error);
	}
};

const initImageryTileLayer = async (layerData) => {
	try {
		const ImageryTileLayer = await $arcgis.import(
			'@arcgis/core/layers/ImageryTileLayer.js',
		);

		if (layerData.title === 'World Terrestrial Ecosystems v2 for 2015') {
		}

		// const layerRasterFunction = await newRasterFunction(
		// 	layerData.rasterFunction,
		// );

		const layer = new ImageryTileLayer({
			title: layerData.title,
			id: layerData.id || '',
			portalItem: {
				id: layerData.itemId,
			},
			effect: layerData.effect || '',
			maxScale: layerData.maxScale || 0,
			minScale: layerData.minScale || 0,
			visible: layerData?.visible === false ? layerData.visible : true,
			blendMode: layerData.blendMode || 'normal',
			interpolation: layerData.interpolation || '',
			noData: layerData.noData || 0,
			rasterFunction: layerData?.rasterFunction
				? await newRasterFunction(layerData.rasterFunction)
				: null,
			opacity: layerData.opacity || 1,
		});

		return layer;
	} catch (error) {
		console.log('issue initializing the imageryTileLayer', error);
	}
};

const newRasterFunction = async (rasterFunctionObject) => {
	const [RasterFunctionUtils] = await $arcgis.import([
		'@arcgis/core/layers/support/rasterFunctionUtils.js',
	]);

	if (rasterFunctionObject.rasterFunction === 'Mask') {
		const noDataMask = RasterFunctionUtils.mask({
			includedRanges: [[0, 0]],
		});

		return noDataMask;
	}

	// const createRasterFunction = RasterFunction.fromJSON(rasterFunctionObject);

	return noDataMask;
};

const initVectorTileBasemapLayer = async (layerData) => {
	const VectorTileLayer = await $arcgis.import(
		'@arcgis/core/layers/VectorTileLayer.js',
	);

	const layer = new VectorTileLayer({
		title: layerData.title,
		portalItem: {
			id: layerData.itemId,
		},
		effect: layerData.effect || '',
		maxScale: layerData.maxScale || 0,
		minScale: layerData.minScale || 0,
		visible: layerData?.visible === false ? layerData.visible : true,
		opacity: layerData.opacity || 1,
		blendMode: layerData.blendMode || 'normal',
	});

	return layer;
};

const initTileBasemapLayer = async (layerData) => {
	const TileLayer = await $arcgis.import('@arcgis/core/layers/TileLayer.js');

	const layer = new TileLayer({
		title: layerData.title,
		portalItem: {
			id: layerData.itemId,
		},
		effect: layerData.effect || '',
		blendMode: layerData?.blendMode || 'normal',
		opacity: layerData?.opacity || 1,
		maxScale: layerData.maxScale || 0,
		minScale: layerData.minScale || 0,
		visible: layerData?.visible === false ? layerData.visible : true,
	});

	return layer;
};

const initGroupLayer = async (layerData) => {
	const GroupLayer = await $arcgis.import('@arcgis/core/layers/GroupLayer.js');

	const subLayers = await createApplicationLayers(layerData.layers);

	const groupLayer = new GroupLayer({
		title: layerData.title,
		layers: subLayers,
		effect: layerData.effect || '',
	});

	return groupLayer;
};

const createCrossHairGraphicLayer = async () => {
	try {
		const [GraphicsLayer] = await $arcgis.import([
			'@arcgis/core/layers/GraphicsLayer.js',
		]);
		const crosshairLayer = new GraphicsLayer({
			id: graphicLayerId,
			title: graphicLayerId,
			graphics: [],
		});
		return crosshairLayer;
	} catch (error) {
		console.log('Error during graphics layer initialization.', error);
	}
};

//NEED TO RENAME THE FUNCTION. It now contains more logic to determine if it needs to only remove the graphic
const createNewCrosshairGraphic = async ({
	mapPoint,
	explorerMainMapView,
	noPixelInfo,
}) => {
	try {
		const [Graphic] = await $arcgis.import(['@arcgis/core/Graphic.js']);

		const crosshairGraphicLayer =
			explorerMainMapView.map.findLayerById(graphicLayerId);

		crosshairGraphicLayer.graphics.removeAll();

		//If there is no valid pixel, do not create a graphic
		if (noPixelInfo === true) {
			return;
		}

		const mapPointSymbol = {
			type: 'picture-marker',
			url: 'libraries/images/CrosshairWhite.png',

			width: 33,
			height: 33,
			color: 'blue',
		};

		const mapPointGraphic = new Graphic({
			symbol: mapPointSymbol,
			geometry: mapPoint,
		});

		crosshairGraphicLayer.graphics.add(mapPointGraphic);
	} catch (error) {
		console.log('Error occurred creating crosshair graphic', error);
	}
};

//this function will need the config Parameter
const updateProjectionModelVisibility = async (
	config,
	viewElement,
	projectionModelString,
	changeTypeString,
) => {
	let projectionModelLayer;
	let ecoLayer;

	const projectionViewLayers =
		viewElement.view.map.layers.items[0].layers.items;
	// const filterValueArrays = changeTypeString.split(',');
	const filterValueArrays =
		config.projectionRenderClassValues[`${changeTypeString}`];

	console.log(filterValueArrays);
	console.log(config.projectionRenderClassValues);
	const transparentColor = [0, 0, 0, 0];
	//make all projection layers invisible.
	//this should become it's own named function.
	projectionViewLayers.forEach(async (layer) => {
		//this is a bad way to find the layer. use the itemId when you get more time.
		if (layer.title === config.dependencies__exploreLayer.title) {
			ecoLayer = layer;
		}
		if (layer.id.includes('projection')) {
			layer.visible = false;
		}
		if (layer.id.includes(projectionModelString)) {
			layer.renderer.uniqueValueGroups[0].classes.forEach(
				(renderClass, index) => {
					if (filterValueArrays.includes(renderClass.values[0].value)) {
						renderClass.symbol.color =
							config.projectionRenderer.uniqueValueGroups[0].classes[index];

						return;
					}
					renderClass.symbol.color = transparentColor;
				},
			);
			layer.visible = true;
			ecoLayer.rasterFunction = null;
			layer.refresh();
		}
	});
};

export {
	createApplicationLayers,
	createCrossHairGraphicLayer,
	createNewCrosshairGraphic,
	updateProjectionModelVisibility,
};
