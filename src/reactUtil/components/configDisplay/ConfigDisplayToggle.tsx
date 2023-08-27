import { getReact } from "../../reactLoader";

import ConfigRow from "../ConfigRow";
import InputToggle, { InputToggleProps } from "../inputs/InputToggle";
import ConfigRowStandardFirstColumn, { ConfigRowStandardFirstColumnProps } from "../ConfigRowStandardFirstColumn";

export type ConfigDisplayToggleProps = ConfigRowStandardFirstColumnProps & InputToggleProps;

export default function ConfigDisplayToggle(props: ConfigDisplayToggleProps) {
    const React = getReact();
    
    return(
        <ConfigRow
            firstColumn={<ConfigRowStandardFirstColumn
                id={props.id}
                title={props.title}
                postTitle={props.postTitle}
                description={props.description}
                help={props.help}
                showRevertButton={props.showRevertButton}
                revertButtonCallback={props.revertButtonCallback}
            />}
            secondColumn={<InputToggle
                id={props.id}
                value={props.value}
                onChange={props.onChange}
            />}
        />
    )
}