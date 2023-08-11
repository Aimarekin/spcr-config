import ConfigStore from "../ConfigStore"
import type ConfigNamespace from "../ConfigNamespace"

import { ConfigFieldProps } from "../ConfigProps";

export default class ConfigField<T> extends ConfigStore<T> {
    private _description?: string;
    private _help?: string;

    constructor (
        id: string,
        namespace: ConfigNamespace,
        props: ConfigFieldProps<T>,
    ) {
        const { defaultValue, description, help } = props;

        super(id, namespace, defaultValue);
        this._description = description;
        this._help = help;

        super.addEventListener("valueChange", () => this.dispatchEvent(new Event("renderingChange")));
        super.addEventListener("defaultChange", () => this.dispatchEvent(new Event("renderingChange")));
    }

    get description() {
        return this._description;
    }

    set description(value: string | undefined) {
        if (value === this._description) {
            return;
        }
        this._description = value;
        this.dispatchEvent(new Event("renderingChange"));
    }

    get help() {
        return this._help;
    }

    set help(value: string | undefined) {
        if (value === this._help) {
            return;
        }
        this._help = value;
        this.dispatchEvent(new Event("renderingChange"));
    }

    Render() {
        throw new Error("Render method not implemented. Please extend ConfigField and implement a Render method.");
    }
}