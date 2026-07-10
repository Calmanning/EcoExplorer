const e = 'crosshair',
	i = async (e) => {
		const i = [];
		try {
			console.log(e);
			for (const r of e) {
				if ('group' === r.type) {
					const e = await s(r);
					(console.log('the group', e), i.push(e));
				}
				if ('ArcGISTiledMapServiceLayer' === r.type) {
					const e = await l(r);
					(console.log('tileLayer', e), i.push(e));
				}
				if ('imageryLayer' === r.type) {
					const e = await a(r);
					(console.log('tileLayer', e), i.push(e));
				}
				if ('imageryTileLayer' === r.type) {
					const e = await o(r);
					(console.log('tileLayer', e), i.push(e));
				}
				if ('VectorTileLayer' === r.type) {
					let e;
					if (
						(r.language ||
							((e = await t(r)), console.log('Vector tileLayer', e), i.push(e)),
						!r.language || r.language !== targetLanguage)
					)
						continue;
					(console.log('getting language version'), (e = await t(r)));
				}
			}
			return (console.log('baselayers array', i), i);
		} catch (e) {
			console.log('error encountered while initializing all layers', e);
		}
	},
	a = async (e) => {
		try {
			const i = await $arcgis.import('@arcgis/core/layers/ImageryLayer.js'),
				a = await r(e.rasterFunction),
				o = new i({
					title: e.title,
					portalItem: { id: e.itemId },
					effect: e.effect || '',
					maxScale: e.maxScale || 0,
					minScale: e.minScale || 0,
					visible: !1 !== e?.visible || e.visible,
					blendMode: e.blendMode || 'normal',
					interpolation: e.interpolation || '',
					noData: e.noData || 0,
					opacity: e.opacity || 1,
				});
			return ((o.rasterFunction = a), console.log(o), o);
		} catch (e) {
			throw e;
		}
	},
	o = async (e) => {
		try {
			const i = await $arcgis.import('@arcgis/core/layers/ImageryTileLayer.js');
			'World Terrestrial Ecosystems v2 for 2015' === e.title && console.log(e);
			return new i({
				title: e.title,
				id: e.id || '',
				portalItem: { id: e.itemId },
				effect: e.effect || '',
				maxScale: e.maxScale || 0,
				minScale: e.minScale || 0,
				visible: !1 !== e?.visible || e.visible,
				blendMode: e.blendMode || 'normal',
				interpolation: e.interpolation || '',
				noData: e.noData || 0,
				rasterFunction: e?.rasterFunction ? await r(e.rasterFunction) : null,
				opacity: e.opacity || 1,
			});
		} catch (e) {
			console.log('issue initializing the imageryTileLayer', e);
		}
	},
	r = async (e) => {
		console.log(e);
		const [i] = await $arcgis.import([
			'@arcgis/core/layers/support/rasterFunctionUtils.js',
		]);
		if ((console.log(e.rasterFunction), 'Mask' === e.rasterFunction)) {
			console.log('masking!');
			return i.mask({ includedRanges: [[0, 0]] });
		}
		return noDataMask;
	},
	t = async (e) => {
		const i = new (await $arcgis.import(
			'@arcgis/core/layers/VectorTileLayer.js',
		))({
			title: e.title,
			portalItem: { id: e.itemId },
			effect: e.effect || '',
			maxScale: e.maxScale || 0,
			minScale: e.minScale || 0,
			visible: !1 !== e?.visible || e.visible,
			opacity: e.opacity || 1,
			blendMode: e.blendMode || 'normal',
		});
		return (console.log(i), i);
	},
	l = async (e) => {
		const i = await $arcgis.import('@arcgis/core/layers/TileLayer.js');
		console.log(e.title, e.visible);
		return new i({
			title: e.title,
			portalItem: { id: e.itemId },
			effect: e.effect || '',
			blendMode: e?.blendMode || 'normal',
			opacity: e?.opacity || 1,
			maxScale: e.maxScale || 0,
			minScale: e.minScale || 0,
			visible: !1 !== e?.visible || e.visible,
		});
	},
	s = async (e) => {
		const a = await $arcgis.import('@arcgis/core/layers/GroupLayer.js'),
			o = await i(e.layers);
		console.log('the sub layers', o);
		return new a({ title: e.title, layers: o, effect: e.effect || '' });
	},
	n = async () => {
		try {
			const [i] = await $arcgis.import([
				'@arcgis/core/layers/GraphicsLayer.js',
			]);
			return new i({ id: e, title: e, graphics: [] });
		} catch (e) {
			console.log('Error during graphics layer initialization.', e);
		}
	},
	c = async ({ mapPoint: i, explorerMainMapView: a, noPixelInfo: o }) => {
		(console.log('creating new crosshair'),
			console.log(i),
			console.log(a),
			console.log(o));
		try {
			const [r] = await $arcgis.import(['@arcgis/core/Graphic.js']),
				t = a.map.findLayerById(e);
			if ((t.graphics.removeAll(), !0 === o)) return;
			const l = new r({
				symbol: {
					type: 'picture-marker',
					url: 'libraries/images/CrosshairRed.png',
					width: 33,
					height: 33,
					color: 'blue',
				},
				geometry: i,
			});
			t.graphics.add(l);
		} catch (e) {
			console.log('Error occurred creating crosshair graphic', e);
		}
	},
	g = async (e, i, a, o) => {
		let r, t;
		(console.log(i), console.log(i.firstElementChild.view));
		const l = i.firstElementChild.view.map.layers.items[0].layers.items,
			s = o.split(',');
		console.log(s);
		const n = [0, 0, 0, 0];
		l.forEach(async (i) => {
			(i.title === e.dependencies__exploreLayer.title && (t = i),
				i.id.includes('projection') && (i.visible = !1),
				i.id.includes(a) &&
					((r = i),
					i.renderer.uniqueValueGroups[0].classes.forEach((i, a) => {
						if ((console.log(a), s.includes(i.values[0].value)))
							return (
								console.log(
									e.projectionRenderer.uniqueValueGroups[0].classes[a],
								),
								void (i.symbol.color =
									e.projectionRenderer.uniqueValueGroups[0].classes[a])
							);
						i.symbol.color = n;
					}),
					(i.visible = !0),
					(t.rasterFunction = null),
					i.refresh(),
					console.log(i)));
		});
	};
export {
	i as createApplicationLayers,
	n as createCrossHairGraphicLayer,
	c as createNewCrosshairGraphic,
	g as updateProjectionModelVisibility,
};
