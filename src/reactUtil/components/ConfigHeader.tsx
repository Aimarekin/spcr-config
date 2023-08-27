import { getReact, getSpicetifyReactComponent } from "../reactLoader"

export type ConfigHeaderProps = React.PropsWithChildren<{}>

export default function ConfigHeader(props: ConfigHeaderProps) {
    const React = getReact(), ReactComponent = getSpicetifyReactComponent();

    return (
        <ReactComponent.TextComponent
            as="h2"
            semanticColor="textBase"
            variant="cello"
        >
            {props.children}
        </ReactComponent.TextComponent>
    )
}