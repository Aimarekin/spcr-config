const CSS_VERSION = 1;

export function spcrClasses(names: string[]|string) {
    if (typeof names === "string") {
        names = names.split(/ +/);
    }

    return names.map((className) => `spcr-config-${className} spcr-config_styling__${CSS_VERSION}-${className}`).join(" ");
}