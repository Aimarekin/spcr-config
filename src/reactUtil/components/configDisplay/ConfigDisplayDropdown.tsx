import { getReact } from "../../reactLoader";

import ConfigRow from "../ConfigRow";
import InputDropdown, { InputDropdownProps } from "../inputs/InputDropdown";
import ConfigRowStandardFirstColumn, { ConfigRowStandardFirstColumnProps } from "../ConfigRowStandardFirstColumn";

export type ConfigDisplayDropdownProps<T extends string> = ConfigRowStandardFirstColumnProps & InputDropdownProps<T>;

export default function ConfigDisplayDropdown<T extends string>(props: ConfigDisplayDropdownProps<T>) {
    const React = getReact();

    return (
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
            secondColumn={<InputDropdown
                id={props.id}
                value={props.value}
                options={props.options}
                onChange={props.onChange}
            />}
        />
    )
}