import ConfigSocket from "./ConfigSocket";
import type ConfigNamespace from "./ConfigNamespace";

export default class ConfigStore<T> extends ConfigSocket {
    _currentValue: T;
    _isDefault: boolean;

    constructor(
        id: string,
        namespace: ConfigNamespace,
        public readonly defaultValue: T,
    ) {
        super(id, namespace);

        const storedValue = this._getDeserializedStoredValue();
        
        if (storedValue === undefined) {
            this._currentValue = defaultValue;
            this._isDefault = true;
        }
        else {
            this._currentValue = storedValue;
            this._isDefault = false;
        }
    }

    private _getDeserializedStoredValue(): T | undefined {
        const storedValue = super.getValue();
        if (storedValue === undefined) {
            return this.defaultValue;
        }

        const deserialized = this.deserializer(storedValue);
        if (deserialized === undefined) {
            return this.defaultValue;
        }
        return deserialized;

        return storedValue;
    }

    deserializer(value: any): T | undefined {
        return value;
    }

    serializer(value: T): any {
        return value;
    }

    getValue(): T {
        return this._currentValue;
    }

    setValue(value: T) {
        if (value === undefined) {
            this.clearValue();
            return;
        }

        const prevValue = this._currentValue;
        const prevDefault = this._isDefault;

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
        const prevValue = this._currentValue;
        const prevDefault = this._isDefault;

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
        return this._isDefault;
    }
}