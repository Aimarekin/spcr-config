import type ConfigStore from "../../configControllers/configStores/ConfigStore";

export function generateGenericFieldProps<T>(
	config: ConfigStore<T>,
	value: T,
	isDefault: boolean,
	hideRevertButton?: boolean
) {
	return {
		id: config.id,
		showRevertButton: !hideRevertButton && isDefault,
		revertButtonCallback: () => config.clearValue(),
		value: value,
		onChange: (value: any) => {
			const v = config.deserializer(value);
			if (v !== undefined) {
				config.setValue(v);
			}
		}
	};
}
