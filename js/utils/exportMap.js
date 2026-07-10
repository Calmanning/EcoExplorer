const e = (e, l, i, c, p, d) => {
		const m = p();
		console.log(m.mode);
		const x = n(c, m.mode),
			v = t(l, i, x);
		console.log('the export element', v);
		(document
			.querySelector('main')
			.firstElementChild.insertAdjacentElement('afterend', v),
			v.addEventListener('click', (t) => {
				a({
					event: t,
					exportUI_HTML: v,
					createWebMap_process: r,
					sendExportRequest: s,
					userPortalData: d,
					createMapExportDefinition: o,
					config: e,
					map: x,
				});
			}));
	},
	t = (e, t, n) => {
		console.log('map export', n);
		const o = e.export_container,
			a = document.createElement('div');
		a.id = o;
		const r = `\n                           <div class="form-container">\n                             <form id="export-form">\n                               <div class='form-element'>\n                                 <label> ArcGIS Online Web Map Title* </label>\n                                 <br>\n                                 <textarea class='title' type='text' contenteditable='true'>${n.id || ''}  </textarea>\n                               </div>\n                               <div class='form-element'>\n                                 <label>Tags</label>\n                                 <br>\n                                 <textarea class='tags' type='text' contenteditable='true'></textarea>\n                               </div>\n                               <div class='form-element'>\n                                 <label>Summary</label>\n                                 <br>\n                                 <textarea class='summary' type='text' contenteditable='true'></textarea>\n                               </div>\n                               <div class='form-btn-container'>\n                                 <btn class='btn cancel'>CANCEL</btn>\n                                 <btn class='btn export'>CREATE WEB MAP</btn>\n                               </div>\n \n                             </form>\n                           </div>\n                           `;
		return ((a.innerHTML = r), a);
	},
	n = (e, t) => {
		console.log(t);
		const n = 'explore' === t || '' === t ? e[0] : e[e.length - 1];
		return (console.log(n), n);
	},
	o = (e, t, n) => {
		const o = n.querySelectorAll('textarea'),
			a = ((e) => {
				console.log(e);
				const t = [];
				return (
					((e) => {
						console.log(e);
						const n = {
							id: e.id,
							type: e.type,
							layerType: e.operationalLayerType,
							title: e.title,
							styleUrl: e.styleUrl,
							itemId: e.portalItem.id,
							visible: e.visible,
							opacity: e.opacity,
							blendMode: e.blendMode,
							effect: e.effect ? [{ type: 'grayscale', amount: '80%' }] : '',
						};
						t.push(n);
					})(e.baseLayers.items[0]),
					t
				);
			})(t.map.basemap),
			r = t.map.layers;
		(console.log(o),
			o.forEach((e) => {
				console.log(e);
			}),
			console.log(a));
		return {
			description: o[2].value,
			tags: o[1].value,
			title: o[0].value,
			type: 'Web Map',
			multipart: !1,
			f: 'json',
			text: JSON.stringify({
				operationalLayers: r,
				baseMap: { baseMapLayers: a, title: 'outdoor' },
				initialState: {
					viewpoint: { scale: t.view.scale, targetGeometry: t.view.extent },
				},
				spatialReference: t.view.spatialReference,
				version: '2.36',
				authoringApp: 'EcoExplorer',
				authoringAppVersion: '0.1',
			}),
		};
	},
	a = ({
		event: e,
		exportUI_HTML: t,
		createWebMap_process: n,
		sendExportRequest: o,
		userPortalData: a,
		createMapExportDefinition: r,
		config: s,
		map: l,
	}) => {
		(e.target.classList.contains('export') &&
			n({
				sendExportRequest: o,
				userPortalData: a,
				exportUI_HTML: t,
				createMapExportDefinition: r,
				config: s,
				exportUI_HTML: t,
				map: l,
			}),
			e.target.classList.contains('cancel') && t.remove(),
			e.target.classList.contains('open-webmap') && t.remove());
	},
	r = async ({
		sendExportRequest: e,
		userPortalData: t,
		createMapExportDefinition: n,
		config: o,
		exportUI_HTML: a,
		map: r,
	}) => {
		const s = n(o, r, a),
			l = await e(s, t);
		if ((console.log(l), !0 === l.success)) {
			const e = (({ userPortalData: e, exportMapResponse: t }) => {
				console.log(e);
				const n = document.createElement('div'),
					o = `\n  <div style="text-align: right;">\n  <calcite-icon class="cancel" icon="x" aria-hidden="true" scale="m" calcite-hydrated=""><template shadowrootmode="open">\x3c!----\x3e<svg aria-hidden="true" fill="currentColor" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" class=" svg " viewBox="0 0 24 24">\x3c!--?lit$323654696$--\x3e\x3c!----\x3e<path d="M18.01 6.697 12.707 12l5.303 5.303-.707.707L12 12.707 6.697 18.01l-.707-.707L11.293 12 5.99 6.697l.707-.707L12 11.293l5.303-5.303z"></path>\x3c!----\x3e</svg></template></calcite-icon>\n  </div>\n  <div > Webmap successfully created </div>\n  <div class='link-btn-container'>\n  <a class='btn open-webmap' target='_blank' href="https://${e.urlKey}.${e.customUrl}/home/item.html?id=${t.id}">Open Webmap</a>\n  </div>\n  `;
				return ((n.id = 'exportResponseMessage'), (n.innerHTML = o), n);
			})({ userPortalData: t, exportMapResponse: l });
			(console.log(a.firstElementChild),
				a.firstElementChild.remove(),
				a.append(e));
		}
		if (l.error) {
			const e = (({ exportMapResponse: e }) => {
				const t = document.createElement('div'),
					n = `\n  <div style="text-align: right;">\n  <calcite-icon class="cancel" icon="x" aria-hidden="true" scale="m" calcite-hydrated=""><template shadowrootmode="open">\x3c!----\x3e<svg aria-hidden="true" fill="currentColor" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" class=" svg " viewBox="0 0 24 24">\x3c!--?lit$323654696$--\x3e\x3c!----\x3e<path d="M18.01 6.697 12.707 12l5.303 5.303-.707.707L12 12.707 6.697 18.01l-.707-.707L11.293 12 5.99 6.697l.707-.707L12 11.293l5.303-5.303z"></path>\x3c!----\x3e</svg></template></calcite-icon>\n  </div>\n  <div> Error creating webmap: </div>\n  <div> Error code: ${e.error.code} </div>\n  <div> ${e.error.message} </div>\n  `;
				return ((t.id = 'exportResponseMessage'), (t.innerHTML = n), t);
			})({ exportMapResponse: l });
			(a.firstElementChild.remove(), a.append(e));
		}
	},
	s = async (e, t) => {
		const n = new FormData();
		Object.entries(e).forEach(([e, t]) => {
			n.append(e, t);
		});
		const o = `${t.restUrl}/content/users/${t.userName}/addItem?`;
		console.log('the URL for the export', o);
		try {
			const e = await fetch(o, { method: 'POST', body: n });
			if (e.ok) {
				return await e.json();
			}
			console.log(e);
		} catch (e) {
			return (console.log(e), e);
		}
	};
export { e as addExportFormToMap };
