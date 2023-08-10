import HelpTooltip from "./HelpTooltip";
import RevertButton from "./RevertButton";

export default function ConfigRow(props: { labelFor?: string, description?: string, help?: string, revertButtonCallback?: () => void, children: React.ReactNode }) {
    return (
    <div className="x-settings-row">
        <div className="x-settings-firstColumn">
            {props.description !== undefined && <label htmlFor={props.labelFor}>{props.description}</label>}
            {props.help !== undefined && <HelpTooltip text={props.help}/>}
            {props.revertButtonCallback && <RevertButton onClick={props.revertButtonCallback}/>}
        </div>
        <div className="x-settings-secondColumn">
            {props.children}
        </div>
    </div>
    )
}