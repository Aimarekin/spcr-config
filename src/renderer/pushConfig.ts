import elementBinder from "../util/elementBinder";

import throwIfSpicetifyNotReady from "../util/throwIfSpicetifyNotReady";

function generateDefaultSorterFunction(elm: HTMLElement) {
    return (otherElm: HTMLElement) => {
        if (!elm.dataset.sortingName || !otherElm.dataset.sortingName) {
            return false;
        }

        switch (elm.dataset.sortingName.localeCompare(otherElm.dataset.sortingName)) {
            case -1: {
                return true;
            }
            case 1: {
                return false;
            }
            case 0: {
                if (!elm.dataset.sortingCreationTimestamp || !otherElm.dataset.sortingCreationTimestamp) {
                    return false;
                }
                return parseInt(elm.dataset.sortingCreationTimestamp) < parseInt(otherElm.dataset.sortingCreationTimestamp);
            }
        }
    }
}

export default function pushConfig(elm: HTMLElement, sorterFunction: (otherElm: HTMLElement) => boolean = generateDefaultSorterFunction(elm)): () => void {
    throwIfSpicetifyNotReady("pushConfig() can only be called after Spicetify has loaded.")

    const { bind: bindConfig, unbind: unbindConfig } = elementBinder(elm);

    console.log("RENDERED CONFIG", elm);

    function bindToPreferences() {
        console.log("BINDED TO PREFS!");
        bindConfig("main > .x-settings-container", document.querySelector(".main-view-container")!);
    }

    if (Spicetify.Platform.History.location === "/preferences") {
        bindToPreferences();
    }

    const cancelHistoryListener = Spicetify.Platform.History.listen((location: any) => {
        console.log("LISTENED!", location)
        if (location.pathname !== "/preferences") {
            elm.remove();
            return
        }
        bindToPreferences();
    });

    return () => {
        cancelHistoryListener();
        unbindConfig();
        elm.remove();
    }
}