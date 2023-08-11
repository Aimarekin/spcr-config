export let spicetifyReady = false;

const isSpicetifyReady = () => window.Spicetify && Spicetify.LocalStorage && Spicetify.React && Spicetify.ReactDOM;

(function checkSpotifyReady () {
    if (!isSpicetifyReady()) {
        setTimeout(checkSpotifyReady, 100);
        return;
    }
    spicetifyReady = true;
})();

export async function waitForSpicetify(): Promise<void> {
    while (!spicetifyReady) {
        await new Promise((resolve) => setTimeout(resolve, 50));
    }
}