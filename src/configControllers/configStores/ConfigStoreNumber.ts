import ConfigStore from "./ConfigStore";
import type ConfigNamespace from "../ConfigNamespace";

export type ConfigStoreNumberProps = {
	defaultValue: number;
	min?: number;
	max?: number;
	step?: number;
};

export default class ConfigStoreNumber extends ConfigStore<number> {
	readonly min: number;
	readonly max: number;
	readonly step: number;

	constructor(id: string, namespace: ConfigNamespace, props: ConfigStoreNumberProps) {
		super(id, namespace, props.defaultValue);

		this.min = props.min ?? -Infinity;
		this.max = props.max ?? Infinity;
		this.step = props.step ?? 1;

		if (this.min > this.max) {
			throw new RangeError("min must be less than or equal to max.");
		}

		if (this.step <= 0) {
			throw new RangeError("step must be greater than 0.");
		}
	}

	deserializer(value: any): number | undefined {
		let num = Number(value);

		if (isNaN(num)) {
			return undefined;
		}
		if (this.step !== undefined && num % this.step !== 0) {
			num = Math.round(num / this.step) * this.step;
		}
		if (this.min !== undefined && num < this.min) {
			return this.min;
		}
		if (this.max !== undefined && num > this.max) {
			return this.max;
		}

		return num;
	}

	serializer(value: number): number | undefined {
		const num = Number(value);

		return isNaN(num) ? undefined : num;
	}
}
