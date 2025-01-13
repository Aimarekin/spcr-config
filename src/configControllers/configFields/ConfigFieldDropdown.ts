import { getReact } from "../../reactUtil/reactLoader";

import ConfigField, { GenericDisplayProps } from "./ConfigField";
import type ConfigNamespace from "../ConfigNamespace";

import ConfigDisplayDropdown, {
	ConfigDisplayDropdownProps
} from "../../reactUtil/components/configDisplay/ConfigDisplayDropdown";
import useConfigState from "../../reactUtil/useConfigState";

import stringToReactNode from "../../reactUtil/componentWrappers/stringToReactNode";

export type ConfigFieldDropdownProps<T extends string> = {
	defaultValue: T;
	options: T[];
};

export type ConfigFieldDropdownDisplayProps<T extends string> = GenericDisplayProps<T> & {
	options: T[];
};

export type ConfigFieldDropdownFactoryProps<T extends string> = Prettify<
	Omit<ConfigDisplayDropdownProps<T>, keyof ConfigFieldDropdownDisplayProps<T>> & {
		optionBodies?: Record<T, string>;
	}
>;

export default class ConfigFieldDropdown<T extends string> extends ConfigField<
	T,
	ConfigFieldDropdownDisplayProps<T>,
	ConfigFieldDropdownFactoryProps<T>,
	ConfigDisplayDropdownProps<T>
> {
	readonly options: T[];
	readonly ReactComponent = ConfigDisplayDropdown<T>;

	constructor(id: string, namespace: ConfigNamespace, { defaultValue, options }: ConfigFieldDropdownProps<T>) {
		super(id, namespace, defaultValue);

		this.options = options;
	}

	getDisplayProps(): ConfigFieldDropdownDisplayProps<T> {
		return {
			...super._getGenericDisplayProps(),
			options: this.options
		};
	}

	joinFactoryProps(
		displayProps: ConfigFieldDropdownDisplayProps<T>,
		factoryProps: ConfigFieldDropdownFactoryProps<T>
	): ConfigDisplayDropdownProps<T> {
		return {
			...displayProps,
			...factoryProps,
			options: displayProps.options.map(
				(option) => [option, factoryProps.optionBodies?.[option] ?? option] as [T, string]
			)
		};
	}
}
