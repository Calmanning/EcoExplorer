const config = {
	defaultLanguage: 'en',
	portalURL: 'https://www.arcgis.com/',
	portalAuthentication: false,
	//this is a test/DEV clientID

	appId: 'mz09wz68zh2LA6m3',

	view: {
		//poland
		locCenter: [17.8, 53.31],
		extCenter: [17.06, 53.27],
		//San Diego
		// center: [-117.15, 32.73],
		//Japan
		// center: [137, 36],
		//county-level zoom
		zoom: 3,
		//country-level
		// zoom: 7,
		constraints__minZoom: 3,
		constraints__snapZoom: false,
		showAttribution: false,
	},
	dependencies__exploreLayer: {
		//WTE Ecosystem data
		title: 'World Terrestrial Ecosystems v2 for 2015',
		itemId: '2e315bb2cd3547d3ac6bfcaaa3daac4f',
		url: 'https://tiledimageservices.arcgis.com/jIL9msH9OI208GCb/arcgis/rest/services/WTEWTE_2015_Chelsa_Chen__HammondLayer/ImageServer',
	},
	dependencies__imageryLayer: {
		title: 'World Imagery',
		itemId: '10df2279f9684e4a9f6a7f08febac2a9',
		url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
	},
	operationalLayers: [
		{
			type: 'group',
			layerType: 'GroupLayer',
			title: 'Eco Group Layer',
			effect: 'drop-shadow(1px, -1px, 8px, black)',
			effectForExport: [
				{
					type: 'drop-shadow',
					xoffset: 1,
					yoffset: -1,
					blurRadius: 8,
					color: [59, 32, 0, 255],
				},
			],

			maxScale: 0,
			minScale: 0,
			visibility: true,
			visibilityTimeExtent: [null, null],
			layers: [
				{
					title: 'World Imagery',
					itemId: '10df2279f9684e4a9f6a7f08febac2a9',
					// url: 'https://arcgis-content.maps.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9',
					url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
					type: 'ArcGISTiledMapServiceLayer',
					layerType: 'ArcGISTiledMapServiceLayer',
					effectForExport: [
						{ type: 'saturate', amount: 2 },
						{ type: 'brightness', amount: 1.3 },
						{ type: 'contrast', amount: 0.8 },
					],
					effect: 'saturate(200%) brightness(130%) contrast(80%)',
					visible: true,
				},
				{
					title: 'Outdoor, Labels Only',
					itemId: 'fe4e4b2f467243468bd5d15f02f9ad4c',
					// url: 'https://arcgis-content.maps.arcgis.com/home/item.html?id=fe4e4b2f467243468bd5d15f02f9ad4c',
					url: 'https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer',
					type: 'VectorTileLayer',
					layerType: 'VectorTileLayer',
					effectForExport: [
						{ type: 'invert', amount: 1 },
						{ type: 'hue-rotate', angle: 180 },
						{
							type: 'drop-shadow',
							xoffset: 0,
							yoffset: 0,
							blurRadius: 2.25,
							color: [59, 32, 0, 255],
						},
					],
					effect:
						'invert(100%) hue-rotate(180deg) drop-shadow(0px 0px 3px black)',
				},
				{
					///NOTE: when using RASTER FUNCTION -- make sure you are not using the RENDERER.
					title: 'World Terrestrial Ecosystems v2 for 2015',
					itemId: '2e315bb2cd3547d3ac6bfcaaa3daac4f',
					// url: 'https://arcgis-content.maps.arcgis.com/home/item.html?id=2e315bb2cd3547d3ac6bfcaaa3daac4f',
					url: 'https://tiledimageservices.arcgis.com/jIL9msH9OI208GCb/arcgis/rest/services/WTEWTE_2015_Chelsa_Chen__HammondLayer/ImageServer',
					type: 'imageryTileLayer',
					layerType: 'ArcGISTiledImageServiceLayer',
					// effect: '',
					blendMode: 'destination-in',
					interpolation: 'bilinear',
					opacity: 1,
					visible: true,
					noData: 0,
					rasterFunction: {
						rasterFunction: 'Mask',
						rasterFunctionArguments: {
							NoDataValues: ['-100'],
							IncludedRanges: [[0, 0]],
							NoDataInterpretation: 0,
						},
						variableName: 'Raster',
					},
				},
			],
		},
	],
	basemapLayers: [
		{
			title: 'World Hillshade (Dark)',
			itemId: '428539ef9cab4017b69d15a40a9ee98b',
			url: 'https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade_Dark/MapServer',
			type: 'ArcGISTiledMapServiceLayer',
			effect: 'brightness(50%) contrast(100%)',
			effectForExport: [
				{ type: 'brightness', amount: 0.5 },
				{ type: 'contrast', amount: 1 },
			],
			blendMode: 'soft-light',
			opacity: 1,
			isReference: false,
		},
		{
			title: 'Human Geography Dark Detail',
			itemId: '1ddbb25aa29c4811aaadd94de469856a',
			url: 'https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer',
			type: 'VectorTileLayer',
			blendMode: 'multiply',
			opacity: 0.75,
			isReference: false,
		},
		{
			title: 'World Imagery Context',
			itemId: '10df2279f9684e4a9f6a7f08febac2a9',
			// url: 'https://arcgis-content.maps.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9',
			url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
			type: 'ArcGISTiledMapServiceLayer',
			layerType: 'ArcGISTiledMapServiceLayer',
			opacity: 0.2,
			visible: true,
			isReference: false,
		},
		{
			title: 'Outdoor, Labels Only',
			itemId: 'fe4e4b2f467243468bd5d15f02f9ad4c',
			url: 'https://arcgis-content.maps.arcgis.com/home/item.html?id=fe4e4b2f467243468bd5d15f02f9ad4c',
			type: 'VectorTileLayer',
			effectForExport: [
				{ type: 'hue-rotate', angle: 180 },
				{ type: 'invert', amount: 1 },
			],
			effect: 'invert(100%) hue-rotate(180deg)',
			opacity: 0.6,
			isReference: false,
		},
	],
	ecoProjectionLayers__operationalLayers: [
		{
			title: 'Projected Change Types for WTEs in 2050 (SSP1-2.6)', //'Sustainable'
			//the id will be important. Will be used to find and determined which layers will be apart of the projection render process.
			id: '2050-sustainable-projection',
			itemId: '6250c1c131df4093afd3f8216ae57992',
			url: 'https://tiledimageservices.arcgis.com/jIL9msH9OI208GCb/arcgis/rest/services/RCP_SSP126_WTE_ChangeTypeClass/ImageServer',
			type: 'imageryTileLayer',
			layerType: 'ArcGISTiledImageServiceLayer',
			blendMode: 'destination-in',
			interpolation: 'bilinear',
			noData: 0,
			opacity: 1,
			visible: false,
		},
		{
			title: 'Projected Change Types for WTEs in 2050 (SSP3-7.0)', //'high emissions'
			id: '2050-self-reliant-projection',
			itemId: 'c3158a91348f4b8b98315aa9eb8cab51',
			url: 'https://tiledimageservices.arcgis.com/jIL9msH9OI208GCb/arcgis/rest/services/RCP_SSP370_WTE_ChangeTypeClass/ImageServer',
			type: 'imageryTileLayer',
			layerType: 'ArcGISTiledImageServiceLayer',
			blendMode: 'destination-in',
			interpolation: 'bilinear',
			noData: 0,
			opacity: 1,
			visible: false,
		},
		// {
		// 	title: 'Projected Change Types for WTEs in 2050 (SSP5-8.5)', //'very high emissions'
		// 	id: '2050-gas-powered-projection',
		// 	itemId: 'a8be2652b98f43a2b1c9f694dfa8b093',
		// 	url: 'https://tiledimageservices.arcgis.com/jIL9msH9OI208GCb/arcgis/rest/services/RCP_SSP585_WTE_ChangeTypeClass/ImageServer',
		// 	type: 'imageryTileLayer',
		// 	blendMode: 'destination-in',
		// 	interpolation: 'bilinear',
		// 	noData: 0,
		// 	opacity: 1,
		// 	visible: false,
		//   isReference: true,
		// },
	],
	projectionRenderClassValues: {
		aridity: ['2', '4', '6'],
		temperature: ['1', '4', '5'],
		landCover: ['3', '5', '6'],
		total__changes: ['1', '2', '3', '4', '5', '6'],
		all__changes: ['7'],
	},
	projectionRenderer: {
		type: 'uniqueValue',
		field1: 'Value',
		uniqueValueGroups: [
			{
				classes: [
					{
						label: '0 - No Change',
						symbol: {
							type: 'esriSFS',
							color: [0, 0, 0, 0],
							outline: {
								type: 'esriSLS',
								color: [0, 0, 0, 0],
								width: 0.998,
								style: 'esriSLSSolid',
							},
							style: 'esriSFSSolid',
						},
						values: [['0']],
					},
					{
						label: '1 - Temperature Only',
						symbol: {
							type: 'esriSFS',
							color: [237, 221, 95, 255],
							outline: {
								type: 'esriSLS',
								color: [0, 0, 0, 0],
								width: 0.998,
								style: 'esriSLSSolid',
							},
							style: 'esriSFSSolid',
						},
						values: [['1']],
					},
					{
						label: '2 - Aridity Only',
						symbol: {
							type: 'esriSFS',
							color: [187, 133, 214, 255],
							outline: {
								type: 'esriSLS',
								color: [0, 0, 0, 0],
								width: 0.998,
								style: 'esriSLSSolid',
							},
							style: 'esriSFSSolid',
						},
						values: [['2']],
					},
					{
						label: '3 - Land Cover Only',
						symbol: {
							type: 'esriSFS',
							color: [189, 141, 123, 255],
							outline: {
								type: 'esriSLS',
								color: [0, 0, 0, 0],
								width: 0.998,
								style: 'esriSLSSolid',
							},
							style: 'esriSFSSolid',
						},
						values: [['3']],
					},
					{
						label: '4 - Temperature and Aridity',
						symbol: {
							type: 'esriSFS',
							color: [245, 162, 123, 255],
							outline: {
								type: 'esriSLS',
								color: [0, 0, 0, 0],
								width: 0.998,
								style: 'esriSLSSolid',
							},
							style: 'esriSFSSolid',
						},
						values: [['4']],
					},
					{
						label: '5 - Temperature and Land Cover',
						symbol: {
							type: 'esriSFS',
							color: [161, 161, 93, 255],
							outline: {
								type: 'esriSLS',
								color: [0, 0, 0, 0],
								width: 0.998,
								style: 'esriSLSSolid',
							},
							style: 'esriSFSSolid',
						},
						values: [['5']],
					},
					{
						label: '6 - Aridity and Land Cover',
						symbol: {
							type: 'esriSFS',
							color: [124, 67, 156, 255],
							outline: {
								type: 'esriSLS',
								color: [0, 0, 0, 0],
								width: 0,
								style: 'esriSLSSolid',
							},
							style: 'esriSFSSolid',
						},
						values: [['6']],
					},
					{
						label: '7 - All',
						symbol: {
							type: 'esriSFS',
							color: [148, 94, 67, 255],
							outline: {
								type: 'esriSLS',
								color: [0, 0, 0, 0],
								width: 0.998,
								style: 'esriSLSSolid',
							},
							style: 'esriSFSSolid',
						},
						values: [['7']],
					},
				],
			},
		],
	},
};

export { config };
