import { getReactDOM } from "../reactUtil/reactLoader";

export default function renderReactTree(tree: React.ReactElement, sortingName?: string): HTMLDivElement {
    const settingsContainer = document.createElement("div");
    settingsContainer.classList.add("spcr-config-container");

    settingsContainer.dataset.sortingName = sortingName;
    settingsContainer.dataset.sortingCreationTimestamp = Date.now().toString();

    getReactDOM().render(tree, settingsContainer);

    return settingsContainer;
}