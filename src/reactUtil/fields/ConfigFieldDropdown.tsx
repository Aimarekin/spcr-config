import type ConfigStoreEnum from "../../configControllers/configStores/ConfigStoreEnum";
import type ConfigStoreBoolean from "../../configControllers/configStores/ConfigStoreBoolean";

import ConfigDisplayDropdown, { ConfigDisplayDropdownProps } from "../components/configDisplay/ConfigDisplayDropdown";

import useConfigState from "../useConfigState";
import { getReact } from "../reactLoader";
import useSpicetifyLocaleDictionary from "../useSpicetifyLocaleDictionary";
import { generateGenericFieldProps } from "./fieldUtil";
import stringOrUndefined from "../../util/stringOrUndefined";

type ConfigFieldDropdownEnumProps<T extends string> = Prettify<
	{
		config: ConfigStoreEnum<T>;
		optionBodies: Record<T, string>;
		hideRevertButton?: boolean;
	} & Omit<
		ConfigDisplayDropdownProps<T>,
		"options" | "id" | "value" | "showRevertButton" | "revertButtonCallback" | "onChange"
	>
>;

type ConfigFieldDropdownBooleanProps = Prettify<
	{
		config: ConfigStoreBoolean;
		hideRevertButton?: boolean;
	} & Omit<
		ConfigDisplayDropdownProps<"true" | "false">,
		"options" | "id" | "value" | "showRevertButton" | "revertButtonCallback" | "onChange"
	>
>;

function ConfigFieldDropdownEnum<T extends string>(props: ConfigFieldDropdownEnumProps<T>) {
	const React = getReact();

	const { config, optionBodies, hideRevertButton, ...otherProps } = props;

	const { value, isDefault } = useConfigState(config);

	return (
		<ConfigDisplayDropdown
			{...generateGenericFieldProps(config, value, isDefault, hideRevertButton)}
			options={config.options.map((option) => [option, optionBodies[option]])}
			{...otherProps}
		/>
	);
}

function ConfigFieldDropdownBoolean(props: ConfigFieldDropdownBooleanProps) {
	const React = getReact();

	const { config, hideRevertButton, ...otherProps } = props;

	const { value, isDefault } = useConfigState(config);
	const localeDictionary = useSpicetifyLocaleDictionary();

	return (
		<ConfigDisplayDropdown
			{...generateGenericFieldProps(config, value, isDefault, hideRevertButton)}
			options={[
				["true", stringOrUndefined(localeDictionary?.["desktop.settings.autostartNormal"]) || "Yes"],
				["false", stringOrUndefined(localeDictionary?.["desktop.settings.autostartOff"]) || "No"]
			]}
			{...otherProps}
		/>
	);
}

export default function ConfigFieldDropdown<T extends string>(
	props: ConfigFieldDropdownEnumProps<T>
): ReturnType<typeof ConfigFieldDropdownEnum>;
export default function ConfigFieldDropdown(
	props: ConfigFieldDropdownBooleanProps
): ReturnType<typeof ConfigFieldDropdownBoolean>;
export default function ConfigFieldDropdown(
	props: ConfigFieldDropdownEnumProps<string> | ConfigFieldDropdownBooleanProps
) {
	const React = getReact();

	return "options" in props.config ? (
		<ConfigFieldDropdownEnum {...(props as ConfigFieldDropdownEnumProps<string>)} />
	) : (
		<ConfigFieldDropdownBoolean {...(props as ConfigFieldDropdownBooleanProps)} />
	);
}
