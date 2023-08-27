import { getReact } from "./reactLoader";

export function useForceUpdate() {
    const setValue = getReact().useState(0)[1];
    return () => setValue(value => value + 1);
}
