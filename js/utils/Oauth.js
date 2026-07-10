let e, t, n, o;
const r = async (e) => {
		const t = `https://www.arcgis.com/sharing/rest/oauth2/token?grant_type=client_credentials&client_id=${e.appId}&client_secret=038b988f271d4612a6abe7826972f894`,
			n = fetch(t),
			o = await n;
		console.log(o);
		const r = await o.json();
		console.log(r);
		const s = r.access_token;
		return (console.log(s), s);
	},
	s = () =>
		new Promise((o, r) => {
			e
				? o(e)
				: t.getCredential(n.portalUrl + '/sharing').then((t) => {
						((e = t), o(t));
					});
		}),
	l = async (r) => {
		const s = r.appId,
			l = r.portalURL,
			i = await new Promise((r, c) => {
				require([
					'esri/portal/Portal',
					'esri/identity/OAuthInfo',
					'esri/identity/IdentityManager',
				], function (c, i, a) {
					((t = a),
						(n = new i({
							portalUrl: l,
							appId: s,
							preserveUrlHash: !0,
							popup: !1,
						})),
						t.registerOAuthInfos([n]),
						t
							.checkSignInStatus(`${l}/sharing`, s)
							.then((t) => {
								((e = t), u(t));
							})
							.catch(() => {
								r();
							}));
					const u = (e) => {
						((o = new c(l)),
							(o.authMode = 'immediate'),
							o.load().then(() => {
								const t = {
									name: o.user.fullName,
									userName: o.user.username,
									url: o.url,
									urlKey: o.urlKey,
									customUrl: o.customBaseUrl,
									img: o.user.thumbnailUrl,
									thumbnail: o.user.thumbnail,
									restUrl: o.restUrl,
									token: e.token,
								};
								r(t);
							}));
					};
				});
			});
		return (console.log('got to the end of Auth'), i && c(i), i);
	},
	c = (e) => {
		console.log('called', e);
		const t = document.createElement('img');
		(e.img &&
			(console.log('heres the img', e.img),
			t.setAttribute('src', `${e.img}`),
			document.querySelector('#user-icon .profile svg').remove(),
			document.querySelector('#user-icon .profile').append(t)),
			i());
	},
	i = () => {
		const e = document.createElement('div');
		(e.classList.add('logOut-icon'),
			(e.innerHTML =
				'\n    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 19 19">\n      <path d="M8.5 1.2a7.3 7.3 0 1 0 7.3 7.3 7.3 7.3 0 0 0-7.3-7.3zm3.818 10.128l-.99.99L8.5 9.49l-2.828 2.828-.99-.99L7.51 8.5 4.682 5.672l.99-.99L8.5 7.51l2.828-2.828.99.99L9.49 8.5z"></path>\n    </svg>'),
			document.querySelector('#user-icon .profile').append(e),
			a());
	},
	a = () => {
		document.querySelector('.logOut-icon').addEventListener('click', (n) => {
			(n.stopImmediatePropagation(),
				t.destroyCredentials(),
				(e = null),
				window.location.reload(),
				(document.querySelector('#user-icon .profile').innerHTML =
					userIconHTML));
		});
	};
export { l as authorization, s as getCredentials, r as get_DEV_token };
