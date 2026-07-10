import {
	createApplicationLayers as e,
	createCrossHairGraphicLayer as a,
	createNewCrosshairGraphic as o,
} from './layers.js?v=0.01';
const s = async (a, o, s, t) => {
		try {
			const s = document.createElement('arcgis-map');
			s.componentOnReady();
			const i = a.target.closest('arcgis-map');
			console.log('targetView for the pop out map.', i);
			const n = await e(o.basemapLayers),
				r = t();
			(console.log(t()), console.log(r));
			const c = r.ext[0] ? r?.ext.split(',') : null;
			console.log(c);
			const [l, m, p, w, d] = await $arcgis.import([
					'@arcgis/core/views/View.js',
					'@arcgis/core/Map.js',
					'@arcgis/core/Basemap.js',
					'@arcgis/core/layers/Layer.js',
					'@arcgis/core/layers/support/rasterFunctionUtils.js',
				]),
				v = i.map.layers.items[0].layers.items.find((e) => {
					if (e.title === o.dependencies__exploreLayer.title)
						return (
							console.log(
								'the title of the layer for the mask in the minimap',
								e.title,
							),
							console.log(e),
							e.rasterFunction
						);
				}),
				g = await e(o.operationalLayers);
			((s.view.attributionVisible = !0),
				(s.view.popup = null),
				(s.view.center = c || o.view.center),
				(s.view.zoom = r?.zoom || o.view.zoom),
				(s.view.constraints = {
					snapToZoom: o.view.constraints__zoomSnap,
					minZoom: o.view.constraints__minZoom,
				}),
				(s.view.ui = {}));
			const y = new p({ baseLayers: n });
			(console.log('operational Layers for MAP', g),
				(s.map = new m({ basemap: y })),
				s.map.layers.add(g[0]));
			s.map.layers.items[0].layers.items.find((e) => {
				if (e.title === o.dependencies__exploreLayer.title)
					return ((e.renderer = ''), (e.rasterFunction = v.rasterFunction), e);
			});
			return s;
		} catch (e) {
			console.log('error during pop-out map creation', e);
		}
	},
	t = async ({
		viewElements: o,
		config: s,
		hashParams: t,
		formatExtentParametersAndUpdateHashParams: i,
		sessionToken: r,
		DOM_id_class_variables: c,
	}) => {
		const l = await e(s.basemapLayers),
			[m, p, w, d] = await $arcgis.import([
				'@arcgis/core/views/View.js',
				'@arcgis/core/Map.js',
				'@arcgis/core/Basemap.js',
				'@arcgis/core/layers/Layer.js',
			]);
		console.log("session token for the layer's APIkey?", r);
		const v = t?.ext[0] ? t?.ext.split(',') : null,
			g = o.map(async (i, n) => {
				(i.componentOnReady(),
					console.log(
						'the operational layer before being send to the layers function',
						s.operationalLayers,
					));
				const r = await e(s.operationalLayers);
				((i.view.attributionVisible = !1),
					(i.view.popup = null),
					(i.view.center = v || s.view.center),
					(i.view.zoom = t?.zoom || s.view.zoom),
					(i.view.constraints = {
						snapToZoom: s.view.constraints__zoomSnap,
						minZoom: s.view.constraints__minZoom,
					}),
					(i.view.ui = 0 == n || n == o.length - 1 ? {} : { components: [] }));
				const m = new w({ baseLayers: l });
				if (
					((i.map = new p({ basemap: m })),
					i.map.layers.addMany(r),
					i.id === c.explorer_ecosystems)
				) {
					const e = await a(),
						o = document.createElement('arcgis-search');
					((o.resultGraphicDisabled = !0), (o.locationDisabled = !0));
					const s = document.createElement('div');
					(s.classList.add('search-container'),
						s.append(o),
						i.append(s),
						i.map.layers.add(e));
				}
				if (i.id === c.projectionMode_mainView) {
					const a = await e(s.ecoProjectionLayers__operationalLayers),
						o = document.createElement('arcgis-search'),
						t = document.createElement('div');
					(t.classList.add('search-container'),
						t.append(o),
						i.append(t),
						i.map.layers.items[0].addMany(a));
				}
				return i;
			}),
			y = await Promise.all(g);
		return (
			console.log(y),
			await n({ mapViews: y, formatExtentParametersAndUpdateHashParams: i }),
			y
		);
	};
let i;
const n = async ({
		mapViews: e,
		formatExtentParametersAndUpdateHashParams: a,
	}) => {
		const o = await $arcgis.import('@arcgis/core/core/reactiveUtils.js');
		console.log('starting ractions', e);
		e.map((s) => {
			(o.when(
				() => s.view.center,
				() => {
					s.view.center !== i &&
						((i = s.view.center), r({ mapViews: e, viewComponent: s }));
				},
			),
				o.when(
					() => s.view.zoom,
					() => {
						c({ mapViews: e, viewComponent: s });
					},
				),
				o.watch(
					() => !1 === s.view.navigating,
					() => {
						a({ viewComponent: s });
					},
				));
		});
	},
	r = ({ mapViews: e, viewComponent: a }) => {
		e.forEach((e) => {
			e.center = a.center;
		});
	},
	c = ({ mapViews: e, viewComponent: a }) => {
		e.forEach((e) => {
			e.zoom = a.zoom;
		});
	},
	l = (e, a, s, t, i, n, r, c) => {
		console.log(s);
		s.map((s) => {
			(console.log(s.id),
				s.addEventListener('arcgisViewClick', (l) => {
					(s.id === i.explorer_ecosystems && c({ event: l }),
						t({
							event: l,
							config: e,
							sessionToken: a,
							DOM_id_class_variables: i,
							explorerLookupTable: n,
							showInvalidNotificationDiv: r,
							createNewCrosshairGraphic: o,
						}));
				}));
		});
	};
export {
	t as initExplorerMapViews,
	n as initExplorerViewListeners,
	s as initPopOutView,
	l as viewClickEvent,
};
