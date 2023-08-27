let spicetifyReady = false;
const promiseResolvers: (() => void)[] = [];

(function checkSpicetifyReady () {
    if (!(window.Spicetify
        && Spicetify.LocalStorage
        && Spicetify.React
        && Spicetify.ReactDOM
        && Spicetify.ReactComponent
        && Spicetify.Platform
        && Spicetify.Platform.History
    )) {
        setTimeout(checkSpicetifyReady, 100);
        return;
    }
    spicetifyReady = true;
    promiseResolvers.forEach((resolve) => resolve());
})();

export function isSpicetifyReady(): boolean {
    return spicetifyReady;
}

export async function waitForSpicetify(): Promise<void> {
    if (spicetifyReady) {
        return Promise.resolve();
    }
    return new Promise((resolve) => {
        promiseResolvers.push(resolve);
    })
}