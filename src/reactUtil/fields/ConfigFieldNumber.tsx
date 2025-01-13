import type ConfigStoreNumber from "../../configControllers/configStores/ConfigStoreNumber";

import ConfigDisplayNumber, { ConfigDisplayNumberProps } from "../components/configDisplay/ConfigDisplayNumber";

import useConfigState from "../useConfigState";
import { getReact } from "../reactLoader";
import { generateGenericFieldProps } from "./fieldUtil";

type ConfigFieldNumberProps = Prettify<
	{
		config: ConfigStoreBoolean;
		hideRevertButton?: boolean;
	} & Omit<ConfigDisplayToggleProps, "id" | "value" | "showRevertButton" | "revertButtonCallback" | "onChange">
>;
export default function ConfigFieldDropdown(props: ConfigFieldNumberProps) {
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
