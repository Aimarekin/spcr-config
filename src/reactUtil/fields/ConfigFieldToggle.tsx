import type ConfigStoreBoolean from "../../configControllers/configStores/ConfigStoreBoolean";

import ConfigDisplayToggle, { ConfigDisplayToggleProps } from "../components/configDisplay/ConfigDisplayToggle";

import useConfigState from "../useConfigState";
import { getReact } from "../reactLoader";
import { generateGenericFieldProps } from "./fieldUtil";

type ConfigFieldToggleProps = Prettify<
	{
		config: ConfigStoreBoolean;
		hideRevertButton?: boolean;
	} & Omit<ConfigDisplayToggleProps, "id" | "value" | "showRevertButton" | "revertButtonCallback" | "onChange">
>;
export default function ConfigFieldDropdown(props: ConfigFieldToggleProps) {
	const React = getReact();

	const { config, hideRevertButton, ...otherProps } = props;

	const { value, isDefault } = useConfigState(config);

	return (
		<ConfigDisplayToggle
			{...generateGenericFieldProps(config, value, isDefault, hideRevertButton)}
			{...otherProps}
		/>
	);
}
