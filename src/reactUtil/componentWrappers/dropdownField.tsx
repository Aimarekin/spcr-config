import type ConfigStoreEnum from "../../configControllers/configStores/ConfigStoreEnum";
import type ConfigStoreBoolean from "../../configControllers/configStores/ConfigStoreBoolean";

import ConfigDisplayDropdown, { ConfigDisplayDropdownProps } from "../components/configDisplay/ConfigDisplayDropdown";

export type DropdownFieldProps<T extends string> = Prettify<
	Omit<ConfigDisplayDropdownProps<T>, keyof ConfigFieldDropdownDisplayProps<T>> & {
		optionBodies?: Record<T, string>;
	}
>;

function dropdownField(store: ConfigStoreEnum | ConfigStoreBoolean, props: )