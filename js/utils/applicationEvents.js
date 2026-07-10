import { updateHashParamString as e } from './URL_params.js?v0.01';
import { initPopOutView as t } from '../view.js?v=0.01';
const s = (e) => {
		console.log(e);
	},
	o = (e, t, s, o, c, r, l, n) => {
		document.querySelector('main').addEventListener('click', (i) => {
			a(e, i, t, s, o, c, r, l, n);
		});
	},
	a = (e, t, s, o, a, r, l, n, i) => {
		if (
			(t.target.closest('.dropdown-select') || d(t),
			'pop-out-map-container' === t.target.id ||
				('x' === t.target.icon && t.target.closest('#pop-out-map-container')))
		) {
			const e = t.target.closest('#pop-out-map-container');
			c(e);
		}
		(t.target.id !== s.agolExport_iconID &&
			'arcgis-online' !== t.target.icon) ||
			(console.log('make the export UI and get the mapView Data', a),
			u({ config: e, DOM_id_class_variables: s, mapViews: a }),
			l(e, s, o, a, n, i),
			r());
	},
	c = (e) => {
		e.classList.contains('not-displayed')
			? e.classList.remove('not-displayed')
			: e.classList.add('not-displayed');
	},
	r = (t, s, o, a, c, r, l, n, i, d) => {
		if (!i.target.closest('button')) return;
		if (i.target.closest('button').classList.contains(a)) return;
		const u = document.querySelector(`#${c}`),
			p = i.target.closest('button'),
			g = n.querySelector(`.${a}`) ? n.querySelector(`.${a}`).value : '';
		if ('mode-btns' === p.parentElement.id) {
			const t = i.target.closest('button').value;
			u.classList.contains(s)
				? (u.classList.remove(s),
					l.classList.remove(o),
					l.querySelector(`.${a}`) && n.classList.remove(o))
				: (u.classList.add(s), l.classList.add(o), n.classList.add(o));
			(r.querySelectorAll('button').forEach((e) => {
				e.classList.remove('selected-btn');
			}),
				i.target.closest('button').classList.add('selected-btn'),
				e({ viewModeString: t }));
		}
		if ('changeModel-btns' === p.parentElement.id) {
			n.classList.remove(o);
			(p.parentElement.querySelectorAll('button').forEach((e) => {
				e.classList.remove('selected-btn');
			}),
				i.target.closest('button').classList.add('selected-btn'));
			const t = i.target.closest('button').value;
			e({ changeModelString: t });
		}
		if ('changeModel-btns' === p.parentElement.id && !1 !== g) {
			d(t, u, i.target.closest('button').value, g);
		}
		if ('changeType-btns' === p.parentElement.id) {
			const s = l.querySelector(`.${a}`).value.toLowerCase().trim();
			(p.parentElement.querySelectorAll('button').forEach((e) => {
				e.classList.remove('selected-btn');
			}),
				i.target.closest('button').classList.add('selected-btn'));
			const o = i.target.closest('button').value;
			(e({ changeTypeString: o }), d(t, u, s, o));
		}
	},
	l = async (e, s, o, a, r, l, u, p, g, m, b, v) => {
		if (
			(console.log('dropdown evenrts', a.target),
			a.target.closest('.map-pop-out-icon'))
		) {
			const e = document.querySelector('#pop-out-map-container'),
				s = document.querySelector('#pop-out-map');
			s.querySelector('arcgis-map') && s.querySelector('arcgis-map').remove();
			const n = await t(a, r, l, m),
				i = s.querySelector('.label .pop-out-title'),
				d = o.querySelector('.display').textContent.trim(),
				p = a.target
					.closest('.label')
					.querySelector('.pop-out-title').textContent;
			((i.textContent = `${p}: ${d}`), s.append(n), c(e, u));
		}
		if (a.target.classList.contains('choice')) {
			const e = a.target.getAttribute('value'),
				t = o.querySelector('.display');
			(n({ selectedValue: e, selectDisplayElement: t }),
				p({
					event: a,
					config: r,
					explorerLookupTable: g,
					DOM_id_class_variables: s,
					showInvalidNotificationDiv: b,
					createNewCrosshairGraphic: v,
				}));
		}
		if (a.target.closest('.dropdown-select')) {
			if (!o.querySelector('ul').classList.contains(`${u}`))
				return void i(o, u);
			(d(a), i(o, u));
		}
	},
	n = ({ selectedValue: e, selectDisplayElement: t }) => {
		(t.classList.contains('placeholder') && t.classList.remove('placeholder'),
			(t.innerHTML = e));
	},
	i = (e, t) => {
		const s = e.querySelector('ul'),
			o = !s.classList.contains(t);
		(s.classList.toggle(t), e.setAttribute('aria-expanded', o));
	},
	d = (e) => {
		if (e.target.classList.contains('choice')) return;
		document.querySelectorAll('.select-dropdown').forEach((e) => {
			e.classList.contains('hidden') ||
				(e.classList.toggle('hidden', !0), e.setAttribute('aria-expanded', !1));
		});
	},
	u = ({ DOM_id_class_variables: t, mapViews: s }) => {
		const o = document.querySelector(`#${t.export_container}`);
		if (o) {
			o.remove();
			return void e({ exportState: !1 });
		}
		e({ exportState: !0 });
	};
export {
	s as setViewMode,
	r as changeViewMode,
	l as dropdownEvents,
	o as initAppTopLevelEventListener,
	u as toggle_AGOL_Export,
};
