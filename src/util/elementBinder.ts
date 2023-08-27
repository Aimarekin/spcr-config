export default function elementBinder(element: Element) {
    let disconnectCurrentObserver = () => { };

    return {
        bind: (selector: string, container: Element = document.documentElement) => {
            disconnectCurrentObserver();

            console.log("BINDING", selector, container);
            
            const foundElm = container.querySelector(selector);
            if (foundElm) {
                foundElm.appendChild(element);
                console.log("FOUND IMMEDIATE!")
                return;
            }

            element.remove();
            console.log("PASSING TO OBSERVE")

            const observer = new MutationObserver(() => {
                console.log("Observed!")
                const foundElm = container.querySelector(selector);
                if (foundElm) {
                    observer.disconnect();
                    foundElm.appendChild(element);
                    console.log("APPENDED!")
                }
            });

            observer.observe(container, { childList: true, subtree: true });
            disconnectCurrentObserver = () => observer.disconnect();
        },
        unbind: () => disconnectCurrentObserver()
    }
}