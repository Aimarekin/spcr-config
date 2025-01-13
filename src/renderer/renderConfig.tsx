import { getReact } from "../reactUtil/reactLoader";

import ConfigContainer from "../reactUtil/components/ConfigContainer";
import ConfigSection from "../reactUtil/components/ConfigSection";
import ConfigExtensionHeader from "../reactUtil/components/ConfigExtensionHeader";
import ConfigHeader from "../reactUtil/components/ConfigHeader";
import renderConfigReactTree from "./renderReactTree";

export type RenderConfigProps = {
	extensionName: string;
	extensionLink?: string;
	extensionVersion?: string;

	sections: {
		id?: string;
		name?: string;
		fields: React.ReactNode[];
	}[];
};

function ReactWrapper(props: RenderConfigProps) {
	const React = getReact();

	return (
		<ConfigContainer>
			<ConfigExtensionHeader
				name={props.extensionName}
				link={props.extensionLink}
				version={props.extensionVersion}
			/>
			{props.sections.map((section) => (
				<ConfigSection key={section.id ?? section.name}>
					{section.name && <ConfigHeader>{section.name}</ConfigHeader>}
					{section.fields}
				</ConfigSection>
			))}
		</ConfigContainer>
	);
}

export default function renderConfig(props: RenderConfigProps): HTMLDivElement {
	return renderConfigReactTree(getReact().createElement(ReactWrapper, props));
}
