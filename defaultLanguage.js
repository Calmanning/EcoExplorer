let preferredStrings = {};
let backUpStrings = {};

const URLSearchParamsString = window.location.search;

const getLanguageParam = () => {
	console.log(URLSearchParamsString);
	if (!URLSearchParamsString) {
		return 'en';
	}

	const searchParams = new URLSearchParams(URLSearchParamsString);
	const lang = searchParams.get('lang');

	console.log(lang);
	if (!lang) {
		return 'en';
	}

	return lang.toLowerCase();
};

const setHTMLLang = (preferredLanguage) => {
	document.documentElement.setAttribute('lang', `${preferredLanguage}`);
};

const fetchStrings = async (language) => {
	try {
		const fetchLanguageObject = await fetch(
			`./language/${language}/strings.JSON`,
		);

		if (fetchLanguageObject.status === 200) {
			return await fetchLanguageObject.json();
		} else {
			return {};
		}
	} catch (error) {
		console.log(`problem fetching the ${language} language strings`, error);
		throw error;
	}
};

//This was included for testing the initApp() workflow and the fetching chosen string json files.
// const delay = (milSec) => {
// 	return new Promise((resolve) => setTimeout(resolve, milSec));
// };

const getStringsJSON = async (preferredLanguage, defaultLanguage) => {
	// await delay(5000);
	console.log(preferredLanguage, defaultLanguage);
	try {
		//the backup strings represent the default language of the app. This JSON will always be fetched.

		backUpStrings = await fetchStrings(defaultLanguage);

		if (
			preferredLanguage !== defaultLanguage &&
			preferredLanguage !== undefined
		) {
			preferredStrings = await fetchStrings(preferredLanguage);
		}

		if (
			Object.keys(backUpStrings).length === 0 &&
			Object.keys(preferredStrings).length === 0
		) {
			const errorMessage = 'Cannot access any language.';
			throw errorMessage;
		}
	} catch (error) {
		console.log(`problem fetching language strings.`, error);
		throw error;
	}
};

const modifyTemplateString = (templateString, replacementValues) => {
	if (!replacementValues) return templateString;

	let newString = templateString;

	const valueStrings = Object.keys(replacementValues);

	valueStrings.map((valueKey) => {
		return (newString = newString.replace(
			`{{${valueKey}}}`,
			replacementValues[valueKey],
		));
	});

	return newString;
};

const getString = (keyString, value) => {
	//for string length testing in the UI
	// return keyString;

	if (preferredStrings[keyString]) {
		const templateString = preferredStrings[keyString];

		return modifyTemplateString(templateString, value);

		// return preferredStrings[keyString];
	} else if (backUpStrings[keyString]) {
		const backupTemplateString = backUpStrings[keyString];
		return modifyTemplateString(backupTemplateString, value);
	} else {
		return keyString;
	}
};

export { getString, setHTMLLang, getLanguageParam, getStringsJSON };
