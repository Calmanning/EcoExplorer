const graphicLayerId = 'crosshair';

const createApplicationLayers = async (basemapLayersConfigArray) => {
	const layersArray = [];
	try {
		console.log(basemapLayersConfigArray);
		for (const layer of basemapLayersConfigArray) {
			if (layer.type === 'group') {
				const groupLayer = await initGroupLayer(layer);
				console.log('the group', groupLayer);
				layersArray.push(groupLayer);
			}
			if (layer.type === 'ArcGISTiledMapServiceLayer') {
				const tileLayer = await initTileBasemapLayer(layer);
				console.log('tileLayer', tileLayer);
				layersArray.push(tileLayer);
			}
			if (layer.type === 'imageryLayer') {
				const tileLayer = await initImageryLayer(layer);
				console.log('tileLayer', tileLayer);
				layersArray.push(tileLayer);
			}
			if (layer.type === 'imageryTileLayer') {
				const imageryTileLayer = await initImageryTileLayer(layer);
				console.log('tileLayer', imageryTileLayer);
				layersArray.push(imageryTileLayer);
			}
			if (layer.type === 'VectorTileLayer') {
				let vectorTileLayer;
				if (!layer.language) {
					vectorTileLayer = await initVectorTileBasemapLayer(layer);
					console.log('Vector tileLayer', vectorTileLayer);
					layersArray.push(vectorTileLayer);
				}
				if (layer.language && layer.language === targetLanguage) {
					console.log('getting language version');
					vectorTileLayer = await initVectorTileBasemapLayer(layer);
				} else {
					continue;
				}
				// layersArray.push(vectorTileLayer);
			}
		}

		console.log('baselayers array', layersArray);
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

		console.log(layer);

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
			console.log(layerData);
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
	console.log(rasterFunctionObject);
	const [RasterFunctionUtils] = await $arcgis.import([
		'@arcgis/core/layers/support/rasterFunctionUtils.js',
	]);
	console.log(rasterFunctionObject.rasterFunction);
	if (rasterFunctionObject.rasterFunction === 'Mask') {
		console.log('masking!');
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

	console.log(layer);
	return layer;
	// return new Promise((resolve, reject) => {
	// 	return require(['esri/layers/VectorTileLayer'], (VectorTileLayer) => {
	// 		const vectorTileLayer = new VectorTileLayer({
	// 			portalItem: {
	// 				id: layerData.portalId,
	// 				title: layerData.title,
	// 				// maxScale: layerData.maxScale,
	// 				// minScale: layerData.minScale,
	// 			},
	// 		});

	// 		// vectorTileLayer.title = getString(layerData.title);
	// 		resolve(vectorTileLayer);
	// 	});
	// });
};

const initTileBasemapLayer = async (layerData) => {
	const TileLayer = await $arcgis.import('@arcgis/core/layers/TileLayer.js');
	console.log(layerData.title, layerData.visible);
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

	// return new Promise((resolve, reject) => {
	// 	return require(['esri/layers/VectorTileLayer'], (VectorTileLayer) => {
	// 		const vectorTileLayer = new TileLayer({
	// 			portalItem: {
	// 				id: layerData.portalId,
	// 				title: layerData.title,
	// 			},
	// 		});

	// 		// vectorTileLayer.title = getString(layerData.title);
	// 		resolve(vectorTileLayer);
	// 	});
	// });
	return layer;
};

const initGroupLayer = async (layerData) => {
	const GroupLayer = await $arcgis.import('@arcgis/core/layers/GroupLayer.js');

	const subLayers = await createApplicationLayers(layerData.layers);

	console.log('the sub layers', subLayers);
	const groupLayer = new GroupLayer({
		title: layerData.title,
		layers: subLayers,
		effect: layerData.effect || '',
	});

	return groupLayer;

	// return new Promise((resolve, reject) => {
	// 	return require(['esri/layers/GroupLayer'], (GroupLayer) => {
	// 		createApplicationLayers(layerData.layers).then((layers) => {
	// 			const groupLayer = new GroupLayer({
	// 				title: layerData.title,
	// 				// effect: layerData.effect || '',
	// 				// maxScale: layerData.maxScale,
	// 				// minScale: layerData.minScale,
	// 				layers: layers,
	// 				// visible: layerData.visible,
	// 			});
	// 			resolve(groupLayer);
	// 		});
	// 	});
	// });
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
	pixelInfo,
}) => {
	console.log('creating new crosshair');
	console.log(explorerMainMapView);
	try {
		const [Graphic] = await $arcgis.import(['@arcgis/core/Graphic.js']);

		const crosshairGraphicLayer =
			explorerMainMapView.map.findLayerById(graphicLayerId);

		crosshairGraphicLayer.graphics.removeAll();

		//If there is no valid pixel, do not create a graphic
		if (pixelInfo === false) {
			return;
		}

		const mapPointSymbol = {
			type: 'picture-marker',
			url: 'libraries/images/CrosshairRed.png',

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
	console.log(viewElement);
	console.log(viewElement.firstElementChild.view);

	let projectionModelLayer;
	let ecoLayer;

	const projectionViewLayers =
		viewElement.firstElementChild.view.map.layers.items[0].layers.items;
	const filterValueArrays = changeTypeString.split(',');
	console.log(filterValueArrays);

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
			projectionModelLayer = layer;

			layer.renderer.uniqueValueGroups[0].classes.forEach(
				(renderClass, index) => {
					console.log(index);
					if (filterValueArrays.includes(renderClass.values[0].value)) {
						console.log(
							config.projectionRenderer.uniqueValueGroups[0].classes[index],
						);
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
			console.log(layer);
		}
	});

	// projectionModelLayer.visible = true;
	// projectionModelLayer.refresh();
	// console.log('filtering', projectionModelString, 'for', changeTypeString);
	// console.log(projectionModelLayer);
};

export {
	createApplicationLayers,
	createCrossHairGraphicLayer,
	createNewCrosshairGraphic,
	updateProjectionModelVisibility,
};
