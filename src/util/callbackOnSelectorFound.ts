export default function callbackOnSelectorFound(
	selector: string,
	callback: (foundElm: Element) => void,
	within: Element = document.documentElement
) {
	const observer = new MutationObserver(() => {
		const foundElm = within.querySelector(selector);
		if (foundElm) {
			observer.disconnect();
			callback(foundElm);
			return;
		}
	});

	observer.observe(within, { childList: true, subtree: true });

	return observer.disconnect;
}
