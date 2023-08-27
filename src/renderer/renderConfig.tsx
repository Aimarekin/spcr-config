import { getReact } from "../reactUtil/reactLoader";

import ConfigContainer from "../reactUtil/components/ConfigContainer";
import ConfigSection from "../reactUtil/components/ConfigSection";
import ConfigExtensionHeader from "../reactUtil/components/ConfigExtensionHeader";
import ConfigHeader from "../reactUtil/components/ConfigHeader";
import renderReactTree from "./renderReactTree";

export type RenderConfigProps = {
    extensionName: string,
    extensionLink?: string,
    extensionVersion?: string,

    sections: {
        name: string,
        fields: React.ReactNode[]
    }[]
}

function ReactWrapper(props: RenderConfigProps) {
    const React = getReact();
    
    return (
        <ConfigContainer>
            <ConfigExtensionHeader
                name={props.extensionName}
                link={props.extensionLink}
                version={props.extensionVersion}
            />
            {props.sections.map((section, i) => (
                <ConfigSection key={i}>
                    <ConfigHeader>{section.name}</ConfigHeader>
                    {section.fields}
                </ConfigSection>
            ))}
        </ConfigContainer>
    )
}

export default function renderConfig(props: RenderConfigProps): HTMLDivElement {
    return renderReactTree(getReact().createElement(ReactWrapper, props), props.extensionName);
}