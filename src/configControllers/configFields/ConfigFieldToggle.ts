import { getReact } from "../../reactUtil/reactLoader";

import ConfigField from "./ConfigField";
import type ConfigNamespace from "../ConfigNamespace";

import ConfigDisplayToggle, {
	ConfigDisplayToggleProps
} from "../../reactUtil/components/configDisplay/ConfigDisplayToggle";
import useConfigState from "../../reactUtil/useConfigState";

export type ConfigFieldToggleDisplayProps = Required<
	Pick<ConfigDisplayToggleProps, "id" | "value" | "onChange" | "showRevertButton" | "revertButtonCallback">
>;

export type ConfigFieldToggleFactoryProps = Omit<ConfigDisplayToggleProps, keyof ConfigFieldToggleDisplayProps>;

export type ConfigFieldToggleProps = {
	defaultValue: boolean;
};

export default class ConfigFieldToggle extends ConfigField<boolean> {
	readonly ReactComponent = ConfigDisplayToggle;
	readonly ReactFactory: (factoryProps: ConfigFieldToggleFactoryProps) => JSX.Element;

	constructor(id: string, namespace: ConfigNamespace, props: ConfigFieldToggleProps) {
		const { defaultValue } = props;

		super(id, namespace, defaultValue);

		this.ReactFactory = (props: ConfigFieldToggleFactoryProps) => {
			useConfigState(this);

			return getReact().createElement(this.ReactComponent, { ...this.getCurrentDisplayProps(), ...props });
		};
	}

	deserializer(value: any): boolean {
		return Boolean(value);
	}

	serializer(value: boolean): boolean {
		return Boolean(value);
	}

	toggle(): boolean {
		const setTo = !this.getValue();
		this.setValue(setTo);
		return setTo;
	}
}
