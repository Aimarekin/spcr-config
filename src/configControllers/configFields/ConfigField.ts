import { getReact } from "../../reactUtil/reactLoader";
import { useForceUpdate } from "../../reactUtil/hooks";
import stringToReactNode from "../../reactUtil/componentWrappers/stringToReactNode";

import ConfigStore, { ConfigStoreEventMap } from "../configStores/ConfigStore";
import ConfigNamespace from "../ConfigNamespace";
import ListenerTarget from "../../util/ListenerTarget";

const eventsWhichTriggerRenderingChange = ["valueChange", "defaultChange"] as const;

export type ConfigFieldEventMap<UsingThis, T> = ConfigStoreEventMap<UsingThis, T> & {
	renderingChange: (this: UsingThis) => void;
};

export type GenericDisplayProps<T> = {
	id: string;
	value: T;
	onChange: (value: T) => void;
	showRevertButton: boolean;
	revertButtonCallback: () => void;
};

export default class ConfigField<T, DisplayProps, FactoryProps, ReactProps> extends ConfigStore<T> {
	_listenerTarget: ListenerTarget<typeof this, ConfigFieldEventMap<typeof this, T>>;
	listenTo = this._listenerTarget.listenTo;

	readonly ReactComponent;
	readonly ReactFactory = (props: FactoryProps) =>
		getReact().createElement(this.ReactComponent, this.useDisplayProps(props));

	readonly _factoryStringProps: string[] = [];

	constructor(id: string, namespace: ConfigNamespace, defaultValue: T) {
		super(id, namespace, defaultValue);

		for (const k of eventsWhichTriggerRenderingChange) {
			this._listenerTarget.listenTo(k, () => {
				this._listenerTarget.dispatch("renderingChange", this);
			});
		}
	}

	_getGenericDisplayProps(): GenericDisplayProps<T> {
		return {
			id: this.getFullName(),
			value: this.getValue(),
			onChange: (value: T) => {
				const v = this.deserializer(value);
				if (v !== undefined) {
					this.setValue(v);
				}
			},
			showRevertButton: this.isUsingDefault(),
			revertButtonCallback: () => this.clearValue()
		};
	}

	getDisplayProps(): DisplayProps {
		return this._getGenericDisplayProps() as unknown as DisplayProps;
	}

	joinFactoryProps(displayProps: DisplayProps, factoryProps: FactoryProps): ReactProps {
		return {
			...displayProps,
			...factoryProps
		} as unknown as ReactProps;
	}

	getReactProps(props: FactoryProps): ReactProps {
		return this.joinFactoryProps(this.getDisplayProps(), props);
	}

	useDisplayProps(factoryProps: FactoryProps): ReactProps {
		const forceUpdate = useForceUpdate();

		getReact().useEffect(() => {
			return this.listenTo("renderingChange", forceUpdate);
		}, []);

		return this.getReactProps(factoryProps);
	}

	render(factoryProps: FactoryProps): React.ReactNode {
		const convertedFactoryProps = { ...factoryProps };

		for (const k of this._factoryStringProps) {
			convertedFactoryProps[k] = convertedFactoryProps ? stringToReactNode(convertedFactoryProps[k]) : undefined;
		}

		return getReact().createElement(this.ReactFactory, convertedFactoryProps);
	}
}
