import HelpTooltip from "./HelpTooltip";
import RevertButton from "./RevertButton";

import { ConfigRowProps } from "./ComponentProps";

export default function ConfigRow(props: React.PropsWithChildren<ConfigRowProps>) {
    return (
    <div className="x-settings-row">
        <div className="x-settings-firstColumn">
            {props.description !== undefined && <label htmlFor={props.id}>{props.description}</label>}
            {props.help !== undefined && <HelpTooltip text={props.help}/>}
            {props.showRevertButton && <RevertButton onClick={props.revertButtonCallback}/>}
        </div>
        <div className="x-settings-secondColumn">
            {props.children}
        </div>
    </div>
    )
}