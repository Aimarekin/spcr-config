import { getReact } from "../../reactUtil/reactLoader";

import ConfigField from "./ConfigField";
import type ConfigNamespace from "../ConfigNamespace";

import ConfigDisplayText, { ConfigDisplayTextProps } from "../../reactUtil/components/configDisplay/ConfigDisplayText";
import useConfigState from "../../reactUtil/useConfigState";

export type ConfigFieldTextProps = {
	defaultValue: string;
};

export type ConfigFieldTextDisplayProps = Required<
	Pick<ConfigDisplayTextProps, "id" | "value" | "onChange" | "showRevertButton" | "revertButtonCallback">
>;

export type ConfigFieldTextFactoryProps = Omit<ConfigDisplayTextProps, keyof ConfigFieldTextDisplayProps>;

export default class ConfigFieldText extends ConfigField<string> {
	readonly ReactComponent = ConfigDisplayText;
	readonly ReactFactory: (factoryProps: ConfigFieldTextFactoryProps) => JSX.Element;

	constructor(id: string, namespace: ConfigNamespace, props: ConfigFieldTextProps) {
		const { defaultValue } = props;

		super(id, namespace, defaultValue);

		this.ReactFactory = (factoryProps: ConfigFieldTextFactoryProps) => {
			useConfigState(this);

			return getReact().createElement(this.ReactComponent, { ...this.getCurrentDisplayProps(), ...factoryProps });
		};
	}

	deserializer(value: any): string {
		return String(value);
	}

	serializer(value: string): string {
		return String(value);
	}

	getCurrentDisplayProps(): ConfigFieldTextDisplayProps {
		return {
			id: this.getFullName(),
			value: this.getValue(),
			onChange: (value: string) => {
				const v = this.deserializer(value);
				if (v !== undefined) {
					this.setValue(v);
				}
			},
			showRevertButton: this.isUsingDefault(),
			revertButtonCallback: () => this.clearValue()
		};
	}
}
