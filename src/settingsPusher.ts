type Arrayable<T> = T | T[];

export function pushToSettings(elements: Arrayable< React.ReactNode | ConfigField<any> > ): () => void {
    function adapt(elm: React.ReactNode | ConfigField<any>): React.ReactNode {
        return elm instanceof ConfigField ? elm.Render() : elm;
    }

    const node = Spicetify.React.Fragment({
        children: elements instanceof Array ? elements.map(adapt) : adapt(elements)
    });
    if (!node) return () => { };

    const settingsContainer = document.createElement("div");
    settingsContainer.classList.add("spcr-config-container");

    Spicetify.ReactDOM.createPortal(node, settingsContainer);

    const settingsObserver = new MutationObserver(() => {
        const settings = document.getElementsByClassName("x-settings-container")[0];

        if (settings) {
            settings.appendChild(settingsContainer);
            settingsObserver.disconnect();
        }
    });

    function startObserver() {
        settingsObserver.observe(document.getElementsByTagName("main")[0] || document.body, { childList: true, subtree: true });
    }

    if (Spicetify.Platform.History.location === "/preferences") {
        startObserver();
    }

    const removeHistoryListener = Spicetify.Platform.History.listen((location) => {
        if (location.pathname !== "/preferences") {
            settingsContainer.remove();
            return
        }
        startObserver();
    })

    return () => {
        removeHistoryListener()
        settingsObserver.disconnect();
        settingsContainer.remove();
    }
}