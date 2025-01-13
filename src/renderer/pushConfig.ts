import callbackOnSelectorFound from "../util/callbackOnSelectorFound";
import { waitForSpicetify } from "../util/spicetifyLoader";

import throwIfSpicetifyNotReady from "../util/throwIfSpicetifyNotReady";

function generateDefaultSorterFunction(elm: Element) {
	return (otherElm: Element) => {
		if (!otherElm.classList.contains("spcr-config-tree")) {
			return false;
		}

		const elmName = elm.getElementsByClassName("spcr-config-header-extension-name")[0]?.textContent?.trim();
		// eslint-disable-next-line prettier/prettier
		const otherElmName = otherElm.getElementsByClassName("spcr-config-header-extension-name")[0]?.textContent?.trim();
		if (!(elmName && otherElmName)) {
			return false;
		}

		switch (elmName.localeCompare(otherElmName)) {
			case -1: {
				return true;
			}
			case 1: {
				return false;
			}
			case 0: {
				if (!(elm instanceof HTMLElement && otherElm instanceof HTMLElement)) {
					return false;
				}

				if (!(elm.dataset.sortingCreationTimestamp && otherElm.dataset.sortingCreationTimestamp)) {
					return false;
				}
				return (
					parseInt(elm.dataset.sortingCreationTimestamp) < parseInt(otherElm.dataset.sortingCreationTimestamp)
				);
			}
		}
	};
}

export default function pushConfig(
	elm: Element,
	sorterFunction: (otherElm: Element) => boolean = generateDefaultSorterFunction(elm)
): () => void {
	let hasCancelledWhileSpicetifyLoading = false;
	let unbind = () => {
		hasCancelledWhileSpicetifyLoading = true;
	};

	waitForSpicetify().then(() => {
		if (hasCancelledWhileSpicetifyLoading) {
			return;
		}

		let unbindToPreferences = () => {};

		function bindToPreferences() {
			unbindToPreferences = callbackOnSelectorFound(
				"main > .x-settings-container",
				(foundElm) => {
					for (const child of Array.from(foundElm.children)) {
						if (!sorterFunction(child)) {
							foundElm.insertBefore(elm, child);
							return;
						}
					}
					foundElm.appendChild(elm);
				},
				document.querySelector(".main-view-container") || document.documentElement
			);
		}

		if (Spicetify.Platform.History.location === "/preferences") {
			bindToPreferences();
		}

		const cancelHistoryListener = Spicetify.Platform.History.listen((location: any) => {
			if (location.pathname !== "/preferences") {
				elm.remove();
				return;
			}
			bindToPreferences();
		});

		unbind = () => {
			cancelHistoryListener();
			unbindToPreferences();
			elm.remove();
		};
	});

	return () => {
		unbind();
	};
}
