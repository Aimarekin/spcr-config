export function useForceUpdate() {
    const [value, setValue] = Spicetify.React.useState(0);
    return () => setValue(value => value + 1);
}