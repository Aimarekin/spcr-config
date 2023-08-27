import { getReact } from "../reactLoader";

import ConfigRowTitle from "./configRowParts/ConfigRowTitle";
import ConfigRowDescription from "./configRowParts/ConfigRowDescription";
import HelpTooltip from "./configRowParts/HelpTooltip";
import RevertButton from "./configRowParts/RevertButton";

export type ConfigRowStandardFirstColumnProps = {
    id?: string,
    title?: React.ReactNode,
    postTitle?: React.ReactNode,
    description?: React.ReactNode,
    help?: React.ReactNode,
    showRevertButton?: boolean,
    revertButtonCallback?: () => void,
}

export default function ConfigRowStandardFirstColumn(props: ConfigRowStandardFirstColumnProps) {
    const React = getReact();

    return (
        <div>
            {(props.title !== undefined || props.postTitle !== undefined) && <ConfigRowTitle
                id={props.id}
                title={props.title}
                postTitle={props.postTitle}
            />}
            {props.description !== undefined && <ConfigRowDescription
                id={props.id}
            >
                {props.description}    
            </ConfigRowDescription>}
            {props.help !== undefined && <HelpTooltip
                label={props.help}
            />}
            {props.showRevertButton && <RevertButton
                onClick={props.revertButtonCallback}
            />}
        </div>
    )
}