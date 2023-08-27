declare global {
    interface Window {
        _spcrConfigNamespaceRegistrySet: Set<string>;
    }
}

if (!window._spcrConfigNamespaceRegistrySet) {
    window._spcrConfigNamespaceRegistrySet = new Set<string>();
}

export function isNamespaceRegistered(namespace: string) {
    return window._spcrConfigNamespaceRegistrySet.has(namespace);
}

export function registerNamespace(namespace: string) {
    window._spcrConfigNamespaceRegistrySet.add(namespace);
}