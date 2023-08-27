import { getReact, getSpicetifyReactComponent } from "../../reactLoader";

import RevertIcon from "../../icons/RevertIcon";

export type RevertButtonProps = {
    onClick?: () => void
}

export default function RevertButton(props: RevertButtonProps) {
    const React = getReact(), ReactComponent = getSpicetifyReactComponent();

    return (
        <ReactComponent.TooltipWrapper
            label = {Spicetify.Locale.getDictionary()?.["equalizer.reset"] || "Reset"}
            renderInline = {true}
            showDelay = {0}
            placement = "top"
        >
            <button
                className="spcr-configuration-revertButton"
                onClick={props.onClick}
            >
                <RevertIcon/>
            </button>
        </ReactComponent.TooltipWrapper>
    )
}