import { InputProps } from "../ComponentProps"

export default function DropdownInput<T extends string>(props: InputProps<T, HTMLSelectElement> & {
    options: [T, string][],
}) {
    return (
        <select
            id={props.id}
            value={props.value}
            onChange={props.onChange}
        >
            {props.options.map(([optionKey, optionRepr]) => <option key={optionKey} value={optionKey}>{optionRepr}</option>)}
        </select>
    )
}