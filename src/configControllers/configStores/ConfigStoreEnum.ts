import ConfigStore from "./ConfigStore";
import type ConfigNamespace from "../ConfigNamespace";

export type ConfigStoreEnumProps<T extends string> = {
	defaultValue: T;
	options: T[];
};

export default class ConfigStoreEnum<T extends string> extends ConfigStore<T> {
	private readonly _optionsSet: Set<T>;
	readonly options: T[];

	constructor(id: string, namespace: ConfigNamespace, props: ConfigStoreEnumProps<T>) {
		super(id, namespace, props.defaultValue);

		this._optionsSet = new Set(props.options);
		this.options = [...this._optionsSet];
	}

	deserializer(value: any): T | undefined {
		const str = String(value);
		return this._optionsSet.has(str as T) ? (str as T) : undefined;
	}

	serializer(value: T): string {
		return String(value);
	}
}
