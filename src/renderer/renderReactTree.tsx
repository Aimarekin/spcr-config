import { getReactDOM } from "../reactUtil/reactLoader";

export default function renderConfigReactTree(tree: React.ReactElement): HTMLDivElement {
	const settingsContainer = document.createElement("div");
	settingsContainer.classList.add("spcr-config-tree");

	settingsContainer.dataset.sortingCreationTimestamp = Date.now().toString();

	getReactDOM().render(tree, settingsContainer);

	return settingsContainer;
}
