let userCredentials;
let esriAccountId;
let info;
let portal;

const get_DEV_token = async (config) => {
	const secret = '038b988f271d4612a6abe7826972f894';

	const tokenRequestURL = `https://www.arcgis.com/sharing/rest/oauth2/token?grant_type=client_credentials&client_id=${config.appId}&client_secret=${secret}`;
	const getRequest = fetch(tokenRequestURL);

	const responseRequest = await getRequest;

	console.log(responseRequest);
	const responseRequest_JSON = await responseRequest.json();
	console.log(responseRequest_JSON);
	const token = responseRequest_JSON.access_token;

	console.log(token);
	return token;
};

const getCredentials = () => {
	return new Promise((resolve, reject) => {
		if (!userCredentials) {
			esriAccountId
				.getCredential(info.portalUrl + '/sharing')
				.then((credential) => {
					userCredentials = credential;
					resolve(credential);
				});
		} else {
			resolve(userCredentials);
		}
	});
};

const authorization = async (config) => {
	const appId = config.appId;
	const portalUrl = config.portalURL;

	const portalData = await new Promise((resolve, reject) => {
		require([
			'esri/portal/Portal',
			'esri/identity/OAuthInfo',
			'esri/identity/IdentityManager',
		], function (Portal, OAuthInfo, esriId) {
			esriAccountId = esriId;

			// if (config.enablePortalAuthentication === false) {
			// 	document.getElementById('user-icon').remove();
			// 	document
			// 		.querySelector('.icon.save-all')
			// 		.closest('.iconWrapper')
			// 		.remove();

			// 	document.querySelector(
			// 		'.pinned-mode-options .pinned-mode-sub-section',
			// 	).style.justifyContent = 'space-around';

			// 	resolve(false);
			// }

			info = new OAuthInfo({
				portalUrl: portalUrl,
				appId,
				preserveUrlHash: true,
				popup: false,
			});

			esriAccountId.registerOAuthInfos([info]);

			esriAccountId
				.checkSignInStatus(`${portalUrl}/sharing`, appId)
				.then((credential) => {
					userCredentials = credential;
					handleSignedIn(credential);
				})
				.catch(() => {
					resolve();
				});

			const handleSignedIn = (credential) => {
				portal = new Portal(portalUrl);

				portal.authMode = 'immediate';

				portal.load().then(() => {
					const results = {
						name: portal.user.fullName,
						userName: portal.user.username,
						url: portal.url,
						urlKey: portal.urlKey,
						customUrl: portal.customBaseUrl,
						img: portal.user.thumbnailUrl,
						thumbnail: portal.user.thumbnail,
						restUrl: portal.restUrl,
						token: credential.token,
					};

					resolve(results);
				});
			};
		});
	});
	console.log('got to the end of Auth');

	if (portalData) {
		addAccountImage(portalData);
	}

	return portalData;
};

const addAccountImage = (accountInfo) => {
	console.log('called', accountInfo);
	const profileImg = document.createElement('img');
	if (accountInfo.img) {
		console.log('heres the img', accountInfo.img);
		profileImg.setAttribute('src', `${accountInfo.img}`);
		document.querySelector('#user-icon .profile svg').remove();
		document.querySelector('#user-icon .profile').append(profileImg);
	}

	addLogOutElement();
};

const logOutTry = () => {
	esriAccountId.destroyCredentials();
	userCredentials = null;
	window.location.reload();
};

const setAnonymousUser = () => {
	document.querySelector('#user-icon .profile').innerHTML = userIconHTML;
};

const addLogOutElement = () => {
	const xIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 19 19">
      <path d="M8.5 1.2a7.3 7.3 0 1 0 7.3 7.3 7.3 7.3 0 0 0-7.3-7.3zm3.818 10.128l-.99.99L8.5 9.49l-2.828 2.828-.99-.99L7.51 8.5 4.682 5.672l.99-.99L8.5 7.51l2.828-2.828.99.99L9.49 8.5z"></path>
    </svg>`;
	const logOutIMG = document.createElement('div');
	logOutIMG.classList.add('logOut-icon');
	logOutIMG.innerHTML = xIcon;

	document.querySelector('#user-icon .profile').append(logOutIMG);
	logOutListener();
};

const logOutListener = () => {
	document.querySelector('.logOut-icon').addEventListener('click', (event) => {
		event.stopImmediatePropagation();
		logOutTry();
		setAnonymousUser();
	});
};

export { authorization, getCredentials, get_DEV_token };
