import { getReact, getSpicetifyReactComponent } from "../../reactLoader"

export type ConfigRowTitleProps = {
    id?: string;
    title?: React.ReactNode;
    postTitle?: React.ReactNode;
}

export default function ConfigRowTitle(props: ConfigRowTitleProps) {
    const React = getReact(), ReactComponent = getSpicetifyReactComponent();

    return (
        <div>
            {props.title !== undefined && <ReactComponent.TextComponent
                as="label"
                id={props.id}
                semanticColor="textBase"
                variant="viola"
            >
                {props.title}
            </ReactComponent.TextComponent>}
            {props.postTitle !== undefined && <ReactComponent.TextComponent
                as="label"
                id={props.id}
                semanticColor="textSubdued"
                variant="viola"
            >
                {props.postTitle}
            </ReactComponent.TextComponent>}
        </div>
    )
}