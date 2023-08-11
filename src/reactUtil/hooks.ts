export function useForceUpdate() {
    const setValue = Spicetify.React.useState(0)[1];
    return () => setValue(value => value + 1);
}