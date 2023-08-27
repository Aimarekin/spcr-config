import { isSpicetifyReady } from "./spicetifyLoader";

import SpicetifyNotLoadedError from "./errors/SpicetifyNotLoadedError";

export default function throwIfSpicetifyNotReady(operationDenied?: string) {
    if (!isSpicetifyReady()) {
        throw new SpicetifyNotLoadedError(operationDenied);
    }
}