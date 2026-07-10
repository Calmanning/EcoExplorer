import { checkIn as o } from './check-in.js?v=0.01';
import { config as s } from './config.js?v=0.01';
import {
	authorization as a,
	getCredentials as e,
	get_DEV_token as i,
} from './js/utils/Oauth.js?v=0.01';
import {
	parseAndFormatURL as t,
	formatExtentParametersAndUpdateHashParams as r,
	updateHashParamString as n,
} from './js/utils/URL_params.js?v=0.01';
import {
	ELU_FeatureStrings as l,
	getAttributeTable as c,
	mapClickEventDelegation as p,
	exploreMaps_SelectionProcess as m,
} from './js/data.js?v=0.01';
import {
	buildAppHTML as v,
	buildExplorerMode as f,
	buildEcosystemProjectionView as j,
	initExplorerViewComponents as d,
	DOM_id_class_variables as w,
	showInvalidNotificationDiv as g,
	showInvalidMapLocationNotificationDiv as h,
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
console.log(o);
const b = async () => {
	try {
		const o = t(),
			k = await i(s),
			C = l,
			b = await c(s.dependencies__exploreLayer.url, k);
		console.log(b);
		v(s, D, o, e, u);
		const y = await a(s),
			M = j(o);
		(console.log(k), console.log('portal data', y));
		const N = d({
				config: s,
				DOM_id_class_variables: w,
				hashParams: o,
				landformELUCategories: C,
				dropdownEvents: L,
				mapClickEventDelegation: p,
				explorerLookupTable: b,
				parseAndFormatURL: t,
				showInvalidNotificationDiv: g,
				createNewCrosshairGraphic: _,
			}),
			S = await f({ explorerViewComponents: N });
		S.push(M);
		const U = await E({
			viewElements: S,
			config: s,
			hashParams: o,
			formatExtentParametersAndUpdateHashParams: r,
			sessionToken: k,
			viewClickEvent: x,
			DOM_id_class_variables: w,
		});
		x(s, k, U, p, w, b, h, n);
		if ((O(s, w, o, U, e, P, t, y), o.loc || !o.loc)) {
			console.log('PREVSIOUS SESSION');
			const a = await $arcgis.import('@arcgis/core/geometry/Point.js'),
				e = o.loc?.split(',') || [-117.15, 32.73],
				i = S[0],
				t = new a({ latitude: e[1], longitude: e[0] });
			m({
				config: s,
				sessionToken: k,
				DOM_id_class_variables: w,
				explorerLookupTable: b,
				showInvalidNotificationDiv: g,
				createNewCrosshairGraphic: _,
				previousMapPoint: t,
				mapViewElement: i,
			});
		}
	} catch (o) {
		console.log(o);
	}
};
b();
export { b as initApp };
