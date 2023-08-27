import { getReact } from "../../reactLoader"

export type InputDropdownProps<T extends string> = {
    id?: string,
    value?: T,
    onChange?: (value: T, e: React.ChangeEvent<HTMLSelectElement>) => void,
    options: [T, string][],
}

export default function InputDropdown<T extends string>(props: InputDropdownProps<T>) {
    const React = getReact();

    return (
        <select
            id={props.id}
            className="main-dropDown-dropDown"
            value={props.value}
            onChange={(e) => props.onChange?.(e.target.value as T, e)}
        >
            {props.options.map(([optionKey, optionBody]) => <option key={optionKey} value={optionKey}>{optionBody}</option>)}
        </select>
    )
}