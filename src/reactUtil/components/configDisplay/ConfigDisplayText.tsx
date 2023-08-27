import { getReact } from "../../reactLoader";

import ConfigRow from "../ConfigRow";
import InputText, { InputTextProps } from "../inputs/InputText";
import ConfigRowStandardFirstColumn, { ConfigRowStandardFirstColumnProps } from "../ConfigRowStandardFirstColumn";

export type ConfigDisplayTextProps = ConfigRowStandardFirstColumnProps & InputTextProps;

export default function ConfigDisplayText(props: ConfigDisplayTextProps) {
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
            secondColumn={<InputText
                id={props.id}
                value={props.value}
                placeholder={props.placeholder}
                multiline={props.multiline}
                onChange={props.onChange}
            />}
        />
    )
}