interface ConfigField<DisplayProps, FactoryProps, ReactProps> {
	listenTo(type: "renderingChange", callback: () => void): () => void;

	useDisplayProps(): DisplayProps;
	useReactProps(factoryProps: FactoryProps): ReactProps;

	getDisplayProps(): DisplayProps;
	joinFactoryProps(displayProps: DisplayProps, factoryProps: FactoryProps): ReactProps;
	getReactProps(factoryProps: FactoryProps): ReactProps;
}
