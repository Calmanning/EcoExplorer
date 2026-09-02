import landformsJSON from '../landform.json' with { type: 'json' };
import landCoverJSON from '../landCover.json' with { type: 'json' };
import climateRegionJSON from '../climateRegion.json' with { type: 'json' };
import WTE_statistics from '../WTE_statistics.json' with { type: 'json' };

let controller = new AbortController();

const arrayOfJSONs = [climateRegionJSON, landCoverJSON, landformsJSON];

const array_Of_JSON_ELUs = ({ arrayOfJSONs }) => {
	//expects an array of JSONs, that will be processed
	const arrayOfTitlesAndFeatures = arrayOfJSONs.map((json) => {
		return buildTitleAndFeatureNamesArray(json);
	});

	return arrayOfTitlesAndFeatures;
};

const buildTitleAndFeatureNamesArray = (object) => {
	//takes a JSON and creates a new object containing the JSON's 'title' and the 'elu' values in the 'items' properties.
	//JSON files must have 'title' and 'items' properties.
	//Based on a conversion with Charlie Frye, it was recommended that we use the simplified 'elu' values in place of the 'ef'

	const arrayOfAllELUs = object.items.map((entry) => {
		const featureCategory = {
			id: entry.id,
			wte: entry.wte,
			tooltip: entry.tooltip,
		};
		return featureCategory;
	});

	const uniqueELUsArray = {
		title: object.title,
		elementID: object.elementID,
		tooltip: object.tooltip,
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
	getString,
}) => {
	console.log(getString);
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
			getString,
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
			getString,
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
	getString,
}) => {
	const explorerModeContainer = event.target?.closest(
		`#${DOM_id_class_variables['explorer_containerDiv']}`,
	);
	const mainExplorerContainer = explorerModeContainer.querySelector(
		`#${DOM_id_class_variables['explorer_ecosystems']}`,
	);
	const dropDowns = explorerModeContainer.querySelectorAll(
		`.${DOM_id_class_variables['dropDownDisplayClass']}`,
	);
	const dropdownELUs = [];
	const miniMapELUs = {};

	dropDowns.forEach((element) => {
		const selection = element.innerHTML;
		console.log(element);
		const selectedValue = element.attributes.value.value;
		const category = element.closest('arcgis-map').id;

		// return selection;
		dropdownELUs.push(selectedValue);
		miniMapELUs[`${category}`] = selectedValue;
	});

	const pixelValue = getPixelValueFromDropDown(
		miniMapELUs,
		explorerLookupTable,
	);

	if (event.target.closest(`#${landformsJSON['elementID']}`)) {
		const landformViewContainer = event.target.closest(
			`#${landformsJSON['elementID']}`,
		);

		console.log(
			'the value of the dropdown selection',
			event.target.attributes['data-id'].value,
		);
		console.log(event.target.attributes);
		const selectedLandFormID = event.target.attributes['data-id'].value;
		const selectedLandform = event.target.attributes.value.value;
		const allLandformPixels = getLandformELUs({
			selectedLandform,
			explorerLookupTable,
		});

		updateLandformPixelSelection(
			landformViewContainer,
			config,
			allLandformPixels,
			DOM_id_class_variables,
			getString,
		);
	}

	if (event.target.closest(`#${landCoverJSON['elementID']}`)) {
		const landCoverViewContainer = event.target.closest(
			`#${landCoverJSON['elementID']}`,
		);

		const selectedLandCover = event.target.attributes.value.value;

		const allLandCoverPixels = getLandCoverELUs({
			selectedLandCover,
			explorerLookupTable,
		});

		updateLandCoverPixelSelection(
			landCoverViewContainer,
			config,
			allLandCoverPixels,
			DOM_id_class_variables,
			getString,
		);
	}

	if (event.target.closest(`#${climateRegionJSON['elementID']}`)) {
		const climateRegionViewContainer = event.target.closest(
			`#${climateRegionJSON['elementID']}`,
		);

		const selectedClimateRegion = event.target.attributes.value.value;

		const allClimateRegionPixels = getClimateRegionELUs({
			selectedClimateRegion,
			explorerLookupTable,
		});

		updateClimateRegionPixelSelection(
			climateRegionViewContainer,
			config,
			allClimateRegionPixels,
			DOM_id_class_variables,
			getString,
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
	getString,
}) => {
	console.log('DOING A MAP THING');
	try {
		const explorerViewsContainer =
			event?.target.closest('#explore') || mapViewElement.closest('#explore');

		const mainExplorerContainer = explorerViewsContainer.querySelector(
			`#${DOM_id_class_variables['explorer_ecosystems']}`,
		);
		const explorerMainMapView = mainExplorerContainer.view;
		const explorerMainMap = event?.target.map || explorerMainMapView.map;
		const landformViewContainer = explorerViewsContainer.querySelector(
			`#${landformsJSON['elementID']}`,
		);
		const landCoverViewContainer = explorerViewsContainer.querySelector(
			`#${landCoverJSON['elementID']}`,
		);
		const climateRegionViewContainer = explorerViewsContainer.querySelector(
			`#${climateRegionJSON['elementID']}`,
		);
		const ELU__url = config.dependencies__exploreLayer.url;

		const mapPoint =
			previousMapPoint || event?.detail.mapPoint.clone().normalize();
		const wteLayer = explorerMainMap.layers.items[0].layers.items.find(
			(layer) => {
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

		if (mainExplorerViewPixel.value == null) {
			showInvalidNotificationDiv({ DOM_id_class_variables });
			return;
		}

		const pixelValue = mainExplorerViewPixel.value[0];

		const eluAttributes = pixelValueAsWTEs(pixelValue, explorerLookupTable);
		console.log('the map selection ELUs', eluAttributes);
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
				getString,
			);
			updateLandCoverPixelSelection(
				landCoverViewContainer,
				config,
				allLandCoverPixelValues,
				DOM_id_class_variables,
				getString,
			);
			updateClimateRegionPixelSelection(
				climateRegionViewContainer,
				config,
				allClimateRegionPixelValues,
				DOM_id_class_variables,
				getString,
			);
		}

		if (event?.target.id === landformsJSON['elementID']) {
			try {
				await updateLandformPixelSelection(
					landformViewContainer,
					config,
					allLandformPixels,
					DOM_id_class_variables,
					getString,
				);
				updateMapPixelsFromMiniMap({
					event,
					config,
					explorerLookupTable,
					DOM_id_class_variables,
					showInvalidNotificationDiv,
					createNewCrosshairGraphic,
					getString,
				});
			} catch (error) {
				console.log(
					'error updating raster functions for the landform pixels before updating main map',
					error,
				);
			}
		}

		if (event?.target.id === landCoverJSON['elementID']) {
			try {
				await updateLandCoverPixelSelection(
					landCoverViewContainer,
					config,
					allLandCoverPixelValues,
					DOM_id_class_variables,
					getString,
				);

				updateMapPixelsFromMiniMap({
					event,
					config,
					explorerLookupTable,
					DOM_id_class_variables,
					showInvalidNotificationDiv,
					createNewCrosshairGraphic,
					getString,
				});
			} catch (error) {
				console.log(
					'error updating raster functions for the land cover pixels before updating main map',
					error,
				);
			}
		}

		if (event?.target.id === climateRegionJSON['elementID']) {
			try {
				await updateClimateRegionPixelSelection(
					climateRegionViewContainer,
					config,
					allClimateRegionPixelValues,
					DOM_id_class_variables,
					getString,
				);

				updateMapPixelsFromMiniMap({
					event,
					config,
					explorerLookupTable,
					DOM_id_class_variables,
					showInvalidNotificationDiv,
					createNewCrosshairGraphic,
					getString,
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
	getString,
}) => {
	console.log('UPDATING MAIN PIXEL');
	const mapPoint = event.detail.mapPoint.clone().normalize();
	const explorerModeContainer = event.target?.closest(
		`#${DOM_id_class_variables['explorer_containerDiv']}`,
	);

	const mainExplorerContainer = explorerModeContainer.querySelector(
		`#${DOM_id_class_variables['explorer_ecosystems']}`,
	);
	//This is where the error occurs?
	const dropDowns = explorerModeContainer.querySelectorAll(
		`.${DOM_id_class_variables['dropDownDisplayClass']}`,
	);
	const dropdownELUs = [];
	const miniMapELUs = {};

	dropDowns.forEach((element) => {
		console.log('the dropdown value', element.innerHTML);
		const selection = element.attributes.value.value;
		const category = element.closest('arcgis-map').id;

		console.log(category);
		dropdownELUs.push(selection);
		miniMapELUs[`${category}`] = selection;
	});

	// console.log(dropdownELUs);
	console.log(miniMapELUs);
	const pixelValue = getPixelValueFromDropDown(
		miniMapELUs,
		explorerLookupTable,
	);

	explorer_mainView_pixelSelection({
		config,
		mapPoint,
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
	getString,
) => {
	try {
		let highlightLayer;
		console.log(landformViewContainer);
		const dropdownSelection = landformViewContainer.querySelector(
			`.${DOM_id_class_variables['dropDownDisplayClass']}`,
		);

		const selectedTooltip =
			landformViewContainer.querySelector(`.selected-tooltip`);

		const eluData = allLandformPixels;
		console.log(eluData[0].attributes.LandFrmCls);

		const newRasterFunction = await createColorMap({ eluData });

		landformViewContainer.view.map.layers.items[0].layers.items.find(
			(layer) => {
				if (layer.title === config.dependencies__exploreLayer.title) {
					highlightLayer = layer;
					layer.renderer = null;
					layer.rasterFunction = newRasterFunction;

					return;
				}
			},
		);

		const featureEntry = landformsJSON.items.find((featureEntry) => {
			return featureEntry.wte == eluData[0].attributes.LandFrmCls.trim();
		});

		const tooltipDiv = document.createElement('div');

		const tooltipHTML = ` 
    <calcite-icon id="${featureEntry.wte}-tooltip" icon="information" scale="s"></calcite-icon>
		   <calcite-tooltip reference-element="${featureEntry.wte}-tooltip">
		     <span>${getString(featureEntry['wte'].trim() + '__tooltip')}</span>
		   </calcite-tooltip>
		   `;
		tooltipDiv.innerHTML = tooltipHTML;
		selectedTooltip.firstElementChild?.remove();
		selectedTooltip.append(tooltipDiv);

		dropdownSelection.innerHTML = getString(featureEntry.wte);
		dropdownSelection.setAttribute('value', featureEntry.wte);

		// landformViewContainer.view.map.layers.items[0].layers.items.find(
		// 	(layer) => {
		// 		if (layer.title === config.dependencies__exploreLayer.title) {
		// 			highlightLayer = layer;
		// 			return;
		// 		}
		// 	},
		// );

		dropdownSelection.innerHTML = eluData[0].attributes.LandFrmCls;
		// dropdownSelection.classList.remove(
		// 	DOM_id_class_variables['dropDownPlaceHolderClass'],
		// );

		// highlightLayer.renderer = null;
		// highlightLayer.rasterFunction = newRasterFunction;
	} catch (error) {
		console.log('error updating landform raster function', error);
	}
};

const updateLandCoverPixelSelection = async (
	landCoverViewContainer,
	config,
	allLandCoverPixelValues,
	DOM_id_class_variables,
	getString,
) => {
	try {
		let highlightLayer;
		const dropdownSelection = landCoverViewContainer.querySelector(
			`.${DOM_id_class_variables['dropDownDisplayClass']}`,
		);

		const selectedTooltip =
			landCoverViewContainer.querySelector(`.selected-tooltip`);

		const eluData = allLandCoverPixelValues;

		const newRasterFunction = await createColorMap({ eluData });

		landCoverViewContainer.view.map.layers.items[0].layers.items.find(
			(layer) => {
				if (layer.title === config.dependencies__exploreLayer.title) {
					highlightLayer = layer;
					layer.renderer = null;
					layer.rasterFunction = newRasterFunction;

					return;
				}
			},
		);

		const featureEntry = landCoverJSON.items.find((featureEntry) => {
			return featureEntry.wte == eluData[0].attributes.LandCovCls.trim();
		});

		console.log(eluData);
		console.log(featureEntry);
		const tooltipDiv = document.createElement('div');

		const tooltipHTML = ` 
    <calcite-icon id="${featureEntry.wte}-tooltip" icon="information" scale="s"></calcite-icon>
		   <calcite-tooltip reference-element="${featureEntry.wte}-tooltip">
		     <span>${getString(featureEntry['wte'].trim() + '__tooltip')}</span>
		   </calcite-tooltip>
		   `;
		tooltipDiv.innerHTML = tooltipHTML;
		selectedTooltip.firstElementChild?.remove();
		selectedTooltip.append(tooltipDiv);

		dropdownSelection.innerHTML = getString(featureEntry.wte);
		dropdownSelection.setAttribute('value', featureEntry.wte);
	} catch (error) {
		console.log('error updating land cover raster function', error);
	}
};

const updateClimateRegionPixelSelection = async (
	climateRegionViewContainer,
	config,
	allClimateRegionPixelValues,
	DOM_id_class_variables,
	getString,
) => {
	try {
		let highlightLayer;
		const dropdownSelection = climateRegionViewContainer.querySelector(
			`.${DOM_id_class_variables['dropDownDisplayClass']}`,
		);

		const selectedTooltip =
			climateRegionViewContainer.querySelector(`.selected-tooltip`);

		const eluData = allClimateRegionPixelValues;

		const newRasterFunction = await createColorMap({ eluData });

		climateRegionViewContainer.view.map.layers.items[0].layers.items.find(
			(layer) => {
				if (layer.title === config.dependencies__exploreLayer.title) {
					highlightLayer = layer;
					layer.renderer = null;
					layer.rasterFunction = newRasterFunction;

					return;
				}
			},
		);

		const featureEntry = climateRegionJSON.items.find((featureEntry) => {
			return featureEntry.wte == eluData[0].attributes.BioClimCls.trim();
		});

		const tooltipDiv = document.createElement('div');

		const tooltipHTML = ` 
    <calcite-icon id="${featureEntry.wte}-tooltip" icon="information" scale="s"></calcite-icon>
		   <calcite-tooltip reference-element="${featureEntry.wte}-tooltip">
		     <span>${getString(featureEntry['wte'].trim() + '__tooltip')}</span>
		   </calcite-tooltip>
		   `;
		tooltipDiv.innerHTML = tooltipHTML;
		selectedTooltip.firstElementChild?.remove();
		selectedTooltip.append(tooltipDiv);

		dropdownSelection.innerHTML = getString(featureEntry.wte);
		dropdownSelection.setAttribute('value', featureEntry.wte);

		// climateRegionViewContainer.view.map.layers.items[0].layers.items.find(
		// 	(layer) => {
		// 		if (layer.title === config.dependencies__exploreLayer.title) {
		// 			highlightLayer = layer;
		// 			return;
		// 		}
		// 	},
		// );
		// dropdownSelection.classList.remove(
		// 	DOM_id_class_variables['dropDownPlaceHolderClass'],
		// );

		// highlightLayer.renderer = null;
		// highlightLayer.rasterFunction = newRasterFunction;
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
	try {
		const mapPointIdentify = await wteLayer.identify(mapPoint);

		return mapPointIdentify;
	} catch (error) {
		console.log(error);
	}
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

	const array_climateRegionStringPixelsData =
		explorerLookupTable.features.filter(
			(feature) => feature.attributes.BioClimCls === climateRegionELU_string,
		);

	return array_climateRegionStringPixelsData;
};

const pixelValueAsWTEs = (pixelValue, explorerLookupTable) => {
	const wteAttributes = explorerLookupTable.features.find(
		(tableFeatureEntry) => {
			if (tableFeatureEntry.attributes.Value == pixelValue) {
				return tableFeatureEntry;
			}
		},
	);

	const allWTEs = explorerLookupTable.features.filter((feature) => {
		if (
			feature.attributes.BioClimCls === wteAttributes.attributes.BioClimCls &&
			feature.attributes.LandCovCls === wteAttributes.attributes.LandCovCls &&
			feature.attributes.LandFrmCls === wteAttributes.attributes.LandFrmCls
		) {
			return feature;
		}
	});

	return allWTEs;
};

const getPixelValueFromDropDown = (dropdownELUs, explorerLookupTable) => {
	const ELU_pixelValue = explorerLookupTable.features.filter((feature) => {
		//this is not a smart implementation. If this array changes order at all, this will break.
		if (
			feature.attributes.LandFrmCls == dropdownELUs.landform &&
			feature.attributes.LandCovCls == dropdownELUs.landCover &&
			feature.attributes.BioClimCls == dropdownELUs.climateRegion
		) {
			return feature;
		}
	});

	return ELU_pixelValue;
};

const createColorMap = async ({ pixelInfo, eluData }) => {
	try {
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

			const colormap = RasterFunctionUtils.colormap({
				//this doesn't address if there are multiple value
				colormap: eluColorMaps,
			});

			return colormap;
		}

		if (pixelInfo == false || eluData == false) {
			const noResultRasterFunction = RasterFunctionUtils.remap({
				rangeMaps: [{ range: [0, 0], output: 0, allowUnmatched: false }],
			});

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
		let previousPixelLayer;

		const explorerMainMapView = mainExplorerContainer.view;

		explorerMainMapView.map.layers.items[0].layers.items.find((layer) => {
			if (layer.portalItem.id === config.dependencies__exploreLayer.itemId) {
				previousPixelLayer = layer;
				return;
			}
		});

		const pixelInfo = pixelValue || eluAttributes;

		const colormap = await createColorMap({
			pixelInfo,
		});

		previousPixelLayer.renderer = null;
		previousPixelLayer.rasterFunction = colormap;

		if (pixelInfo == false) {
			const noPixelInfo = true;
			showInvalidNotificationDiv({ DOM_id_class_variables });
			createNewCrosshairGraphic({
				explorerMainMapView,
				noPixelInfo,
			});
		}
		createNewCrosshairGraphic({ mapPoint, explorerMainMapView });
	} catch (error) {
		console.log(
			'error adding the rasterFunction to the main explorer view component',
			error,
		);
	}
};

const projectionStatistics = (mode, filter, statisticsElement, getString) => {
	console.log(getString);
	console.log(mode, filter);
	const statArea = WTE_statistics[`${mode}__${filter}__area`];
	const statAreaPercent = WTE_statistics[`${mode}__${filter}__percent`];
	const statAreaPopulation = WTE_statistics[`${mode}__${filter}__population`];
	const statWorldPopulationPercent =
		WTE_statistics[`${mode}__${filter}__populationPercent`];

	const statisticValues = {
		statArea: statArea,
		statAreaPercent: statAreaPercent,
		statAreaPopulation: statAreaPopulation,
		statWorldPopulationPercent: statWorldPopulationPercent,
	};

	const dataString = getString('statisticsFooter', statisticValues);
	console.log(dataString);
	const statisticsDataString = getString('statisticsFooter', statisticValues);
	// const statisticsDataString = `<div><span>${statArea}km<sup>2</sup> (${statAreaPercent} of Earth's land area)</span><wbr>|<span>${statWorldPopulationPercent} of Earth's population (population: ${statAreaPopulation})</span></div>`;
	// const statisticsDataStringMobileFormat = `<div><span>${statArea}km<sup>2</sup></span></div> <div><span>(${statAreaPercent} of Earth's land area)</span></div> <div></div><span>${statWorldPopulationPercent} of Earth's population (population: ${statAreaPopulation})</span></div>`;
	// `<span>${statArea}km<sup>2</sup></span> | <span>${statAreaPercent} of Earth's land area</span> | <span>${statWorldPopulationPercent} of Earth's population (population: ${statAreaPopulation})</span>`;

	// statisticsElement.innerHTML = statisticsDataStringMobileFormat;
	statisticsElement.innerHTML = statisticsDataString;
};

export {
	ELU_FeatureStrings,
	getAttributeTable,
	mapClickEventDelegation,
	exploreMaps_SelectionProcess,
	projectionStatistics,
};
