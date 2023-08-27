import ConfigStore from "../ConfigStore"
import type ConfigNamespace from "../ConfigNamespace"

export default class ConfigField<T> extends ConfigStore<T> {
    constructor (
        id: string,
        namespace: ConfigNamespace,
        defaultValue: T,
    ) {
        super(id, namespace, defaultValue);

        super.addEventListener("valueChange", () => this.dispatchEvent(new Event("renderingChange")));
        super.addEventListener("defaultChange", () => this.dispatchEvent(new Event("renderingChange")));
    }
}