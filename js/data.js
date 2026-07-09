import landformsJSON from '../landform.json' with { type: 'json' };
import landCoverJSON from '../landCover.json' with { type: 'json' };
import climateRegionJSON from '../climateRegion.json' with { type: 'json' };

let controller = new AbortController();

const arrayOfJSONs = [landformsJSON, landCoverJSON, climateRegionJSON];

const array_Of_JSON_ELUs = ({ arrayOfJSONs }) => {
	//expects an array of JSONs, that will be processed
	console.log(arrayOfJSONs);
	const arrayOfTitlesAndFeatures = arrayOfJSONs.map((json) => {
		return buildTitleAndFeatureNamesArray(json);
	});

	console.log(arrayOfTitlesAndFeatures);
	return arrayOfTitlesAndFeatures;
};

const buildTitleAndFeatureNamesArray = (object) => {
	//takes a JSON and creates a new object containing the JSON's 'title' and the 'elu' values in the 'items' properties.
	//JSON files must have 'title' and 'items' properties.
	//Based on a conversion with Charlie Frye, it was recommended that we use the simplified 'elu' values in place of the 'ef'

	const arrayOfAllELUs = object.items.map((entry) => {
		return entry.wte;
	});

	const uniqueELUsArray = {
		title: object.title,
		features: [...new Set(arrayOfAllELUs)],
	};
	return uniqueELUsArray;
};

const ELU_FeatureStrings = array_Of_JSON_ELUs({ arrayOfJSONs });
//is this a good name? It might be misleading.
const mapClickEventDelegation = ({
	event,
	config,
	sessionToken,
	DOM_id_class_variables,
	explorerLookupTable,
	showInvalidNotificationDiv,
	createNewCrosshairGraphic,
}) => {
	console.log(showInvalidNotificationDiv);
	console.log(`.${DOM_id_class_variables['dropDownClass']}`);
	console.log(
		event.target?.closest(`.${DOM_id_class_variables['dropDownClass']}`),
	);
	if (
		event.target?.closest(
			`#${DOM_id_class_variables['projection_containerDiv']}`,
		)
	) {
		return;
	}
	if (event.target?.closest(`.${DOM_id_class_variables['dropDownClass']}`)) {
		updateMapPixelsFromDropdown({
			event,
			config,
			sessionToken,
			explorerLookupTable,
			DOM_id_class_variables,
			showInvalidNotificationDiv,
			createNewCrosshairGraphic,
		});
		return;
	}
	if (
		event.target?.closest(`#${DOM_id_class_variables['explorer_containerDiv']}`)
	) {
		exploreMaps_SelectionProcess({
			event,
			config,
			sessionToken,
			DOM_id_class_variables,
			explorerLookupTable,
			showInvalidNotificationDiv,
			createNewCrosshairGraphic,
		});
		return;
	}
};

//not a good function name. This uses a conditional to find out which dropdown has been select. what choice in that dropdown has been selected and will then proceed to initiate the render process for the associated map and the main map.
const updateMapPixelsFromDropdown = ({
	event,
	config,
	sessionToken,
	explorerLookupTable,
	DOM_id_class_variables,
	showInvalidNotificationDiv,
	createNewCrosshairGraphic,
}) => {
	console.log('dropdown Choice!');
	console.log('the graphic function', showInvalidNotificationDiv);

	const explorerModeContainer = event.target?.closest(
		`#${DOM_id_class_variables['explorer_containerDiv']}`,
	);
	console.log(explorerModeContainer);
	const mainExplorerContainer = explorerModeContainer.querySelector(
		`#${DOM_id_class_variables['explorer_ecosystems']}`,
	);
	const dropDowns = explorerModeContainer.querySelectorAll(
		`.${DOM_id_class_variables['dropDownDisplayClass']}`,
	);
	const dropdownELUs = [];

	dropDowns.forEach((element) => {
		console.log(element.innerHTML);
		const selection = element.innerHTML;
		console.log(selection);
		// return selection;
		dropdownELUs.push(selection);
	});

	// console.log(dropdownELUs);

	const pixelValue = getPixelValueFromDropDown(
		dropdownELUs,
		explorerLookupTable,
	);

	console.log(pixelValue);
	if (event.target.closest(`#${landformsJSON['title']}`)) {
		const landformViewContainer = event.target.closest(
			`#${landformsJSON['title']}`,
		);

		const selectedLandform = event.target.attributes.value.value;
		const allLandformPixels = getLandformELUs({
			selectedLandform,
			explorerLookupTable,
		});

		console.log(allLandformPixels);

		updateLandformPixelSelection(
			landformViewContainer,
			config,
			allLandformPixels,
			DOM_id_class_variables,
		);
	}

	if (event.target.closest(`#${landCoverJSON['title']}`)) {
		const landCoverViewContainer = event.target.closest(
			`#${landCoverJSON['title']}`,
		);

		const selectedLandCover = event.target.attributes.value.value;

		const allLandCoverPixels = getLandCoverELUs({
			selectedLandCover,
			explorerLookupTable,
		});

		console.log(allLandCoverPixels);

		updateLandCoverPixelSelection(
			landCoverViewContainer,
			config,
			allLandCoverPixels,
			DOM_id_class_variables,
		);
	}

	if (event.target.closest(`#${climateRegionJSON['title']}`)) {
		const climateRegionViewContainer = event.target.closest(
			`#${climateRegionJSON['title']}`,
		);

		const selectedClimateRegion = event.target.attributes.value.value;

		const allClimateRegionPixels = getClimateRegionELUs({
			selectedClimateRegion,
			explorerLookupTable,
		});

		console.log(allClimateRegionPixels);

		updateClimateRegionPixelSelection(
			climateRegionViewContainer,
			config,
			allClimateRegionPixels,
			DOM_id_class_variables,
		);
	}

	explorer_mainView_pixelSelection({
		config,
		// sessionToken,
		mainExplorerContainer,
		pixelValue,
		// event,
		// ELU__url,
		showInvalidNotificationDiv,
		DOM_id_class_variables,
		createNewCrosshairGraphic,
	});
};

const exploreMaps_SelectionProcess = async ({
	event,
	config,
	sessionToken,
	DOM_id_class_variables,
	explorerLookupTable,
	showInvalidNotificationDiv,
	createNewCrosshairGraphic,
	previousMapPoint,
	mapViewElement,
}) => {
	try {
		const explorerViewsContainer =
			event?.target.closest('#explore') || mapViewElement.closest('#explore');
		console.log('This is the explorerViewContainer?', explorerViewsContainer);
		console.log(
			explorerViewsContainer.querySelector(
				`#${DOM_id_class_variables['explorer_ecosystems']}`,
			),
		);
		const mainExplorerContainer = explorerViewsContainer.querySelector(
			`#${DOM_id_class_variables['explorer_ecosystems']}`,
		);
		const explorerMainMapView = mainExplorerContainer.view;
		const explorerMainMap = event?.target.map || explorerMainMapView.map;
		const landformViewContainer = explorerViewsContainer.querySelector(
			`#${landformsJSON['title']}`,
		);
		const landCoverViewContainer = explorerViewsContainer.querySelector(
			`#${landCoverJSON['title']}`,
		);
		const climateRegionViewContainer = explorerViewsContainer.querySelector(
			`#${climateRegionJSON['title']}`,
		);
		const ELU__url = config.dependencies__exploreLayer.url;

		const mapPoint =
			previousMapPoint || event?.detail.mapPoint.clone().normalize();
		const wteLayer = explorerMainMap.layers.items[0].layers.items.find(
			(layer) => {
				console.log(layer);
				if (layer.portalItem.id === config.dependencies__exploreLayer.itemId) {
					return layer;
				}
			},
		);

		const mainExplorerViewPixel = await identifyMainExplorerViewPixel(
			ELU__url,
			sessionToken,
			mapPoint,
			wteLayer,
		);

		console.log(
			'the PIXEL VALUE FROM THE SELECTION PROCESS',
			mainExplorerViewPixel,
		);
		// console.log(createNewCrosshairGraphic);
		if (mainExplorerViewPixel.value == null) {
			showInvalidNotificationDiv({ DOM_id_class_variables });
			return;
		}
		// createNewCrosshairGraphic({ mapPoint, explorerMainMapView });

		const pixelValue = mainExplorerViewPixel.value[0];
		console.log(pixelValue);

		//this is designed for the 2015 ELUs service
		// const eluAttributes = pixelValueAsELUs(pixelValue, explorerLookupTable);
		const eluAttributes = pixelValueAsWTEs(pixelValue, explorerLookupTable);

		//this is designed for the 2015 WTEs service
		// const wte_attributes = pixelValueAsWTEs(pixelValue, explorerLookupTable);

		//
		console.log('from the central map point process', eluAttributes);

		const allLandformPixels = getLandformELUs({
			eluAttributes,
			explorerLookupTable,
		});

		const allLandCoverPixelValues = getLandCoverELUs({
			eluAttributes,
			explorerLookupTable,
		});

		const allClimateRegionPixelValues = getClimateRegionELUs({
			eluAttributes,
			explorerLookupTable,
		});

		if (
			event?.target.id === DOM_id_class_variables['explorer_ecosystems'] ||
			previousMapPoint
		) {
			console.log(previousMapPoint, 'IS TRUE');
			explorer_mainView_pixelSelection({
				config,
				mapPoint,
				// sessionToken,
				mainExplorerContainer,
				eluAttributes,
				event,
				// ELU__url,
				showInvalidNotificationDiv,
				createNewCrosshairGraphic,
			});

			updateLandformPixelSelection(
				landformViewContainer,
				config,
				allLandformPixels,
				DOM_id_class_variables,
			);
			updateLandCoverPixelSelection(
				landCoverViewContainer,
				config,
				allLandCoverPixelValues,
				DOM_id_class_variables,
			);
			updateClimateRegionPixelSelection(
				climateRegionViewContainer,
				config,
				allClimateRegionPixelValues,
				DOM_id_class_variables,
			);
		}

		if (event?.target.id === landformsJSON['title']) {
			try {
				await updateLandformPixelSelection(
					landformViewContainer,
					config,
					allLandformPixels,
					DOM_id_class_variables,
				);
				updateMapPixelsFromMiniMap({
					event,
					config,
					explorerLookupTable,
					DOM_id_class_variables,
					showInvalidNotificationDiv,
					createNewCrosshairGraphic,
				});
			} catch (error) {
				console.log(
					'error updating raster functions for the landform pixels before updating main map',
					error,
				);
			}
		}

		if (event?.target.id === landCoverJSON['title']) {
			try {
				await updateLandCoverPixelSelection(
					landCoverViewContainer,
					config,
					allLandCoverPixelValues,
					DOM_id_class_variables,
				);

				updateMapPixelsFromMiniMap({
					event,
					config,
					explorerLookupTable,
					DOM_id_class_variables,
					showInvalidNotificationDiv,
					createNewCrosshairGraphic,
				});
			} catch (error) {
				console.log(
					'error updating raster functions for the land cover pixels before updating main map',
					error,
				);
			}
		}

		if (event?.target.id === climateRegionJSON['title']) {
			try {
				await updateClimateRegionPixelSelection(
					climateRegionViewContainer,
					config,
					allClimateRegionPixelValues,
					DOM_id_class_variables,
				);

				updateMapPixelsFromMiniMap({
					event,
					config,
					explorerLookupTable,
					DOM_id_class_variables,
					showInvalidNotificationDiv,
					createNewCrosshairGraphic,
				});
			} catch (error) {
				console.log(
					'error updating raster functions for the climate region pixels before updating main map',
					error,
				);
			}
			// updateMainViewFromMiniMapProcess(event,config, explorerLookupTable)
		}
	} catch (error) {
		console.log(
			'Encountered error processing the click event for updating the render functions of one of the explorer-oriented maps',
			error,
		);
	}
};

const updateMapPixelsFromMiniMap = ({
	event,
	config,
	explorerLookupTable,
	DOM_id_class_variables,
	showInvalidNotificationDiv,
	createNewCrosshairGraphic,
}) => {
	console.log('from the minimap event!!!', showInvalidNotificationDiv);
	const explorerModeContainer = event.target?.closest(
		`#${DOM_id_class_variables['explorer_containerDiv']}`,
	);
	console.log(explorerModeContainer);
	const mainExplorerContainer = explorerModeContainer.querySelector(
		`#${DOM_id_class_variables['explorer_ecosystems']}`,
	);
	const dropDowns = explorerModeContainer.querySelectorAll(
		`.${DOM_id_class_variables['dropDownDisplayClass']}`,
	);
	const dropdownELUs = [];

	dropDowns.forEach((element) => {
		console.log(element.innerHTML);
		const selection = element.innerHTML;
		console.log(selection);
		// return selection;
		dropdownELUs.push(selection);
	});

	// console.log(dropdownELUs);

	const pixelValue = getPixelValueFromDropDown(
		dropdownELUs,
		explorerLookupTable,
	);
	console.log('THE PIXEL VALUE FROM THE DROPDOWN COMPONENTS', pixelValue);
	explorer_mainView_pixelSelection({
		config,
		// sessionToken,
		mainExplorerContainer,
		pixelValue,
		// event,
		// ELU__url,
		showInvalidNotificationDiv,
		DOM_id_class_variables,
		createNewCrosshairGraphic,
	});
};

const updateLandformPixelSelection = async (
	landformViewContainer,
	config,
	allLandformPixels,
	DOM_id_class_variables,
) => {
	try {
		let highlightLayer;
		const dropdownSelection = landformViewContainer.querySelector(
			`.${DOM_id_class_variables['dropDownDisplayClass']}`,
		);

		const eluData = allLandformPixels;

		const newRasterFunction = await createColorMap({ eluData });

		landformViewContainer.view.map.layers.items[0].layers.items.find(
			(layer) => {
				if (layer.title === config.dependencies__exploreLayer.title) {
					highlightLayer = layer;
					return;
				}
			},
		);

		dropdownSelection.innerHTML = eluData[0].attributes.LandFrmCls;
		dropdownSelection.classList.remove(
			DOM_id_class_variables['dropDownPlaceHolderClass'],
		);

		highlightLayer.renderer = null;
		highlightLayer.rasterFunction = newRasterFunction;
	} catch (error) {
		console.log('error updating landform raster function', error);
	}
};

const updateLandCoverPixelSelection = async (
	landCoverViewContainer,
	config,
	allLandCoverPixelValues,
	DOM_id_class_variables,
) => {
	try {
		let highlightLayer;
		const dropdownSelection = landCoverViewContainer.querySelector(
			`.${DOM_id_class_variables['dropDownDisplayClass']}`,
		);

		const eluData = allLandCoverPixelValues;

		const newRasterFunction = await createColorMap({ eluData });

		landCoverViewContainer.view.map.layers.items[0].layers.items.find(
			(layer) => {
				if (layer.title === config.dependencies__exploreLayer.title) {
					highlightLayer = layer;
					return;
				}
			},
		);

		dropdownSelection.innerHTML = eluData[0].attributes.LandCovCls;
		dropdownSelection.classList.remove(
			DOM_id_class_variables['dropDownPlaceHolderClass'],
		);

		highlightLayer.renderer = null;
		highlightLayer.rasterFunction = newRasterFunction;
	} catch (error) {
		console.log('error updating land cover raster function', error);
	}
};

const updateClimateRegionPixelSelection = async (
	climateRegionViewContainer,
	config,
	allClimateRegionPixelValues,
	DOM_id_class_variables,
) => {
	try {
		let highlightLayer;
		const dropdownSelection = climateRegionViewContainer.querySelector(
			`.${DOM_id_class_variables['dropDownDisplayClass']}`,
		);

		const eluData = allClimateRegionPixelValues;

		const newRasterFunction = await createColorMap({ eluData });

		climateRegionViewContainer.view.map.layers.items[0].layers.items.find(
			(layer) => {
				if (layer.title === config.dependencies__exploreLayer.title) {
					highlightLayer = layer;
					return;
				}
			},
		);
		dropdownSelection.innerHTML = eluData[0].attributes.BioClimCls;
		dropdownSelection.classList.remove(
			DOM_id_class_variables['dropDownPlaceHolderClass'],
		);

		highlightLayer.renderer = null;
		highlightLayer.rasterFunction = newRasterFunction;
	} catch (error) {
		console.log('error updating climate region raster function', error);
	}
};

const getAttributeTable = async (url, token) => {
	//TOKEN ISSUE? USE PROXY APP?
	const fetchAttributeTable = fetch(
		`${url}/rasterAttributeTable?token=${token}&f=pjson`,
	);
	const attributeTableReturn = await fetchAttributeTable;
	const attributeTable = await attributeTableReturn.json();

	return attributeTable;
};

const identifyMainExplorerViewPixel = async (
	url,
	sessionToken,
	mapPoint,
	wteLayer,
) => {
	console.log(mapPoint);
	console.log(wteLayer);
	try {
		const mapPointIdentify = await wteLayer.identify(mapPoint);
		console.log(mapPointIdentify);

		return mapPointIdentify;
	} catch (error) {
		console.log(error);
	}
	//this is an identify run on the layer itself.

	//This was an older version of identify on a dependencies rest endpoint.
	// const identifyParams = {
	// 	geometry: JSON.stringify(mapPoint),
	// 	geometryType: 'esriGeometryPoint',
	// 	returnPixelValues: true,
	// 	// token: user.token,
	// 	f: 'pjson',
	// };
	// try {
	// 	const WTE2015IdentifyPixel = await fetch(
	// 		`${url}/identify?token=${sessionToken}&${new URLSearchParams(identifyParams).toString()}`,
	// 	);

	// 	const identifyJSON = await WTE2015IdentifyPixel.json();

	// 	console.log(identifyJSON);

	// 	return identifyJSON;
	// } catch (error) {
	// 	console.log('error searching for pixel value attributes', error);
	// }
};

const getLandformELUs = ({
	eluAttributes,
	selectedLandform,
	explorerLookupTable,
}) => {
	const landFormELU_string =
		selectedLandform || eluAttributes[0]?.attributes.LandFrmCls;
	// selectedLandform || eluAttributes[0]?.attributes.ELU_LF_Des;

	const array_LandformStringPixelsData = explorerLookupTable.features.filter(
		(feature) => feature.attributes.LandFrmCls === landFormELU_string,
	);

	return array_LandformStringPixelsData;
};

const getLandCoverELUs = ({
	eluAttributes,
	selectedLandCover,
	explorerLookupTable,
}) => {
	const landCoverELU_string =
		selectedLandCover || eluAttributes[0]?.attributes?.LandCovCls;
	// selectedLandCover || eluAttributes[0]?.attributes?.ELU_GLC_De;

	const array_LandCoverStringPixelsData = explorerLookupTable.features.filter(
		(feature) => feature.attributes.LandCovCls === landCoverELU_string,
	);

	return array_LandCoverStringPixelsData;
};

const getClimateRegionELUs = ({
	eluAttributes,
	selectedClimateRegion,
	explorerLookupTable,
}) => {
	const climateRegionELU_string =
		selectedClimateRegion || eluAttributes[0]?.attributes.BioClimCls;
	// selectedClimateRegion || eluAttributes[0]?.attributes.ELU_Bio_De;

	const array_climateRegionStringPixelsData =
		explorerLookupTable.features.filter(
			(feature) => feature.attributes.BioClimCls === climateRegionELU_string,
		);

	return array_climateRegionStringPixelsData;
};

const pixelValueAsWTEs = (pixelValue, explorerLookupTable) => {
	console.log(pixelValue);
	console.log(explorerLookupTable);
	const wteAttributes = explorerLookupTable.features.find(
		(tableFeatureEntry) => {
			if (tableFeatureEntry.attributes.Value == pixelValue) {
				return tableFeatureEntry;
			}
		},
	);

	console.log(wteAttributes);
	const allWTEs = explorerLookupTable.features.filter((feature) => {
		if (
			feature.attributes.BioClimCls === wteAttributes.attributes.BioClimCls &&
			feature.attributes.LandCovCls === wteAttributes.attributes.LandCovCls &&
			feature.attributes.LandFrmCls === wteAttributes.attributes.LandFrmCls
		) {
			console.log('all three');
			return feature;
		}
	});

	console.log('all the WTE', allWTEs);

	return allWTEs;
};

const pixelValueAsELUs = (pixelValue, explorerLookupTable) => {
	const eluAttributes = explorerLookupTable.features.find(
		(tableFeatureEntry) => {
			if (tableFeatureEntry.attributes.Value == pixelValue) {
				return tableFeatureEntry;
			}
		},
	);

	const allELUs = explorerLookupTable.features.filter((feature) => {
		// console.log(eluAttributes);
		if (
			feature.attributes.ELU_Bio_De === eluAttributes.attributes.ELU_Bio_De &&
			feature.attributes.ELU_GLC_De === eluAttributes.attributes.ELU_GLC_De &&
			feature.attributes.ELU_LF_Des === eluAttributes.attributes.ELU_LF_Des
		) {
			console.log('all three');
			return feature;
		}
	});

	console.log(allELUs);

	return allELUs;
};

const getPixelValueFromDropDown = (dropdownELUs, explorerLookupTable) => {
	console.log(dropdownELUs);
	const ELU_pixelValue = explorerLookupTable.features.filter((feature) => {
		// console.log('landform', feature.attributes.ELU_LF_Des === dropdownELUs[0]);
		// console.log(
		// 	'Land cover',
		// 	feature.attributes.ELU_GLC_De === dropdownELUs[1],
		// );
		// console.log(
		// 	'bio climate',
		// 	feature.attributes.ELU_Bio_De === dropdownELUs[2],
		// );

		if (
			feature.attributes.LandFrmCls == dropdownELUs[0] &&
			feature.attributes.LandCovCls == dropdownELUs[1] &&
			feature.attributes.BioClimCls == dropdownELUs[2]
		) {
			return feature;
		}
	});

	console.log(ELU_pixelValue);

	return ELU_pixelValue;
};

const createColorMap = async ({ pixelInfo, eluData }) => {
	try {
		console.log('the ELU', eluData);
		console.log('the Pixel', pixelInfo);
		console.log('the Pixel length', pixelInfo?.length);
		console.log('the Pixel', pixelInfo === true);
		const [RasterFunctionUtils] = await $arcgis.import([
			'@arcgis/core/layers/support/rasterFunctionUtils.js',
		]);

		//even if this is a blank array it's still triggering this condition.
		if (pixelInfo?.length > 0) {
			const eluColorMaps = pixelInfo.map((features) => {
				return [
					features.attributes.Value,
					features.attributes.Red,
					features.attributes.Green,
					features.attributes.Blue,
				];
			});

			console.log(
				'colorMaps for all occurrences of the pixels string',
				eluColorMaps,
			);
			const colormap = RasterFunctionUtils.colormap({
				//this doesn't address if there are multiple value
				colormap: eluColorMaps,
			});

			return colormap;
		}

		if (eluData) {
			const eluColorMaps = eluData.map((features) => {
				return [
					features.attributes.Value,
					features.attributes.Red,
					features.attributes.Green,
					features.attributes.Blue,
				];
			});

			console.log(
				'colorMaps for all occurrences of the ELU string',
				eluColorMaps,
			);
			const colormap = RasterFunctionUtils.colormap({
				//this doesn't address if there are multiple value
				colormap: eluColorMaps,
			});

			return colormap;
		}

		if (pixelInfo == false || eluData == false) {
			console.log('the false pixel value');
			const noResultRasterFunction = RasterFunctionUtils.remap({
				rangeMaps: [{ range: [0, 0], output: 0, allowUnmatched: false }],
			});

			// createNoResultRasterFunction();

			return noResultRasterFunction;
		}
	} catch (error) {
		console.log('issue encountered during colormap construction', error);
	}
};
const explorer_mainView_pixelSelection = async ({
	config,
	mapPoint,
	// sessionToken,
	mainExplorerContainer,
	eluAttributes,
	pixelValue,
	// event,
	// ELU__url,
	showInvalidNotificationDiv,
	DOM_id_class_variables,
	createNewCrosshairGraphic,
}) => {
	try {
		// const url = config.dependencies__exploreLayer.url;

		let previousPixelLayer;

		const explorerMainMapView = mainExplorerContainer.view;

		console.log(explorerMainMapView);
		explorerMainMapView.map.layers.items[0].layers.items.find((layer) => {
			// console.log(layer.title);
			if (layer.portalItem.id === config.dependencies__exploreLayer.itemId) {
				previousPixelLayer = layer;
				return;
			}
			//this conditional will return the first layer from the config file's 'group' layer. In this case it's for the imagery layer
			// if (layer.title === config.operationalLayers[0].layers[0]['title']) {
			// 	imageryLayer = layer;
			// 	return;
			// } else return false;
		});

		//THIS IS THE PROBLEM?

		const pixelInfo = pixelValue || eluAttributes;

		const colormap = await createColorMap({
			pixelInfo,
		});

		previousPixelLayer.renderer = null;
		previousPixelLayer.rasterFunction = colormap;

		if (pixelInfo == false) {
			showInvalidNotificationDiv({ DOM_id_class_variables });
			createNewCrosshairGraphic({ explorerMainMapView, pixelInfo });
		}
		createNewCrosshairGraphic({ mapPoint, explorerMainMapView });
	} catch (error) {
		console.log(
			'error adding the rasterFunction to the main explorer view component',
			error,
		);
	}
};

export {
	ELU_FeatureStrings,
	getAttributeTable,
	mapClickEventDelegation,
	exploreMaps_SelectionProcess,
};
