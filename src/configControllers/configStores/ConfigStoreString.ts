import ConfigStore from "./ConfigStore";
import type ConfigNamespace from "../ConfigNamespace";

export type ConfigStoreStringProps = {
	defaultValue: string;
	maxLength?: number;
};

export default class ConfigStoreString extends ConfigStore<string> {
	readonly maxLength: number;

	constructor(id: string, namespace: ConfigNamespace, props: ConfigStoreStringProps) {
		super(id, namespace, props.defaultValue);

		this.maxLength = props.maxLength ?? Infinity;

		if (this.maxLength < 0) {
			throw new RangeError("maxLength must be greater than or equal to 0.");
		}
	}

	deserializer(value: any): string | undefined {
		let str = String(value);

		if (str.length > this.maxLength) {
			str = str.slice(0, this.maxLength);
		}

		return str ? str : undefined;
	}

	serializer(value: string): string | undefined {
		let str = String(value);

		if (str.length > this.maxLength) {
			str = str.slice(0, this.maxLength);
		}

		return str ? str : undefined;
	}
}
