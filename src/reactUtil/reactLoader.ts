import throwIfSpicetifyNotReady from "../util/throwIfSpicetifyNotReady";

let reactOverride: any | null = null;
let reactDOMOverride: any | null = null;
let spicetifyReactComponentOverride: any | null = null;

export function getReact(): typeof Spicetify.React {
    if (reactOverride !== null) {
        return reactOverride;
    }

    throwIfSpicetifyNotReady("Spicetify.React is not ready yet.");
    return Spicetify.React
}

export function getReactDOM(): typeof Spicetify.ReactDOM {
    if (reactDOMOverride !== null) {
        return reactDOMOverride;
    }

    throwIfSpicetifyNotReady("Spicetify.ReactDOM is not ready yet.");
    return Spicetify.ReactDOM
}

export function getSpicetifyReactComponent(): typeof Spicetify.ReactComponent {
    if (spicetifyReactComponentOverride !== null) {
        return spicetifyReactComponentOverride;
    }

    throwIfSpicetifyNotReady("Spicetify.ReactComponent is not ready yet.");
    return Spicetify.ReactComponent
}

export function overrideReact(react: any | null = null) {
    reactOverride = react;
}

export function overrideReactDOM(reactDOM: any | null = null) {
    reactDOMOverride = reactDOM;
}

export function overrideSpicetifyReactComponent(spicetifyReactComponent: any | null = null) {
    spicetifyReactComponentOverride = spicetifyReactComponent;
}