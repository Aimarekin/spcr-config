import type ConfigNamespace from "./ConfigNamespace";

export default class ConfigSocket extends EventTarget {
    constructor(
        readonly id: string,
        private readonly namespace: ConfigNamespace,
    ) {
        super();

        if (this.namespace._closed) {
            throw new Error(`ConfigNamespace ${this.namespace.id} is closed and cannot be used!`);
        }
        if (this.namespace.activeSockets[this.id]) {
            throw new Error(`ConfigSocket with id ${this.id} already exists! Do not create more than one class for the same setting.`);
        }

        this.namespace.activeSockets[this.id] = this;
    }

    getValue(): any {
        return this.namespace._getStored(this.id);
    }

    setValue(value: any) {
        const prevValue = this.getValue();
        this.namespace._setStored(this.id, value);

        if (prevValue !== value) {
            this.dispatchEvent(new Event("storedValueChange"));
        }
    }

    clearValue() {
        const prevValue = this.getValue();
        this.namespace._clearStored(this.id);

        if (prevValue !== undefined) {
            this.dispatchEvent(new Event("storedValueChange"));
        }
    }

    getFullName() {
        return `${this.namespace.id}.${this.id}`;
    }
}