import ConfigStore from "./ConfigStore";
import type ConfigNamespace from "../ConfigNamespace";

export type ConfigStoreBooleanProps = {
	defaultValue: boolean;
};

export default class ConfigStoreBoolean extends ConfigStore<boolean> {
	constructor(id: string, namespace: ConfigNamespace, props: ConfigStoreBooleanProps) {
		super(id, namespace, props.defaultValue);
	}

	deserializer(value: any): boolean {
		return Boolean(value);
	}

	serializer(value: boolean): boolean {
		return Boolean(value);
	}

	toggle(): boolean {
		const newValue = !this.getValue();
		this.setValue(newValue);
		return newValue;
	}
}
