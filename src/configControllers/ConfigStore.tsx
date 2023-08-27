import ConfigSocket from "./ConfigSocket";
import type ConfigNamespace from "./ConfigNamespace";

export default class ConfigStore<T> extends ConfigSocket {
    private _hasLoaded: boolean = false;
    private _currentValue: T | null = null;
    private _isDefault: boolean | null = null;

    constructor(
        id: string,
        namespace: ConfigNamespace,
        public readonly defaultValue: T,
    ) {
        super(id, namespace);
    }

    private _getDeserializedStoredValue(): T | undefined {
        const storedValue = super.getValue();
        if (storedValue === undefined) {
            return this.defaultValue;
        }

        return this.deserializer(storedValue);
    }

    deserializer(value: any): T | undefined {
        return value;
    }

    serializer(value: T): any {
        return value;
    }

    getValue(): T {
        if (!this._hasLoaded) {
            const storedValue = this._getDeserializedStoredValue();
        
            if (storedValue === undefined) {
                this._currentValue = this.defaultValue;
                this._isDefault = true;
            }
            else {
                this._currentValue = storedValue;
                this._isDefault = false;
            }
            this._hasLoaded = true;
        }

        return this._currentValue as T;
    }

    setValue(value: T) {
        if (value === undefined) {
            this.clearValue();
            return;
        }

        const prevValue = this.getValue();
        const prevDefault = this.isUsingDefault();

        this._currentValue = value;
        this._isDefault = false;
        super.setValue(this.serializer ? this.serializer(value) : value);

        if (prevValue !== value) {
            this.dispatchEvent(new Event("valueChange"));
        }
        if (prevDefault) {
            this.dispatchEvent(new Event("defaultChange"));
        }
    }

    clearValue() {
        const prevValue = this.getValue();
        const prevDefault = this.isUsingDefault();

        this._currentValue = this.defaultValue;
        this._isDefault = true;
        super.clearValue();

        if (prevValue !== this.defaultValue) {
            this.dispatchEvent(new Event("valueChange"));
        }
        if (!prevDefault) {
            this.dispatchEvent(new Event("defaultChange"));
        }
    }

    isUsingDefault() {
        if (!this._hasLoaded) {
            this.getValue();
        }

        return this._isDefault as boolean;
    }
}