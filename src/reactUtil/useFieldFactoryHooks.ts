import { getReact } from "./reactLoader";

import type ConfigField from "../configControllers/configFields/ConfigField";

import { useForceUpdate } from "./hooks";

export default function useFieldFactoryHooks(field: ConfigField<any>) {
    // useSyncExternalStore is not available until React 18
    // This (roughly) mimics its behavior
    const forceUpdate = useForceUpdate();
    
    getReact().useEffect(() => {
        field.addEventListener("renderingChange", forceUpdate);
        return () => field.removeEventListener("renderingChange", forceUpdate);
    }, []);
}