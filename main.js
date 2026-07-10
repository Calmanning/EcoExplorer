import { checkIn as o } from './check-in.js?v=0.01';
import { config as s } from './config.js?v=0.01';
import {
	authorization as a,
	getCredentials as i,
	get_DEV_token as e,
} from './js/utils/Oauth.js?v=0.01';
import {
	parseAndFormatURL as r,
	formatExtentParametersAndUpdateHashParams as t,
	updateHashParamString as n,
} from './js/utils/URL_params.js?v=0.01';
import {
	ELU_FeatureStrings as l,
	getAttributeTable as p,
	mapClickEventDelegation as m,
	exploreMaps_SelectionProcess as c,
} from './js/data.js?v=0.01';
import {
	buildAppHTML as v,
	buildExplorerMode as f,
	buildEcosystemProjectionView as j,
	initExplorerViewComponents as w,
	DOM_id_class_variables as d,
	showInvalidNotificationDiv as h,
	showInvalidMapLocationNotificationDiv as g,
} from './js/components.js?v=0.01';
import {
	updateProjectionModelVisibility as u,
	createNewCrosshairGraphic as _,
} from './js/layers.js?v=0.01';
import {
	initExplorerMapViews as E,
	initExplorerViewListeners as k,
	viewClickEvent as x,
} from './js/view.js?v=0.01';
import { addExportFormToMap as P } from './js/utils/exportMap.js?v=0.01';
import {
	setViewMode as C,
	changeViewMode as D,
	dropdownEvents as L,
	initAppTopLevelEventListener as O,
} from './js/utils/applicationEvents.js?v=0.01';
o();
const b = async () => {
	try {
		const o = r(),
			k = await e(s),
			C = l,
			b = await p(s.dependencies__exploreLayer.url, k),
			y = (v(s, D, o, i, u), await a(s)),
			M = j(o),
			N = w({
				config: s,
				DOM_id_class_variables: d,
				hashParams: o,
				landformELUCategories: C,
				dropdownEvents: L,
				mapClickEventDelegation: m,
				explorerLookupTable: b,
				parseAndFormatURL: r,
				showInvalidNotificationDiv: h,
				createNewCrosshairGraphic: _,
			}),
			S = await f({ explorerViewComponents: N });
		S.push(M);
		const U = await E({
			viewElements: S,
			config: s,
			hashParams: o,
			formatExtentParametersAndUpdateHashParams: t,
			sessionToken: k,
			viewClickEvent: x,
			DOM_id_class_variables: d,
		});
		x(s, k, U, m, d, b, g, n);
		if ((O(s, d, o, U, i, P, r, y), o.loc || !o.loc)) {
			console.log('PREVSIOUS SESSION');
			const a = await $arcgis.import('@arcgis/core/geometry/Point.js'),
				i = o.loc?.split(',') || [-117.15, 32.73],
				e = S[0],
				r = new a({ latitude: i[1], longitude: i[0] });
			c({
				config: s,
				sessionToken: k,
				DOM_id_class_variables: d,
				explorerLookupTable: b,
				showInvalidNotificationDiv: h,
				createNewCrosshairGraphic: _,
				previousMapPoint: r,
				mapViewElement: e,
			});
		}
	} catch (o) {
		console.log(o);
	}
};
export { b as initApp };
