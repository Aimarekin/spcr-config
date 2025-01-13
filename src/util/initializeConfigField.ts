import stringToReactNode from "../reactUtil/componentWrappers/stringToReactNode";
import { getReact } from "../reactUtil/reactLoader";

import type ConfigStore from "../configControllers/configStores/ConfigStore";

export function getGenericDisplayProps<T>(field: ConfigStore<T>) {
	return {
		id: field.getFullName(),
		value: field.getValue(),
		onChange: (value: any) => {
			const v = field.deserializer(value);
			if (v !== undefined) {
				field.setValue(v);
			}
		},
		showRevertButton: field.isUsingDefault(),
		revertButtonCallback: field.clearValue
	};
}

export function genericJoinProps<DisplayProps, FactoryProps>(displayProps: DisplayProps, factoryProps: FactoryProps) {
	return { ...displayProps, ...factoryProps };
}

//export function generate

export function generateUseDisplayProps<DisplayProps>(
	listenTo: (event: "renderingChange", callback: () => void) => () => void,
	getDisplayProps: () => DisplayProps
) {
	return function useDisplayProps() {
		const React = getReact();

		const [displayProps, setDisplayProps] = React.useState(getDisplayProps);

		React.useEffect(() => {
			return listenTo("renderingChange", () => setDisplayProps(getDisplayProps()));
		}, []);

		return displayProps;
	};
}

//export function generateUseFieldProps<FactoryProps>(useDisplayProps: ())

export function generateReactFactoryFunction<FactoryProps>(
	ReactComponent: React.ComponentType<FactoryProps>,
	useFieldProps
) {
	return function reactFactoryFunction(props: FactoryProps) {
		const React = getReact();

		React.createElement(ReactComponent, props);
	};
}

export function generateRenderFunction<FactoryProps>(
	reactFactory: React.ComponentType<FactoryProps>,
	stringToNodeProps: string[]
) {
	return function renderConfigField(props: FactoryProps) {
		const React = getReact();

		const convertedFactoryProps = { ...props };

		for (const k of stringToNodeProps) {
			convertedFactoryProps[k] = convertedFactoryProps ? stringToReactNode(convertedFactoryProps[k]) : undefined;
		}

		return React.createElement(reactFactory, convertedFactoryProps);
	};
}
