declare global {
    interface Window {
        spcrConfigurationNamespaceRegistrySet: Set<string>;
    }
}

if (!window.spcrConfigurationNamespaceRegistrySet) {
    window.spcrConfigurationNamespaceRegistrySet = new Set<string>();
}

export function isNamespaceRegistered(namespace: string) {
    return window.spcrConfigurationNamespaceRegistrySet.has(namespace);
}

export function registerNamespace(namespace: string) {
    window.spcrConfigurationNamespaceRegistrySet.add(namespace);
}

export function unregisterNamespace(namespace: string) {
    window.spcrConfigurationNamespaceRegistrySet.delete(namespace);
}