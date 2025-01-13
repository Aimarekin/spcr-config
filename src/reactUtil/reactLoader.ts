import throwIfSpicetifyNotReady from "../util/throwIfSpicetifyNotReady";

let reactFetched = false;
let reactDOMFetched = false;
let spicetifyReactComponentFetched = false;

let reactOverride: typeof Spicetify.React | null = null;
let reactDOMOverride: typeof Spicetify.ReactDOM | null = null;
let spicetifyReactComponentOverride: typeof Spicetify.ReactComponent | null = null;

export function getReact(): typeof Spicetify.React {
	reactFetched = true;

	if (reactOverride !== null) {
		return reactOverride;
	}

	throwIfSpicetifyNotReady("Spicetify.React is not ready yet.");
	return Spicetify.React;
}

export function getReactDOM(): typeof Spicetify.ReactDOM {
	reactDOMFetched = true;

	if (reactDOMOverride !== null) {
		return reactDOMOverride;
	}

	throwIfSpicetifyNotReady("Spicetify.ReactDOM is not ready yet.");
	return Spicetify.ReactDOM;
}

export function getSpicetifyReactComponent(): typeof Spicetify.ReactComponent {
	spicetifyReactComponentFetched = true;

	if (spicetifyReactComponentOverride !== null) {
		return spicetifyReactComponentOverride;
	}

	throwIfSpicetifyNotReady("Spicetify.ReactComponent is not ready yet.");
	return Spicetify.ReactComponent;
}

function warnIfFetched(hasFetched: boolean, overridenName: string) {
	if (hasFetched) {
		console.warn(`${overridenName} has been overriden after it was already fetched. This might cause issues!`);
	}
}

export function overrideReact(react: any | null = null) {
	warnIfFetched(reactFetched, "React");

	reactOverride = react;
}

export function overrideReactDOM(reactDOM: any | null = null) {
	warnIfFetched(reactDOMFetched, "ReactDOM");

	reactDOMOverride = reactDOM;
}

export function overrideSpicetifyReactComponent(spicetifyReactComponent: any | null = null) {
	warnIfFetched(spicetifyReactComponentFetched, "Spicetify.ReactComponent");

	spicetifyReactComponentOverride = spicetifyReactComponent;
}
