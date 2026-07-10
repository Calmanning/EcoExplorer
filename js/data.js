import e from '../landform.json' with { type: 'json' };
import o from '../landCover.json' with { type: 'json' };
import t from '../climateRegion.json' with { type: 'json' };
new AbortController();
const r = (e) => {
		const o = e.items.map((e) => e.wte);
		return { title: e.title, features: [...new Set(o)] };
	},
	l = (({ arrayOfJSONs: e }) => {
		console.log(e);
		const o = e.map((e) => r(e));
		return (console.log(o), o);
	})({ arrayOfJSONs: [e, o, t] }),
	s = ({
		event: e,
		config: o,
		sessionToken: t,
		DOM_id_class_variables: r,
		explorerLookupTable: l,
		showInvalidNotificationDiv: s,
		createNewCrosshairGraphic: n,
	}) => {
		(console.log(s),
			console.log(`.${r.dropDownClass}`),
			console.log(e.target?.closest(`.${r.dropDownClass}`)),
			e.target?.closest(`#${r.projection_containerDiv}`) ||
				(e.target?.closest(`.${r.dropDownClass}`)
					? a({
							event: e,
							config: o,
							sessionToken: t,
							explorerLookupTable: l,
							DOM_id_class_variables: r,
							showInvalidNotificationDiv: s,
							createNewCrosshairGraphic: n,
						})
					: e.target?.closest(`#${r.explorer_containerDiv}`) &&
						i({
							event: e,
							config: o,
							sessionToken: t,
							DOM_id_class_variables: r,
							explorerLookupTable: l,
							showInvalidNotificationDiv: s,
							createNewCrosshairGraphic: n,
						})));
	},
	a = ({
		event: r,
		config: l,
		sessionToken: s,
		explorerLookupTable: a,
		DOM_id_class_variables: i,
		showInvalidNotificationDiv: n,
		createNewCrosshairGraphic: d,
	}) => {
		(console.log('dropdown Choice!'), console.log('the graphic function', n));
		const g = r.target?.closest(`#${i.explorer_containerDiv}`);
		console.log(g);
		const h = g.querySelector(`#${i.explorer_ecosystems}`),
			C = g.querySelectorAll(`.${i.dropDownDisplayClass}`),
			y = [];
		C.forEach((e) => {
			console.log(e.innerHTML);
			const o = e.innerHTML;
			(console.log(o), y.push(o));
		});
		const _ = b(y, a);
		if ((console.log(_), r.target.closest(`#${e.title}`))) {
			const o = r.target.closest(`#${e.title}`),
				t = r.target.attributes.value.value,
				s = f({ selectedLandform: t, explorerLookupTable: a });
			(console.log(s), c(o, l, s, i));
		}
		if (r.target.closest(`#${o.title}`)) {
			const e = r.target.closest(`#${o.title}`),
				t = r.target.attributes.value.value,
				s = m({ selectedLandCover: t, explorerLookupTable: a });
			(console.log(s), p(e, l, s, i));
		}
		if (r.target.closest(`#${t.title}`)) {
			const e = r.target.closest(`#${t.title}`),
				o = r.target.attributes.value.value,
				s = v({ selectedClimateRegion: o, explorerLookupTable: a });
			(console.log(s), u(e, l, s, i));
		}
		w({
			config: l,
			mainExplorerContainer: h,
			pixelValue: _,
			showInvalidNotificationDiv: n,
			DOM_id_class_variables: i,
			createNewCrosshairGraphic: d,
		});
	},
	i = async ({
		event: r,
		config: l,
		sessionToken: s,
		DOM_id_class_variables: a,
		explorerLookupTable: i,
		showInvalidNotificationDiv: d,
		createNewCrosshairGraphic: b,
		previousMapPoint: C,
		mapViewElement: y,
	}) => {
		try {
			const _ = r?.target.closest('#explore') || y.closest('#explore');
			(console.log('This is the explorerViewContainer?', _),
				console.log(_.querySelector(`#${a.explorer_ecosystems}`)));
			const x = _.querySelector(`#${a.explorer_ecosystems}`),
				L = x.view,
				D = r?.target.map || L.map,
				T = _.querySelector(`#${e.title}`),
				M = _.querySelector(`#${o.title}`),
				N = _.querySelector(`#${t.title}`),
				$ = l.dependencies__exploreLayer.url,
				O = C || r?.detail.mapPoint.clone().normalize(),
				k = D.layers.items[0].layers.items.find((e) => {
					if (
						(console.log(e),
						e.portalItem.id === l.dependencies__exploreLayer.itemId)
					)
						return e;
				}),
				I = await g($, s, O, k);
			if (
				(console.log('the PIXEL VALUE FROM THE SELECTION PROCESS', I),
				null == I.value)
			)
				return void d({ DOM_id_class_variables: a });
			const E = I.value[0];
			console.log(E);
			const S = h(E, i);
			console.log('from the central map point process', S);
			const P = f({ eluAttributes: S, explorerLookupTable: i }),
				G = m({ eluAttributes: S, explorerLookupTable: i }),
				A = v({ eluAttributes: S, explorerLookupTable: i });
			if (
				((r?.target.id === a.explorer_ecosystems || C) &&
					(console.log(C, 'IS TRUE'),
					w({
						config: l,
						mapPoint: O,
						mainExplorerContainer: x,
						eluAttributes: S,
						event: r,
						showInvalidNotificationDiv: d,
						createNewCrosshairGraphic: b,
					}),
					c(T, l, P, a),
					p(M, l, G, a),
					u(N, l, A, a)),
				r?.target.id === e.title)
			)
				try {
					(await c(T, l, P, a),
						n({
							event: r,
							config: l,
							explorerLookupTable: i,
							DOM_id_class_variables: a,
							showInvalidNotificationDiv: d,
							createNewCrosshairGraphic: b,
						}));
				} catch (e) {
					console.log(
						'error updating raster functions for the landform pixels before updating main map',
						e,
					);
				}
			if (r?.target.id === o.title)
				try {
					(await p(M, l, G, a),
						n({
							event: r,
							config: l,
							explorerLookupTable: i,
							DOM_id_class_variables: a,
							showInvalidNotificationDiv: d,
							createNewCrosshairGraphic: b,
						}));
				} catch (e) {
					console.log(
						'error updating raster functions for the land cover pixels before updating main map',
						e,
					);
				}
			if (r?.target.id === t.title)
				try {
					(await u(N, l, A, a),
						n({
							event: r,
							config: l,
							explorerLookupTable: i,
							DOM_id_class_variables: a,
							showInvalidNotificationDiv: d,
							createNewCrosshairGraphic: b,
						}));
				} catch (e) {
					console.log(
						'error updating raster functions for the climate region pixels before updating main map',
						e,
					);
				}
		} catch (e) {
			console.log(
				'Encountered error processing the click event for updating the render functions of one of the explorer-oriented maps',
				e,
			);
		}
	},
	n = ({
		event: e,
		config: o,
		explorerLookupTable: t,
		DOM_id_class_variables: r,
		showInvalidNotificationDiv: l,
		createNewCrosshairGraphic: s,
	}) => {
		console.log('from the minimap event!!!', e);
		const a = e.detail.mapPoint.clone().normalize(),
			i = e.target?.closest(`#${r.explorer_containerDiv}`);
		console.log(i);
		const n = i.querySelector(`#${r.explorer_ecosystems}`),
			c = i.querySelectorAll(`.${r.dropDownDisplayClass}`),
			p = [];
		c.forEach((e) => {
			console.log(e.innerHTML);
			const o = e.innerHTML;
			(console.log(o), p.push(o));
		});
		const u = b(p, t);
		(console.log('THE PIXEL VALUE FROM THE DROPDOWN COMPONENTS', u),
			w({
				config: o,
				mapPoint: a,
				mainExplorerContainer: n,
				pixelValue: u,
				showInvalidNotificationDiv: l,
				DOM_id_class_variables: r,
				createNewCrosshairGraphic: s,
			}));
	},
	c = async (e, o, t, r) => {
		try {
			let l;
			const s = e.querySelector(`.${r.dropDownDisplayClass}`),
				a = t,
				i = await C({ eluData: a });
			(e.view.map.layers.items[0].layers.items.find((e) => {
				e.title !== o.dependencies__exploreLayer.title || (l = e);
			}),
				(s.innerHTML = a[0].attributes.LandFrmCls),
				s.classList.remove(r.dropDownPlaceHolderClass),
				(l.renderer = null),
				(l.rasterFunction = i));
		} catch (e) {
			console.log('error updating landform raster function', e);
		}
	},
	p = async (e, o, t, r) => {
		try {
			let l;
			const s = e.querySelector(`.${r.dropDownDisplayClass}`),
				a = t,
				i = await C({ eluData: a });
			(e.view.map.layers.items[0].layers.items.find((e) => {
				e.title !== o.dependencies__exploreLayer.title || (l = e);
			}),
				(s.innerHTML = a[0].attributes.LandCovCls),
				s.classList.remove(r.dropDownPlaceHolderClass),
				(l.renderer = null),
				(l.rasterFunction = i));
		} catch (e) {
			console.log('error updating land cover raster function', e);
		}
	},
	u = async (e, o, t, r) => {
		try {
			let l;
			const s = e.querySelector(`.${r.dropDownDisplayClass}`),
				a = t,
				i = await C({ eluData: a });
			(e.view.map.layers.items[0].layers.items.find((e) => {
				e.title !== o.dependencies__exploreLayer.title || (l = e);
			}),
				(s.innerHTML = a[0].attributes.BioClimCls),
				s.classList.remove(r.dropDownPlaceHolderClass),
				(l.renderer = null),
				(l.rasterFunction = i));
		} catch (e) {
			console.log('error updating climate region raster function', e);
		}
	},
	d = async (e, o) => {
		const t = fetch(`${e}/rasterAttributeTable?token=${o}&f=pjson`),
			r = await t;
		return await r.json();
	},
	g = async (e, o, t, r) => {
		(console.log(t), console.log(r));
		try {
			const e = await r.identify(t);
			return (console.log(e), e);
		} catch (e) {
			console.log(e);
		}
	},
	f = ({ eluAttributes: e, selectedLandform: o, explorerLookupTable: t }) => {
		const r = o || e[0]?.attributes.LandFrmCls;
		return t.features.filter((e) => e.attributes.LandFrmCls === r);
	},
	m = ({ eluAttributes: e, selectedLandCover: o, explorerLookupTable: t }) => {
		const r = o || e[0]?.attributes?.LandCovCls;
		return t.features.filter((e) => e.attributes.LandCovCls === r);
	},
	v = ({
		eluAttributes: e,
		selectedClimateRegion: o,
		explorerLookupTable: t,
	}) => {
		const r = o || e[0]?.attributes.BioClimCls;
		return t.features.filter((e) => e.attributes.BioClimCls === r);
	},
	h = (e, o) => {
		(console.log(e), console.log(o));
		const t = o.features.find((o) => {
			if (o.attributes.Value == e) return o;
		});
		console.log(t);
		const r = o.features.filter((e) => {
			if (
				e.attributes.BioClimCls === t.attributes.BioClimCls &&
				e.attributes.LandCovCls === t.attributes.LandCovCls &&
				e.attributes.LandFrmCls === t.attributes.LandFrmCls
			)
				return (console.log('all three'), e);
		});
		return (console.log('all the WTE', r), r);
	},
	b = (e, o) => {
		console.log(e);
		const t = o.features.filter((o) => {
			if (
				o.attributes.LandFrmCls == e[0] &&
				o.attributes.LandCovCls == e[1] &&
				o.attributes.BioClimCls == e[2]
			)
				return o;
		});
		return (console.log(t), t);
	},
	C = async ({ pixelInfo: e, eluData: o }) => {
		try {
			(console.log('the ELU', o),
				console.log('the Pixel', e),
				console.log('the Pixel length', e?.length),
				console.log('the Pixel', !0 === e));
			const [t] = await $arcgis.import([
				'@arcgis/core/layers/support/rasterFunctionUtils.js',
			]);
			if (e?.length > 0) {
				const o = e.map((e) => [
					e.attributes.Value,
					e.attributes.Red,
					e.attributes.Green,
					e.attributes.Blue,
				]);
				console.log('colorMaps for all occurrences of the pixels string', o);
				return t.colormap({ colormap: o });
			}
			if (o) {
				const e = o.map((e) => [
					e.attributes.Value,
					e.attributes.Red,
					e.attributes.Green,
					e.attributes.Blue,
				]);
				console.log('colorMaps for all occurrences of the ELU string', e);
				return t.colormap({ colormap: e });
			}
			if (0 == e || 0 == o) {
				console.log('the false pixel value');
				return t.remap({
					rangeMaps: [{ range: [0, 0], output: 0, allowUnmatched: !1 }],
				});
			}
		} catch (e) {
			console.log('issue encountered during colormap construction', e);
		}
	},
	w = async ({
		config: e,
		mapPoint: o,
		mainExplorerContainer: t,
		eluAttributes: r,
		pixelValue: l,
		showInvalidNotificationDiv: s,
		DOM_id_class_variables: a,
		createNewCrosshairGraphic: i,
	}) => {
		try {
			let n;
			const c = t.view;
			(console.log(c),
				c.map.layers.items[0].layers.items.find((o) => {
					o.portalItem.id !== e.dependencies__exploreLayer.itemId || (n = o);
				}));
			const p = l || r,
				u = await C({ pixelInfo: p });
			if (((n.renderer = null), (n.rasterFunction = u), 0 == p)) {
				const e = !0;
				(s({ DOM_id_class_variables: a }),
					i({ explorerMainMapView: c, noPixelInfo: e }));
			}
			i({ mapPoint: o, explorerMainMapView: c });
		} catch (e) {
			console.log(
				'error adding the rasterFunction to the main explorer view component',
				e,
			);
		}
	};
export {
	l as ELU_FeatureStrings,
	d as getAttributeTable,
	s as mapClickEventDelegation,
	i as exploreMaps_SelectionProcess,
};
