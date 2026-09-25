const addExportFormToMap = (
	config,
	DOM_id_class_variables,
	hashParams,
	mapViews,
	parseAndFormatURL,
	userPortalData,
) => {
	//should the 'main' element be sent as a parameter? I think YES, so We'll have to take some time to make that a part of the
	const params = parseAndFormatURL();
	console.log(params['mode']);
	const map = mapViews[0];
	// const operationalLayers = getMapViewForExport(
	// 	mapViews,
	// 	params['mode'],
	// 	config,
	// );

	const exportUI_HTML = buildExportUI(DOM_id_class_variables, hashParams, map);
	// const exportForm_textFields = exportUI_HTML.querySelectorAll('textarea');
	// console.log(exportForm_textFields);

	// const mapDataForExport = createMapExportDefinition(
	// 	config,
	// 	map,
	// 	exportForm_textFields,
	// );

	console.log('the export element', exportUI_HTML);
	const mainDOM_DropShadow = document.querySelector('main').firstElementChild;

	mainDOM_DropShadow.insertAdjacentElement('afterend', exportUI_HTML);

	exportUI_HTML.addEventListener('click', (event) => {
		console.log('export ui click', event);
		exportFormEvents({
			event,
			exportUI_HTML,
			createWebMap_process,
			sendExportRequest,
			// mapDataForExport,
			userPortalData,
			createMapExportDefinition,
			config,
			map,
			// operationalLayers,
			hashParams,
		});
	});
};

const buildSuccessMessageUI = ({ userPortalData, exportMapResponse }) => {
	console.log(userPortalData);
	const messageContainerNode = document.createElement('div');
	const messageHTML = `
  <div style="text-align: right;">
  <calcite-icon class="cancel" icon="x" aria-hidden="true" scale="m" calcite-hydrated=""><template shadowrootmode="open"><!----><svg aria-hidden="true" fill="currentColor" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" class=" svg " viewBox="0 0 24 24"><!--?lit$323654696$--><!----><path d="M18.01 6.697 12.707 12l5.303 5.303-.707.707L12 12.707 6.697 18.01l-.707-.707L11.293 12 5.99 6.697l.707-.707L12 11.293l5.303-5.303z"></path><!----></svg></template></calcite-icon>
  </div>
  <div > Webmap successfully created </div>
  <div class='link-btn-container'>
  <a class='btn open-webmap' target='_blank' href="https://${userPortalData.urlKey}.${userPortalData.customUrl}/home/item.html?id=${exportMapResponse.id}">Open Webmap</a>
  </div>
  `;
	messageContainerNode.id = 'exportResponseMessage';
	messageContainerNode.innerHTML = messageHTML;

	return messageContainerNode;
};

const buildErrorMessageUI = ({ exportMapResponse }) => {
	const messageContainerNode = document.createElement('div');
	const messageHTML = `
  <div style="text-align: right;">
  <calcite-icon class="cancel" icon="x" aria-hidden="true" scale="m" calcite-hydrated=""><template shadowrootmode="open"><!----><svg aria-hidden="true" fill="currentColor" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" class=" svg " viewBox="0 0 24 24"><!--?lit$323654696$--><!----><path d="M18.01 6.697 12.707 12l5.303 5.303-.707.707L12 12.707 6.697 18.01l-.707-.707L11.293 12 5.99 6.697l.707-.707L12 11.293l5.303-5.303z"></path><!----></svg></template></calcite-icon>
  </div>
  <div> Error creating webmap: </div>
  <div> Error code: ${exportMapResponse.error.code} </div>
  <div> ${exportMapResponse.error.message} </div>
  `;

	messageContainerNode.id = 'exportResponseMessage';
	messageContainerNode.innerHTML = messageHTML;

	// <div class='link-btn-container'>
	// <a class='btn open-webmap' target='_blank' href="https://${userPortalData.urlKey}.${userPortalData.customUrl}/home/item.html?id=${exportMapResponse.id}">Open Webmap</a>
	// </div>
	return messageContainerNode;
};

const buildExportUI = (DOM_id_class_variables, hashParams, map) => {
	//building HTML for the export
	//this could be generated on app load, depending on the hash params.
	console.log('map export', map);

	const exportContainer_ID = DOM_id_class_variables['export_container'];
	const exportUIContainer = document.createElement('div');
	exportUIContainer.id = exportContainer_ID;
	// exportUIContainer.classList.add(`${noDisplayClass}`);
	const exportFormHTML = `
                           <div class="form-container">
                             <form id="export-form">
                               <div class='form-element'>
                                 <label> ArcGIS Online Web Map Title* </label>
                                 <br>
                                 <textarea class='title' type='text' contenteditable='true'>${map.id || ''}  </textarea>
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
                                 <btn class='btn cancel'>CANCEL</btn>
                                 <btn class='btn export'>CREATE WEB MAP</btn>
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

const createBtn = (string, classString) => {
	const btn = document.createElement('btn');
	btn.classList.add('btn', classString);
	btn.innerText = string;
	return btn;
};
//YOU NEED TO UPDATE THIS function. No longer using different mapView for the Projection Layers.
//certain layers will need to be removed from the main mapView (mapView[0]) for the export process.
const getMapViewForExport = (mapViews, mapMode, config) => {
	console.log(mapMode);
	const exportMap =
		mapMode === 'explore' || mapMode === ''
			? removeProjectionLayers(mapViews[0], config)
			: removeExploreLayers(mapViews[0], config);

	//? mapViews[0] //this will be a new function called removeProjectionLayers()
	//: mapViews[mapViews.length - 1]; // this will be removeExploreLayer (the World Terrestrial Ecosystems v2 for 2015 layer)

	console.log(exportMap);
	return exportMap;
};

const removeProjectionLayers = (operationalLayers, config) => {
	const operationalGroupLayer = config.operationalLayers[0];

	const arrayMapViewLayers = operationalLayers;
	const projectionLayers = config.ecoProjectionLayers__operationalLayers;

	const layerArrayNoExploreLayer = arrayMapViewLayers.filter(
		(layer) =>
			projectionLayers.some(
				(filteringLayer) => filteringLayer.title === layer.title,
			) === false,
	);
	console.log(
		'the array with the projection layer removed',
		layerArrayNoExploreLayer,
	);

	// operationalGroupLayer.layers = layerArrayNoExploreLayer;
	return layerArrayNoExploreLayer;
};

const removeExploreLayers = () => {
	const exploreLayer = config.dependencies__exploreLayer;
};

const createBaseMapLayersDefinitions = (basemapDetails, config) => {
	console.log(basemapDetails);
	const basemapLayers = [];

	const parseAndAddBasemapLayer = (layer) => {
		const layerDetailDefinition = {
			id: layer.id,
			type: layer.type,
			layerType: layer.operationalLayerType,
			title: layer.title,
			styleUrl: layer?.styleUrl || '',
			itemId: layer.portalItem.id,
			visible: layer.visible,
			opacity: layer.opacity,
			blendMode: layer.blendMode,
			effect: getBasemapLayerEffect({ layer, config }),
			isReference: layer?.isReference,
		};

		basemapLayers.push(layerDetailDefinition);
	};

	basemapDetails.baseLayers.items.map((basemapLayer) => {
		parseAndAddBasemapLayer(basemapLayer);
	});

	return basemapLayers;
};

const createOperationalLayersForExport = ({
	operationalLayers,
	config,
	hashParams,
}) => {
	//IS THIS NAMING CONVENTION AND SITUATION A BAD IDEA?
	console.log('the op layers', operationalLayers);
	const mapMode = hashParams.mode;
	const arrayOfTargetLayers = operationalLayers;
	const operationalLayersArray = [];

	// arrayOfTargetLayers.filter((layer) => layer?.type === 'graphics');

	const arrayOfEditedLayers = arrayOfTargetLayers.map((layer) => {
		if (layer.type === 'group') {
			const operationalLayers =
				mapMode === 'explore' || mapMode === ''
					? removeProjectionLayers(layer.layers.items, config)
					: removeExploreLayers(layer.layers.items, config);

			console.log(
				'the layers that will be fed into the layer generator',
				operationalLayers,
			);
			const groupLayerParameters = {
				title: layer.title,
				layerType: 'GroupLayer',
				effect: getLayerEffect({ layer, config }),
				layers: createOperationalLayersForExport({
					operationalLayers,
					config,
					hashParams,
				}),
				visibility: layer.visible,
				minScale: layer.minScale,
				maxScale: layer.maxScale,
				visibilityTimeExtent: layer.visibilityTimeExtent,
			};

			return groupLayerParameters;
		}

		// if (layer.type === 'graphics') {
		// 	console.log('this layer is rejected', layer);
		// 	return;
		// }

		const newLayerParameters = {
			title: layer.title,
			layerType: getLayerType({ layer, config }),
			itemId: layer?.portalItem?.id || '',
			url: layer?.url || '',
			blendMode: layer?.blendMode || 'normal',
			interpolation: getLayerInterpolation({ layer, config }) || '',
			effect: getLayerEffect({ layer, config }),
			layerDefinition: {
				drawingInfo: {
					renderer: layer?.renderer || '',
				},
			},
			renderingRule: {
				rasterFunction: layer?.rasterFunction?.functionName || '',
				rasterFunctionArguments: layer?.rasterFunction?.functionArguments || '',
				rasterFunctionDefinition:
					layer?.rasterFunction?.rasterFunctionDefinition || '',
			},
			visibility: layer.visible,
			opacity: layer.opacity,
		};
		return newLayerParameters;
	});

	// arrayOfEditedLayers.filter((layer) => layer === undefined);
	return arrayOfEditedLayers;
};

const getLayerType = ({ layer, config }) => {
	console.log(layer);

	const targetLayer = layer.portalItem.id;
	console.log(targetLayer);

	const layerTypeFromConfigFile = config.operationalLayers[0].layers.find(
		(configOperationalLayer) => {
			if (targetLayer === configOperationalLayer.itemId) {
				console.log('positive match');
				return configOperationalLayer;
			}
		},
	);

	console.log(layerTypeFromConfigFile === undefined);
	if (layerTypeFromConfigFile !== undefined) {
		return layerTypeFromConfigFile?.layerType;
	}

	const projectionLayerFromConfig =
		config.ecoProjectionLayers__operationalLayers.find(
			(configProjectionLayer) => {
				if (targetLayer === configProjectionLayer.itemId) {
					console.log('positive match');
					return configProjectionLayer;
				}
			},
		);
	return projectionLayerFromConfig?.layerType;
};

const getLayerEffect = ({ layer, config }) => {
	const targetLayer = layer.title;

	if (layer.type === 'group') {
		console.log(config.operationalLayers[0].effectForExport);
		return config.operationalLayers[0].effectForExport;
	}

	console.log(config);
	const effectForTargetLayerExport = config.operationalLayers[0].layers.find(
		(operationalLayerConfig) => {
			if (layer?.effect === false) {
				return null;
			}

			if (targetLayer === operationalLayerConfig.title) {
				return operationalLayerConfig;
			}
		},
	);

	return effectForTargetLayerExport?.effectForExport;
};
const getBasemapLayerEffect = ({ layer, config }) => {
	const targetLayer = layer.title;

	console.log(config);
	const effectForTargetLayerExport = config.basemapLayers.find(
		(operationalLayerConfig) => {
			if (layer?.effect === false) {
				return null;
			}

			if (targetLayer === operationalLayerConfig.title) {
				return operationalLayerConfig;
			}
		},
	);
	return effectForTargetLayerExport?.effectForExport;
};

const getLayerInterpolation = ({ layer }) => {
	const layerInterpolationString = layer.interpolation;

	const InterpolationLookupTable = {
		bilinear: 'RSP_BilinearInterpolation',
		'nearest neighbor': 'RSP_NearestNeighbor',
		cubic: 'RSP_CubicConvolution',
		majority: 'RSP_Majority',
	};

	return InterpolationLookupTable[layerInterpolationString];
};

const createMapExportDefinition = (config, map, exportUI_HTML, hashParams) => {
	const exportForm_textFields = exportUI_HTML.querySelectorAll('textarea');
	const basemapInfo = createBaseMapLayersDefinitions(map.map.basemap, config);

	const operationalLayers = map.map.layers;
	console.log(map.map);
	operationalLayers.items.splice(1, 1);
	const operationalLayersForExport = createOperationalLayersForExport({
		operationalLayers,
		config,
		hashParams,
	});

	// operationalLayersForExport.items.((layer) => layer === undefined);
	operationalLayersForExport.map((layer) => {
		console.log(layer);
	});
	// console.log(exportForm_textFields);
	// exportForm_textFields.forEach((node) => {
	// 	console.log(node);
	// 	// console.log(node.innerText);
	// 	// console.log(node.firstElementChild.innerText);
	// });

	console.log('all the layers fed into the webmap creation', operationalLayers);
	console.log(
		'all the layers fed from the operational creation function',
		operationalLayersForExport,
	);
	console.log(basemapInfo);

	const webmapDefinition = {
		description: exportForm_textFields[2].value,
		tags: exportForm_textFields[1].value,
		title: exportForm_textFields[0].value,
		type: 'Web Map',
		multipart: false,
		f: 'json',
		text: JSON.stringify({
			operationalLayers: operationalLayersForExport,
			// operationalLayers: config.operationalLayers,
			baseMap: {
				baseMapLayers: basemapInfo,
				// referenceLayers: basemapInfo.referenceLayers,
				title: 'outdoor',
			},
			initialState: {
				viewpoint: {
					scale: map.view.scale,
					targetGeometry: map.view.extent,
				},
			},
			spatialReference: map.view.spatialReference,
			version: '2.36',
			authoringApp: 'EcoExplorer',
			authoringAppVersion: '0.1',
		}),
	};

	return webmapDefinition;
};

const exportFormEvents = ({
	event,
	exportUI_HTML,
	createWebMap_process,
	sendExportRequest,
	// mapDataForExport,
	userPortalData,
	createMapExportDefinition,
	config,
	map,
	hashParams,
	// operationalLayers,
}) => {
	if (event.target.classList.contains('export')) {
		createWebMap_process({
			sendExportRequest,
			// mapDataForExport,
			userPortalData,
			exportUI_HTML,
			createMapExportDefinition,
			config,
			exportUI_HTML,
			map,
			hashParams,
			// operationalLayers,
		});
	}
};

const createWebMap_process = async ({
	sendExportRequest,
	// mapDataForExport,
	userPortalData,
	createMapExportDefinition,
	config,
	exportUI_HTML,
	map,
	hashParams,
}) => {
	const mapDataForExport = createMapExportDefinition(
		config,
		map,
		exportUI_HTML,
		hashParams,
	);
	const exportMapResponse = await sendExportRequest(
		mapDataForExport,
		userPortalData,
	);

	console.log(exportMapResponse);
	if (exportMapResponse.success === true) {
		const successMessage = buildSuccessMessageUI({
			userPortalData,
			exportMapResponse,
		});
		console.log(exportUI_HTML.firstElementChild);
		exportUI_HTML.firstElementChild.remove();
		exportUI_HTML.append(successMessage);
	}
	if (exportMapResponse.error) {
		// console.log('problem with map export', exportMapResponse);
		const failMessage = buildErrorMessageUI({ exportMapResponse });
		exportUI_HTML.firstElementChild.remove();
		exportUI_HTML.append(failMessage);
	}
};

const sendExportRequest = async (mapDataForExport, userPortalData) => {
	try {
		console.log(userPortalData);
		//create a token property for the webmap using the token created in the 'userPortalData' variable
		// mapDataForExport.token = userPortalData.token;

		// const postData = { title: 'webmap', body: mapDataForExport };
		const postData = new FormData();
		Object.entries(mapDataForExport).forEach(([key, value]) => {
			postData.append(key, value);
		});

		postData.token = userPortalData.token;
		console.log(userPortalData.token);
		const userPortalUrl = `${userPortalData.restUrl}/content/users/${userPortalData.userName}/addItem?token=${userPortalData.token}`;

		console.log('the URL for the export', userPortalUrl);
		const postResponse = await fetch(userPortalUrl, {
			method: 'POST',
			body: postData,
		});

		if (postResponse.ok) {
			const responseJSON = await postResponse.json();
			// console.log(responseJSON);
			return responseJSON;
		}

		console.log(postResponse);
	} catch (error) {
		console.log(error);
		return error;
	}
};
export { addExportFormToMap };
