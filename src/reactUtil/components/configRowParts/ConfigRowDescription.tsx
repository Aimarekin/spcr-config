import { getReact, getSpicetifyReactComponent } from "../../reactLoader"

export type ConfigRowDescriptionProps = React.PropsWithChildren<{
    id?: string
}>

export default function ConfigRowDescription(props: ConfigRowDescriptionProps) {
    const React = getReact(), ReactComponent = getSpicetifyReactComponent();

    return (
        <ReactComponent.TextComponent
            as="label"
            id={props.id}
            semanticColor="textSubdued"
            variant="viola"
        >
            {props.children}
        </ReactComponent.TextComponent>
    )
}