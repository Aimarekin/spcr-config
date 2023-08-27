import { getReact } from "../../reactLoader";

import ConfigRow from "../ConfigRow";
import InputNumber, { InputNumberProps } from "../inputs/InputNumber";
import ConfigRowStandardFirstColumn, { ConfigRowStandardFirstColumnProps } from "../ConfigRowStandardFirstColumn";

export type ConfigDisplayNumberProps = ConfigRowStandardFirstColumnProps & InputNumberProps;

export default function ConfigDisplayNumber(props: ConfigDisplayNumberProps) {
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
            secondColumn={<InputNumber
                id={props.id}
                value={props.value}
                placeholder={props.placeholder}
                min={props.min}
                max={props.max}
                step={props.step}
                onChange={props.onChange}
            />}
        />
    )
}