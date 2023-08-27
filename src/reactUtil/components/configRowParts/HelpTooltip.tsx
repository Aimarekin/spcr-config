import { getReact, getSpicetifyReactComponent } from "../../reactLoader"

import HelpIcon from "../../icons/HelpIcon"

export type HelpTooltipProps = {
    label?: React.ReactNode,
    placement?:
        | "top"    | "top-start"    | "top-end"
        | "bottom" | "bottom-start" | "bottom-end"
        | "left"   | "left-start"   | "left-end"
        | "right"  | "right-start"  | "right-end"
        | "auto"   | "auto-start"   | "auto-end",
    labelClassName?: string,
}

export default function HelpTooltip(props: HelpTooltipProps) {
    const React = getReact(), ReactComponent = getSpicetifyReactComponent();

    return (
        <div className="x-settings-tooltip">
            <ReactComponent.TooltipWrapper
                label = {props.label}
                renderInline = {true}
                showDelay = {0}
                placement = {props.placement || "top"}
                labelClassName = {props.labelClassName}
            >
                <div
                    className="x-settings-tooltipIconWrapper"
                >
                    <HelpIcon/>
                </div>
            </ReactComponent.TooltipWrapper>
        </div>
    )
}