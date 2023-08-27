export default class NamespaceRegisteredError extends Error {
    name = "NamespaceRegisteredError";

    constructor(
        public namespaceId: string
    ) {
        super(`ConfigNamespace with id ${namespaceId} already exists. Extension might have duplicate instances.`);
    }
}