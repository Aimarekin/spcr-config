import ConfigSocket, { ConfigSocketEventMap } from "../ConfigSocket";
import type ConfigNamespace from "../ConfigNamespace";
import ListenerTarget from "../../util/ListenerTarget";

export type ConfigStoreEventMap<UsingThis, T> = ConfigSocketEventMap<UsingThis> & {
	valueChange: (this: UsingThis, value: T, prevValue: T) => void;
	defaultChange: (this: UsingThis, isDefault: boolean) => void;
};

export default class ConfigStore<T> extends ConfigSocket {
	_listenerTarget: ListenerTarget<ConfigStore<T>, ConfigStoreEventMap<ConfigStore<T>, T>>;
	listenTo = this._listenerTarget.listenTo;

	private _hasLoaded: boolean = false;
	private _currentValue: T | null = null;
	private _isDefault: boolean | null = null;

	constructor(
		id: string,
		namespace: ConfigNamespace,
		public readonly defaultValue: T
	) {
		super(namespace, id);
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

	equalityCheck(a: T, b: T): boolean {
		return Object.is(a, b);
	}

	getValue(): T {
		if (!this._hasLoaded) {
			const storedValue = this._getDeserializedStoredValue();

			if (storedValue === undefined) {
				this._currentValue = this.defaultValue;
				this._isDefault = true;
			} else {
				this._currentValue = storedValue;
				this._isDefault = false;
			}
			this._hasLoaded = true;
		}

		return this._currentValue;
	}

	setValue(value: T) {
		if (value === undefined) {
			this.clearValue();
			return;
		}

		const prevValue = this.getValue();
		if (this.equalityCheck(prevValue, value)) {
			return;
		}

		const prevDefault = this.isUsingDefault();

		this._currentValue = value;
		this._isDefault = false;
		super.setValue(this.serializer(value));

		this._listenerTarget.dispatch("valueChange", this, [value, prevValue]);
		if (prevDefault) {
			this._listenerTarget.dispatch("defaultChange", this, [false]);
		}
	}

	clearValue() {
		const prevDefault = this.isUsingDefault();
		if (prevDefault) {
			return;
		}

		const prevValue = this.getValue();

		this._currentValue = this.defaultValue;
		this._isDefault = true;
		super.clearValue();

		if (prevValue !== this.defaultValue) {
			this._listenerTarget.dispatch("valueChange", this, [this.defaultValue, prevValue]);
		}
		if (!prevDefault) {
			this._listenerTarget.dispatch("defaultChange", this, [true]);
		}
	}

	isUsingDefault() {
		if (!this._hasLoaded) {
			this.getValue();
		}

		return this._isDefault;
	}
}
