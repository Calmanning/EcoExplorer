new URL(window.location.href);
let e = new URL(window.location.href).hash.slice(1);
const t = () => {
		console.log('calling the URL');
		let e = new URL(window.location.href).hash.slice(1);
		return o(e);
	},
	o = (e) => {
		let t = e.split('&'),
			o = {};
		return (
			'' !== t[0]
				? t.forEach((e) => {
						const [t, n] = e.split('=');
						o[t] = n;
					})
				: ((o.ext = ''), (o.zoom = ''), (o.mode = '')),
			o
		);
	},
	n = ({ viewComponent: e }) => {
		const t = {
				ext: e?.extent
					? `${e?.extent?.center.longitude.toFixed(2)},${e?.extent?.center.latitude.toFixed(2)}`
					: null,
				zoom: e?.zoom.toFixed(0) || null,
			},
			o = l(t),
			n = c(o);
		r(n);
	},
	i = ({
		viewModeString: e,
		changeModelString: t,
		changeTypeString: o,
		exportState: n,
		event: i,
	}) => {
		t
			? (({ changeModelString: e }) => {
					const t = l({ model: e }),
						o = c(t);
					r(o);
				})({ changeModelString: t })
			: (o &&
					(({ changeTypeString: e }) => {
						const t = l({ changeType: e }),
							o = c(t);
						r(o);
					})({ changeTypeString: o }),
				e &&
					(({ viewModeString: e }) => {
						const t = l({ mode: e }),
							o = c(t);
						r(o);
					})({ viewModeString: e }),
				(!0 !== n && !1 !== n) ||
					(({ exportState: e }) => {
						const t = l({ export: e }),
							o = c(t);
						r(o);
					})({ exportState: n }),
				i &&
					(({ event: e }) => {
						console.log(e.detail.mapPoint.clone().normalize());
						const t = e.detail.mapPoint.clone().normalize(),
							o = { loc: [t.longitude.toFixed(2), t.latitude.toFixed(2)] },
							n = l(o),
							i = c(n);
						r(i);
					})({ event: i }));
	},
	l = (e) => {
		const t = o(window.location.hash.slice(1));
		return (
			Object.entries(e).forEach(([e, o]) => {
				t[e] = o;
			}),
			t
		);
	},
	c = (t) => {
		let o = new URLSearchParams(e);
		return (
			Object.entries(t).forEach(([e, t]) => {
				null !== t && 'undefined' !== t && void 0 !== t && o.set(e, t);
			}),
			o.toString()
		);
	},
	r = (t) => {
		((window.location.hash = decodeURIComponent(t)),
			(e = window.location.hash.slice(1)));
	};
export {
	t as parseAndFormatURL,
	n as formatExtentParametersAndUpdateHashParams,
	i as updateHashParamString,
};
