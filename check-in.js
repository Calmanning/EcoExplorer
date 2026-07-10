import { initApp as e } from './main.js?v=0.01';
const n = 'password',
	o = 'submitBtn',
	t = 'DoNotReshare!',
	l = `\n<div class='input-container'>\n  \n    <label for="password">Password, please</label>\n    <input \n      type="text" \n      id="${n}"\n      name="password" \n      placeholder="Enter password" \n      autocomplete="off"\n    >\n    <button type="button" id='${o}' class='btn'>Enter</button>\n  \n</div>`,
	r = () => {
		console.log('begin check in');
		const l = s();
		console.log(l);
		const r = document.getElementById(`${n}`);
		console.log(r);
		const c = document.getElementById(`${o}`);
		(console.log(c),
			r.addEventListener('keydown', (n) => {
				if ((console.log('keydown'), 'Enter' === n.key)) {
					const o = r.value;
					if (o === t)
						return (
							n.preventDefault(),
							console.log('true', o),
							l.remove(),
							e(),
							!0
						);
					((r.value = ''), (r.placeholder = 'Try again'));
				}
			}),
			c.addEventListener('click', (n) => {
				(n.preventDefault(), console.log('input'), console.log(r.value));
				const o = r.value;
				if (o === t) return (console.log('true', o), l.remove(), e(), !0);
				((r.value = ''), (r.placeholder = 'Try again'));
			}));
	},
	s = () => {
		const e = document.createElement('div');
		return (
			(e.id = 'checkIn-container'),
			(e.innerHTML = l),
			document.body.prepend(e),
			e
		);
	};
export { r as checkIn };
