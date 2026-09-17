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
	const map = getMapViewForExport(mapViews, params['mode']);

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
const getMapViewForExport = (mapViews, mapMode) => {
	console.log(mapMode);
	const exportMap =
		mapMode === 'explore' || mapMode === ''
			? mapViews[0]
			: mapViews[mapViews.length - 1];

	console.log(exportMap);
	return exportMap;
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

const createOperationalLayersForExport = ({ operationalLayers, config }) => {
	//IS THIS NAMING CONVENTION AND SITUATION A BAD IDEA?
	const arrayOfTargetLayers = operationalLayers;
	const operationalLayersArray = [];

	const thing = arrayOfTargetLayers.map((layer) => {
		if (layer.type === 'group') {
			const operationalLayers = layer.layers.items;

			const groupLayerParameters = {
				title: layer.title,
				layerType: 'GroupLayer',
				effect: getLayerEffect({ layer, config }),
				layers: createOperationalLayersForExport({ operationalLayers, config }),
				visibility: layer.visible,
				minScale: layer.minScale,
				maxScale: layer.maxScale,
				visibilityTimeExtent: layer.visibilityTimeExtent,
			};

			return groupLayerParameters;
		}

		const newLayerParameters = {
			title: layer.title,
			layerType: getLayerType({ layer, config }),
			itemId: layer.portalItem.id,
			url: layer.url,
			blendMode: layer?.blendMode || 'normal',
			interpolation: getLayerInterpolation({ layer, config }) || '',
			effect: getLayerEffect({ layer, config }),
			layerDefinition: {
				drawingInfo: {
					renderer: layer?.renderer,
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

	return thing;
};

const getLayerType = ({ layer, config }) => {
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

const createMapExportDefinition = (config, map, exportUI_HTML) => {
	const exportForm_textFields = exportUI_HTML.querySelectorAll('textarea');
	const basemapInfo = createBaseMapLayersDefinitions(map.map.basemap, config);

	const operationalLayers = map.map.layers;
	operationalLayers.items.splice(1, 1);
	const operationalLayersForExport = createOperationalLayersForExport({
		operationalLayers,
		config,
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
		});
	}
	// console.log('export ui event');
	// if (event.target.classList.contains('cancel')) {
	// 	exportUI_HTML.remove();
	// }

	// if (event.target.classList.contains('open-webmap')) {
	// 	exportUI_HTML.remove();
	// }
};

const createWebMap_process = async ({
	sendExportRequest,
	// mapDataForExport,
	userPortalData,
	createMapExportDefinition,
	config,
	exportUI_HTML,
	map,
}) => {
	const mapDataForExport = createMapExportDefinition(
		config,
		map,
		exportUI_HTML,
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
