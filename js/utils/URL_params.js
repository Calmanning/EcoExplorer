// const url = new URL(window.location.href);
let url = new URL(window.location.href);

// let viewModeParamsObj = {
// 	ext: '',
// 	zoom: '',
// 	mode: '',
// };

let hashParams = new URL(window.location.href).hash.slice(1);

const parseAndFormatURL = () => {
	console.log('calling the URL');
	let hashString = new URL(window.location.href).hash.slice(1);

	const params = processURLString(hashString);

	return params;
};

const processURLString = (hashString) => {
	let hashParamsArray = hashString.split('&');

	let viewModeParamsObj = {};

	if (hashParamsArray[0] !== '') {
		hashParamsArray.forEach((paramsPair) => {
			const [key, value] = paramsPair.split('=');
			viewModeParamsObj[key] = value;
		});
	} else {
		viewModeParamsObj.ext = '';
		viewModeParamsObj.zoom = '';
		viewModeParamsObj.mode = '';
	}

	return viewModeParamsObj;
};

// const formatNewExtentParams = ({ viewComponent }) => {
// 	const newParamObj = processURLString(window.location.hash.slice(1));

// 	newParamObj.ext = viewComponent?.extent
// 		? `${viewComponent?.extent?.center.longitude.toFixed(
// 				2,
// 			)},${viewComponent?.extent?.center.latitude.toFixed(2)}`
// 		: null;

// 	newParamObj.zoom = viewComponent?.zoom || null;

// 		return newParamObj;
// };

const formatExtentParametersAndUpdateHashParams = ({ viewComponent }) => {
	const viewParams = {
		ext: viewComponent?.extent
			? `${viewComponent?.extent?.center.longitude.toFixed(
					2,
				)},${viewComponent?.extent?.center.latitude.toFixed(2)}`
			: null,
		zoom: viewComponent?.zoom.toFixed(0) || null,
	};

	const newHashExtParamsObj = updateNewAppParams(viewParams);
	const newHashParamString = createNewHashParamsString(newHashExtParamsObj);

	updateHashParams(newHashParamString);
};

const updateChangeModelParam = ({ changeModelString }) => {
	const modelParam = {
		model: changeModelString,
	};

	const newHashModeParams = updateNewAppParams(modelParam);

	const newHashParamString = createNewHashParamsString(newHashModeParams);

	updateHashParams(newHashParamString);
};

const updateChangeTypeFilterParam = ({ changeTypeString }) => {
	const changeTypeParam = {
		changeType: changeTypeString,
	};

	const newHashChangeTypeParams = updateNewAppParams(changeTypeParam);
	const newHashParamString = createNewHashParamsString(newHashChangeTypeParams);

	updateHashParams(newHashParamString);
};

const updateViewModeHashParams = ({ viewModeString }) => {
	const modeParams = { mode: viewModeString };
	const newHashModeParams = updateNewAppParams(modeParams);

	const newHashParamString = createNewHashParamsString(newHashModeParams);
	updateHashParams(newHashParamString);
};

const updateExportStateHashParam = ({ exportState }) => {
	const exportParam = { export: exportState };

	const newHashExportParams = updateNewAppParams(exportParam);
	const newHashParamString = createNewHashParamsString(newHashExportParams);

	updateHashParams(newHashParamString);
};
const updateClickedLocation = ({ event }) => {
	console.log(event.detail.mapPoint.clone().normalize());
	const mapPoint = event.detail.mapPoint.clone().normalize();
	const locationParam = {
		loc: [mapPoint.longitude.toFixed(2), mapPoint.latitude.toFixed(2)],
	};

	const newHashLocationParams = updateNewAppParams(locationParam);
	const newHashParamString = createNewHashParamsString(newHashLocationParams);

	updateHashParams(newHashParamString);
};

const updateHashParamString = ({
	viewModeString,
	changeModelString,
	changeTypeString,
	exportState,
	event,
}) => {
	if (changeModelString) {
		updateChangeModelParam({ changeModelString });
		return;
	}

	if (changeTypeString) {
		updateChangeTypeFilterParam({ changeTypeString });
	}

	if (viewModeString) {
		updateViewModeHashParams({ viewModeString });
	}

	if (exportState === true || exportState === false) {
		updateExportStateHashParam({ exportState });
	}
	if (event) {
		updateClickedLocation({ event });
	}
};

const updateNewAppParams = (object) => {
	const params = processURLString(window.location.hash.slice(1));

	Object.entries(object).forEach(([key, value]) => {
		params[key] = value;
	});

	return params;
};

const createNewHashParamsString = (paramsObj) => {
	let replacementURLString = new URLSearchParams(hashParams);

	Object.entries(paramsObj).forEach(([key, value]) => {
		if (value === null || value === 'undefined' || value === undefined) {
			return;
		}
		replacementURLString.set(key, value);
	});

	return replacementURLString.toString();
};

const updateHashParams = (newHashParamString) => {
	window.location.hash = decodeURIComponent(newHashParamString);
	hashParams = window.location.hash.slice(1);
};
//HOW TO UPDATE HASH PARAMS
//What Changed? View extent? zoom? view mode? which 2050 projection layer? the type of change?
//format only the SPECIFIC changes that are provided
//merge (or update) the change into the existing URL string, preserving the other existing parameters

export {
	parseAndFormatURL,
	formatExtentParametersAndUpdateHashParams,
	// formatViewModeParametersAndUpdateHashParams,
	updateHashParamString,
};
