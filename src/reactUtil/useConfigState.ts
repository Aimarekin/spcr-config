import { getReact } from "./reactLoader";

import type ConfigStore from "../configControllers/configStores/ConfigStore";

function buildConfigStateObject<T>(field: ConfigStore<T>) {
	return {
		value: field.getValue(),
		isDefault: field.isUsingDefault()
	};
}

export default function useConfigState<T>(field: ConfigStore<T>) {
	const React = getReact();

	const [configState, setConfigState] = React.useState(() => buildConfigStateObject(field));

	React.useEffect(() => {
		const updateConfigState = () => setConfigState(buildConfigStateObject(field));

		const subscriptions = [
			field.listenTo("valueChange", updateConfigState),
			field.listenTo("defaultChange", updateConfigState)
		];
		return () => {
			for (const removeSubscription of subscriptions) {
				removeSubscription();
			}
		};
	}, [field]);

	return configState;
}
