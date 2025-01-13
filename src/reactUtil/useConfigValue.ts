import { getReact } from "./reactLoader";

import type ConfigStore from "../configControllers/configStores/ConfigStore";

export default function useConfigValue(field: ConfigStore<any>) {
	const React = getReact();

	const [configValue, setConfigValue] = React.useState(() => field.getValue());

	React.useEffect(() => field.listenTo("valueChange", (v) => setConfigValue(v)), [field]);

	return configValue;
}
