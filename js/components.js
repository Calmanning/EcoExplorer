const e = {
		explorer_containerDiv: 'explore',
		explorer_mainView: 'explore-main-view',
		viewStyle_shadow: 'shadow',
		explorer_ecosystems: 'explorer-main-ecosystem',
		explorer_supplementalViews: 'supplemental-explorer-views',
		explorer_landCoverView: 'land-cover-view',
		explorer_landFormView: 'landform-view',
		explorer_climateRegionView: 'climate-region-view',
		projection_containerDiv: 'projection-container',
		projectionMode_mainView: 'projection-main-view',
		export_container: 'export-container',
		agolExport_iconID: 'export-icon',
		agolExport_form: 'export-form',
		noDisplayClass: 'not-displayed',
		dropDownClass: 'select-dropdown',
		dropDownBtn: 'select-button',
		dropDownDisplayClass: 'display',
		dropDownPlaceHolderClass: 'placeholder',
	},
	n = 'not-displayed',
	t = 'hidden',
	a = 'selected-btn',
	o = (n, t, a, o, i) => {
		const l = document.createElement('div');
		(l.classList.add(e.viewStyle_shadow),
			document.querySelector('main').append(l),
			document.querySelector('main').append(x),
			document.querySelector('main').append(h(o), y),
			p(n, t, a, i));
	},
	i = (n) => {
		const t = l(n.mode),
			a = d(e.projectionMode_mainView);
		return (
			console.log(a),
			t.append(a),
			document.querySelector('main').append(t),
			a
		);
	},
	l = (t) => {
		console.log(t);
		const a = document.createElement('div');
		return (
			(a.id = e.projection_containerDiv),
			'change' !== t && a.classList.add(n),
			a
		);
	},
	c = ({ explorerViewComponents: e }) => {
		s(e);
		return e;
	},
	s = (n) => {
		const t = w(),
			a = f(),
			o = document.createElement('div'),
			i = document.createElement('div'),
			l = document.createElement('div');
		return (
			(o.id = e.explorer_containerDiv),
			(i.id = e.explorer_mainView),
			(l.id = e.explorer_supplementalViews),
			n.forEach((n, o) => {
				n.id !== e.explorer_ecosystems ? l.append(n) : i.append(n, t, a);
			}),
			o.append(i),
			o.append(l),
			document.querySelector('main').append(o),
			o
		);
	},
	r = ({
		config: e,
		DOM_id_class_variables: n,
		hashParams: t,
		landformELUCategories: a,
		dropdownEvents: o,
		mapClickEventDelegation: i,
		explorerLookupTable: l,
		parseAndFormatURL: c,
		showInvalidNotificationDiv: s,
		createNewCrosshairGraphic: r,
	}) => {
		const p = [],
			v = d(n.explorer_ecosystems);
		p.push(v);
		a.map((a) => {
			const d = m({
				config: e,
				DOM_id_class_variables: n,
				hashParams: t,
				category: a,
				dropdownEvents: o,
				mapClickEventDelegation: i,
				explorerLookupTable: l,
				parseAndFormatURL: c,
				showInvalidNotificationDiv: s,
				createNewCrosshairGraphic: r,
			});
			p.push(d);
		});
		return p;
	},
	d = (e) => {
		const n = document.createElement('arcgis-map');
		return ((n.id = e), n);
	},
	p = (o, i, l, c) => {
		console.log('the hash params for the button UI build', l);
		const s = document.createElement('div'),
			r = document.createElement('div'),
			d = document.createElement('div'),
			p = `\n                            <button value='explore' class="viewMode btn ${'explore' === l.mode || '' === l.mode ? a : ''}">\n                              <calcite-icon id='explore-mode-tooltip' icon="information" scale="s"></calcite-icon>\n                                <calcite-tooltip reference-element="explore-mode-tooltip">\n                                <span>Explore current world terrestrial ecosystems. Three smaller map views below show the landform, land cover, and climate contributing to each distinct ecosystem.</span>\n                              </calcite-tooltip>\n                              <span>Current Ecosystems</span>\n                            </button>\n                            <button value='change' class="viewMode btn ${'change' === l.mode ? a : ''}">\n                              <calcite-icon id='projection-mode-tooltip' icon="information" scale="s"></calcite-icon>\n                                <calcite-tooltip reference-element="projection-mode-tooltip">\n                                <span>Explore how ecosystems may change by 2050, based on the projections of two divergent global climate models.</span>\n                              </calcite-tooltip>\n                              <span>2050 Change Projections</span>\n                            </button>\n                            `,
			m = `\n                            <button value="sustainable" class="changeModel btn ${'sustainable' === l.model ? a : ''}">\n                              <calcite-icon id='sustainable-model-tooltip' icon="information" scale="s"></calcite-icon>\n                                <calcite-tooltip reference-element="sustainable-model-tooltip">\n                                <span>A scenario where the world shifts toward environmentally friendly practices, develops toward lower inequality. Assumes a rapid decline in greenhouse gas emissions.</span>\n                              </calcite-tooltip>\n                              <span>Sustainable Future</span>\n                            </button>\n                            <button value="current" class="changeModel btn ${'current' === l.model ? a : ''}">\n                              <calcite-icon id='high-emissions-tooltip' icon="information" scale="s"></calcite-icon>\n                                <calcite-tooltip reference-element="high-emissions-tooltip">\n                                <span>A scenario defined by slow economic growth and material-intensive consumption that will likely double the amount of current CO2 by 2100.</span>\n                              </calcite-tooltip>\n                              <span>Current</span>\n                            </button>\n                            `,
			v = `\n                          <button value='2,4,6' class='filterChangeType btn ${'drier' === l.changeType ? a : ''}'> \n                            <calcite-icon id='drier-filter-tooltip' icon="information" scale="s"></calcite-icon>\n                            <calcite-tooltip reference-element="drier-filter-tooltip">\n                            <span>Areas projected to increase in aridity by 2050</span>\n                            </calcite-tooltip>\n                            <span>Drier</span> \n                          </button>\n                          <button value='1,4,5' class='filterChangeType btn ${'warmer' === l.changeType ? a : ''}'> \n                            <calcite-icon id='warmer-filter-tooltip' icon="information" scale="s"></calcite-icon>\n                            <calcite-tooltip reference-element="warmer-filter-tooltip">\n                            <span>Areas projected to increase in temperature  by 2050</span>\n                            </calcite-tooltip>\n                            <span>Warmer</span>\n                          </button>\n                          <button value='3,5,6' class='filterChangeType btn ${'landCover' === l.changeType ? a : ''}'> \n                            <calcite-icon id='landcover-filter-tooltip' icon="information" scale="s"></calcite-icon>\n                            <calcite-tooltip reference-element="landcover-filter-tooltip">\n                            <span>Areas where land cover type is expected to change by 2050</span>\n                            </calcite-tooltip>\n                            <span>Land Cover</span>\n                          </button>\n                          <button value='1,2,3,4,5,6' class='filterChangeType btn ${'any' === l.changeType ? a : ''}'> \n                            <calcite-icon id='anyChange-filter-tooltip' icon="information" scale="s"></calcite-icon>\n                            <calcite-tooltip reference-element="anyChange-filter-tooltip">\n                            <span>Areas where aridity, temperature, or land cover are expected to change by 2050</span>\n                            </calcite-tooltip>\n                            <span>Any Change</span>\n                           </button>\n                          <button value='7' class='filterChangeType btn ${'all' === l.changeType ? a : ''}'>\n                            <calcite-icon id='allChange-filter-tooltip' icon="information" scale="s"></calcite-icon>\n                            <calcite-tooltip reference-element="allChange-filter-tooltip">\n                            <span>Areas where aridity, temperature, and land cover are all expected to change by 2050</span>\n                            </calcite-tooltip>\n                            <span>All Change</span>\n                          </button>\n                          `;
		((s.innerHTML = p),
			(s.id = 'mode-btns'),
			(r.innerHTML = m),
			(r.id = 'changeModel-btns'),
			(d.innerHTML = v),
			(d.id = 'changeType-btns'),
			console.log(l?.model),
			l.model || d.classList.add(t),
			'change' !== l.mode &&
				(r.classList.add('hidden'), d.classList.add('hidden')),
			document.querySelector('main').addEventListener('click', (l) => {
				(l.stopImmediatePropagation,
					l.preventDefault,
					i(o, n, t, a, e.projection_containerDiv, s, r, d, l, c));
			}),
			document.querySelector('main').append(s, r, d));
	},
	m = ({
		config: e,
		DOM_id_class_variables: n,
		hashParams: a,
		category: o,
		dropdownEvents: i,
		mapClickEventDelegation: l,
		explorerLookupTable: c,
		parseAndFormatURL: s,
		showInvalidNotificationDiv: r,
		createNewCrosshairGraphic: d,
	}) => {
		const p = o.title,
			m = o.features,
			h = v({ dropdownFeatures: m }),
			w = u({ componentTitle: p }),
			g = document.createElement('arcgis-map');
		return (
			(g.id = o.title),
			g.append(h, w),
			g.addEventListener('click', (o) => {
				i(g, n, h, o, e, a, t, l, c, s, r, d);
			}),
			g
		);
	},
	v = ({ dropdownFeatures: n }) => {
		const a = n
				.map((e, n) => `<li class="choice" value="${e}">${e}</li>`)
				.join(''),
			o = `\n\t<button class=${e.dropDownBtn}> \n    <span class="placeholder ${e.dropDownDisplayClass}">Select a choice</span>\n\t  <span class="selected-value"></span>\n\t  <span class="arrow"></span>\n\n\t</button>\n\n\t<ul class="${e.dropDownClass} ${t}">\n\t  ${a}\n\t</ul>`,
			i = document.createElement('div');
		return (i.classList.add('dropdown-select'), (i.innerHTML = o), i);
	},
	u = ({ componentTitle: e }) => {
		const n = `\n  <calcite-link id='${e}-tooltip'>\n    <calcite-icon icon="information" scale="s"></calcite-icon>\n  </calcite-link>\n  <calcite-tooltip reference-element="${e}-tooltip">\n    <span>What a helpful tooltip for the ${e}</span>\n  </calcite-tooltip>\n  `,
			t = `<span class="pop-out-title">${e}</span>`,
			a = document.createElement('div');
		return (
			a.classList.add('label'),
			(a.innerHTML = `<div>${n} ${t}</div> <div><calcite-icon class='map-pop-out-icon' icon="full-screen" scale="l"> </calcite-icon></div>`),
			a
		);
	},
	h = (e) => {
		const n = document.createElement('div');
		n.id = 'user-icon';
		return (
			(n.innerHTML =
				'\n  <div class="profile">\n    <svg xmlns="http://www.w3.org/2000/svg" viewBox="1.5 -2 24 24" height="30" width="30"><path d="M19.5 15h-7A6.508 6.508 0 0 0 6 21.5V29h20v-7.5a6.508 6.508 0 0 0-6.5-6.5zM25 28H7v-6.5a5.506 5.506 0 0 1 5.5-5.5h7a5.506 5.506 0 0 1 5.5 5.5zm-9-14.2A5.8 5.8 0 1 0 10.2 8a5.806 5.806 0 0 0 5.8 5.8zm0-10.633A4.833 4.833 0 1 1 11.167 8 4.839 4.839 0 0 1 16 3.167z"></path></svg>\n    </div>\n  <div class="grabbedItemImage"></div>\n  '),
			n.addEventListener('click', e),
			n
		);
	},
	w = () => {
		console.log('NOTIFICATION');
		const e = document.createElement('div');
		e.classList.add('invalidSelectionNotification', 'combination');
		return (
			(e.innerHTML =
				'\n                                    <div class=\'notification-container\'>\n                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" height="48" width="48"> <path class="white-path" d="M5.828 3H29v23.172l-1-1v-4.274c-.07.026-.142.053-.207.079a2.6 2.6 0 0 1-.902.248l-1.601.007a2.37 2.37 0 0 1-1.674-.545 2.6 2.6 0 0 1-.582-.805l-.104.147c-.008.012-.023.028-.032.04l-.715-.714.034-.048a1.01 1.01 0 0 1 .815-.419l.072.003a1 1 0 0 1 .817.53 1.7 1.7 0 0 0 .355.515 1.4 1.4 0 0 0 1.014.296l1.6-.006a3 3 0 0 0 .54-.181l.218-.084a1 1 0 0 1 .352-.063V4h-4.453a.99.99 0 0 1-.524.885l-.204.107c-.624.325-1.391.725-1.478 1.066a4 4 0 0 0 .321.415 3 3 0 0 1 .32.424 1.5 1.5 0 0 1 .204.498 1 1 0 0 1-.424.998l-.107.09a5 5 0 0 1-.312.241 2 2 0 0 0-.395.341.6.6 0 0 0-.028.193 2 2 0 0 0 .049.352 1.03 1.03 0 0 1-.179.801 1 1 0 0 1-.7.41.92.92 0 0 0-.528.34.52.52 0 0 0-.162.345l.02.098c.139.676.4 1.942-.712 2.541a2.14 2.14 0 0 0-.618.832l-.1.185-.738-.738a2.67 2.67 0 0 1 .981-1.159c.346-.186.396-.542.206-1.465l-.02-.102a1.42 1.42 0 0 1 .374-1.175 1.9 1.9 0 0 1 1.2-.696l-.007-.03a3 3 0 0 1-.067-.54 1.6 1.6 0 0 1 .085-.52c.16-.478.714-.77.966-.985a3 3 0 0 1 .23-.187 1 1 0 0 0-.09-.178c-.124-.22-.777-.796-.777-1.267 0-1.022 1.128-1.543 2.226-2.12H6.829zm19.344 25H18.28a6 6 0 0 0 .33-1.434v-.606l-.384-.175a1 1 0 0 0 .007-.127c.026-.019.217-.127.343-.198a1.96 1.96 0 0 0 1.226-1.707 1.35 1.35 0 0 0-.268-.794c.04-.045.096-.101.138-.143.046-.046.1-.106.152-.164l-.714-.714c-.05.059-.09.115-.154.179-.05.051-.116.118-.165.172a1 1 0 0 0-.071 1.251.35.35 0 0 1 .082.213c0 .368-.23.562-.718.836a12 12 0 0 0-.427.25 1.02 1.02 0 0 0-.425.83 1 1 0 0 0 .378.905 8 8 0 0 1-.286 1.133 1 1 0 0 0-.018.293h-4.34a1 1 0 0 0 .02-.197 3.1 3.1 0 0 1 .237-1.095l.06-.168a3.2 3.2 0 0 0 .179-.756 1 1 0 0 0-.653-1.039 6 6 0 0 0-.612-.168c-.844-.198-.985-.404-1.005-.443-.254-.506-.112-.753.506-1.341l.18-.174a1.8 1.8 0 0 0 .705-1.241 1 1 0 0 0-1.325-.946l-.16.06a1.5 1.5 0 0 1-.61.134.577.577 0 0 1-.624-.49 1.53 1.53 0 0 1 .248-.758 1.75 1.75 0 0 0 .286-.892 2.3 2.3 0 0 0-.094-.597 2 2 0 0 1-.083-.516.94.94 0 0 1 .891-.982c.398 0 .596.227.943.845a1.23 1.23 0 0 0 1.197.625 1.39 1.39 0 0 0 1.11-.671l-.726-.726c-.107.212-.256.398-.384.398-.263 0-.295-.058-.312-.09a2.11 2.11 0 0 0-1.828-1.381 1.94 1.94 0 0 0-1.891 1.982 3 3 0 0 0 .116.775 1.3 1.3 0 0 1 .061.339.9.9 0 0 1-.161.41 2.5 2.5 0 0 0-.373 1.24 1.563 1.563 0 0 0 1.625 1.49 2.5 2.5 0 0 0 .974-.204l.12-.045v.006c0 .116-.236.35-.425.54-.48.48-1.548 1.284-.86 2.658a2.45 2.45 0 0 0 1.672.968 5 5 0 0 1 .496.135 2.3 2.3 0 0 1-.128.527l-.058.163a4 4 0 0 0-.295 1.428l-.012.063-.015.134H4V6.828l-1-1V29h23.172zm5.474 3.354-30-30 .707-.707 30 30z"></path> </svg>\n                                      <span>You\'ve created an ecological combination that doesn\'t exist!</span>\n                                      </div>'),
			e
		);
	},
	g = ({ DOM_id_class_variables: e }) => {
		const n = document.querySelector('.combination');
		(n.classList.add('show'),
			setTimeout(() => {
				n.classList.remove('show');
			}, 5e3));
	},
	b = ({ DOM_id_class_variables: e }) => {
		const n = document.querySelector('.mapLocation');
		(n.classList.add('show'),
			setTimeout(() => {
				n.classList.remove('show');
			}, 5e3));
	},
	f = () => {
		const e = document.createElement('div');
		(e.classList.add('invalidSelectionNotification', 'mapLocation'),
			console.log('notifications', e.classList));
		return (
			(e.innerHTML =
				'\n                                    <div class=\'notification-container\'>\n                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" height="48" width="48"> <path class="white-path" d="M5.828 3H29v23.172l-1-1v-4.274c-.07.026-.142.053-.207.079a2.6 2.6 0 0 1-.902.248l-1.601.007a2.37 2.37 0 0 1-1.674-.545 2.6 2.6 0 0 1-.582-.805l-.104.147c-.008.012-.023.028-.032.04l-.715-.714.034-.048a1.01 1.01 0 0 1 .815-.419l.072.003a1 1 0 0 1 .817.53 1.7 1.7 0 0 0 .355.515 1.4 1.4 0 0 0 1.014.296l1.6-.006a3 3 0 0 0 .54-.181l.218-.084a1 1 0 0 1 .352-.063V4h-4.453a.99.99 0 0 1-.524.885l-.204.107c-.624.325-1.391.725-1.478 1.066a4 4 0 0 0 .321.415 3 3 0 0 1 .32.424 1.5 1.5 0 0 1 .204.498 1 1 0 0 1-.424.998l-.107.09a5 5 0 0 1-.312.241 2 2 0 0 0-.395.341.6.6 0 0 0-.028.193 2 2 0 0 0 .049.352 1.03 1.03 0 0 1-.179.801 1 1 0 0 1-.7.41.92.92 0 0 0-.528.34.52.52 0 0 0-.162.345l.02.098c.139.676.4 1.942-.712 2.541a2.14 2.14 0 0 0-.618.832l-.1.185-.738-.738a2.67 2.67 0 0 1 .981-1.159c.346-.186.396-.542.206-1.465l-.02-.102a1.42 1.42 0 0 1 .374-1.175 1.9 1.9 0 0 1 1.2-.696l-.007-.03a3 3 0 0 1-.067-.54 1.6 1.6 0 0 1 .085-.52c.16-.478.714-.77.966-.985a3 3 0 0 1 .23-.187 1 1 0 0 0-.09-.178c-.124-.22-.777-.796-.777-1.267 0-1.022 1.128-1.543 2.226-2.12H6.829zm19.344 25H18.28a6 6 0 0 0 .33-1.434v-.606l-.384-.175a1 1 0 0 0 .007-.127c.026-.019.217-.127.343-.198a1.96 1.96 0 0 0 1.226-1.707 1.35 1.35 0 0 0-.268-.794c.04-.045.096-.101.138-.143.046-.046.1-.106.152-.164l-.714-.714c-.05.059-.09.115-.154.179-.05.051-.116.118-.165.172a1 1 0 0 0-.071 1.251.35.35 0 0 1 .082.213c0 .368-.23.562-.718.836a12 12 0 0 0-.427.25 1.02 1.02 0 0 0-.425.83 1 1 0 0 0 .378.905 8 8 0 0 1-.286 1.133 1 1 0 0 0-.018.293h-4.34a1 1 0 0 0 .02-.197 3.1 3.1 0 0 1 .237-1.095l.06-.168a3.2 3.2 0 0 0 .179-.756 1 1 0 0 0-.653-1.039 6 6 0 0 0-.612-.168c-.844-.198-.985-.404-1.005-.443-.254-.506-.112-.753.506-1.341l.18-.174a1.8 1.8 0 0 0 .705-1.241 1 1 0 0 0-1.325-.946l-.16.06a1.5 1.5 0 0 1-.61.134.577.577 0 0 1-.624-.49 1.53 1.53 0 0 1 .248-.758 1.75 1.75 0 0 0 .286-.892 2.3 2.3 0 0 0-.094-.597 2 2 0 0 1-.083-.516.94.94 0 0 1 .891-.982c.398 0 .596.227.943.845a1.23 1.23 0 0 0 1.197.625 1.39 1.39 0 0 0 1.11-.671l-.726-.726c-.107.212-.256.398-.384.398-.263 0-.295-.058-.312-.09a2.11 2.11 0 0 0-1.828-1.381 1.94 1.94 0 0 0-1.891 1.982 3 3 0 0 0 .116.775 1.3 1.3 0 0 1 .061.339.9.9 0 0 1-.161.41 2.5 2.5 0 0 0-.373 1.24 1.563 1.563 0 0 0 1.625 1.49 2.5 2.5 0 0 0 .974-.204l.12-.045v.006c0 .116-.236.35-.425.54-.48.48-1.548 1.284-.86 2.658a2.45 2.45 0 0 0 1.672.968 5 5 0 0 1 .496.135 2.3 2.3 0 0 1-.128.527l-.058.163a4 4 0 0 0-.295 1.428l-.012.063-.015.134H4V6.828l-1-1V29h23.172zm5.474 3.354-30-30 .707-.707 30 30z"></path> </svg>\n                                      <span>This location doesn\'t have an associated terrestrial ecosystem unit.</span>\n                                    </div>'),
			e
		);
	},
	x = (() => {
		const e = document.createElement('div');
		((e.id = 'pop-out-map-container'), e.classList.add('not-displayed'));
		return (
			(e.innerHTML =
				'\n                          <div id="pop-out-map">\n                          <div class="label"><div><calcite-icon icon="information" scale="s" aria-hidden="true" calcite-hydrated=""><template shadowrootmode="open">\x3c!----\x3e<svg aria-hidden="true" fill="currentColor" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" class=" svg " viewBox="0 0 16 16">\x3c!--?lit$398454607$--\x3e\x3c!----\x3e<path d="M8.5 6.5a1 1 0 1 1 1-1 1 1 0 0 1-1 1M8 13h1V8H8zm2-1H7v1h3zm5.8-3.5a7.3 7.3 0 1 1-7.3-7.3 7.3 7.3 0 0 1 7.3 7.3m-1 0a6.3 6.3 0 1 0-6.3 6.3 6.307 6.307 0 0 0 6.3-6.3"></path>\x3c!----\x3e</svg></template></calcite-icon> <span class="pop-out-title"></span></div> <div><calcite-icon icon="x" /></div></div>\n                          </div>\n                        '),
			e
		);
	})(),
	y = (() => {
		const e = document.createElement('div');
		return (
			(e.id = 'export-icon'),
			(e.innerHTML = '<calcite-icon icon="arcgis-online" />'),
			e
		);
	})();
(() => {
	const t = document.createElement('div');
	((t.id = e.export_container), t.classList.add(`${n}`));
	t.innerHTML =
		"\n                          <div class=\"form-container\">\n                            <form id=\"export-form\">\n                              <div class='form-element'>\n                                <label> ArcGIS Online Web Map Name* </label>\n                                <br>\n                                <textarea class='title' type='text' contenteditable='true'></textarea>\n                              </div>\n                              <div class='form-element'>\n                                <label>Tags</label>\n                                <br>\n                                <textarea class='tags' type='text' contenteditable='true'></textarea>\n                              </div>\n                              <div class='form-element'>\n                                <label>Summary</label>\n                                <br>\n                                <textarea class='summary' type='text' contenteditable='true'></textarea>\n                              </div>\n                              <div class='form-btn-container'>\n                                <div class='btn'>CANCEL</div>\n                                <div class='btn export'>CREATE WEB MAP</div>\n                              </div>\n\n                            </form>\n                          </div>\n                          ";
})();
export {
	o as buildAppHTML,
	c as buildExplorerMode,
	i as buildEcosystemProjectionView,
	r as initExplorerViewComponents,
	e as DOM_id_class_variables,
	g as showInvalidNotificationDiv,
	b as showInvalidMapLocationNotificationDiv,
};
