export default class SpicetifyNotLoadedError extends Error {
    name = "SpicetifyNotLoadedError";

    constructor(
        public operationDenied?: string
    ) {
        super(
            "Spicetify has not yet loaded. "
            + (operationDenied ? operationDenied + " " : "")
            + "Wait for Spicetify to load by importing isSpicetifyReady() or the async function waitSpicetifyReady()"
        );
    }
}