import { getReact, getSpicetifyReactComponent } from "../reactLoader";

import ClipboardIcon from "../icons/ClipboardIcon"

export type ConfigExtensionHeaderProps = {
    name: React.ReactNode,
    link?: string,
    version?: React.ReactNode,
}

export default function ConfigExtensionHeader(props: ConfigExtensionHeaderProps) {
    const React = getReact(), ReactComponent = getSpicetifyReactComponent();

    return (
        <div className="x-settings-headerContainer" style={{ gap: "8px" }}>
            <ReactComponent.TextComponent
                as="h1"
                paddingBottom="16px"
                semanticColor="textBase"
                variant="canon"
            >
                {props.link ? <a href={props.link}>{props.name}</a> : props.name}
            </ReactComponent.TextComponent>
            {props.version && <div
                className="spcr-config-version-indicator"
                style={{
                    paddingBottom: "20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "end",
                    whiteSpace: "nowrap"
                }}
            >
                <ReactComponent.TextComponent
                    as="span"
                    semanticColor="textSubdued"
                    variant="viola"
                >
                    <ClipboardIcon/>
                    &nbsp;
                    {props.version}
                </ReactComponent.TextComponent>
            </div>}
        </div>
    )
}