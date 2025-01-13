import { getReact } from "../reactLoader";

export type ConfigSectionProps = React.PropsWithChildren<{
	id?: string;
}>;

export default function ConfigSection(props: ConfigSectionProps) {
	const React = getReact();

	const { id } = props;

	return (
		<div className="x-settings-section" data-section-id={id}>
			{props.children}
		</div>
	);
}
