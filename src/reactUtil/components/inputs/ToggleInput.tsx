import { InputProps } from "../ComponentProps"

export default function ToggleInput(props: InputProps<boolean, HTMLInputElement>) {
    return (
        <input
            id={props.id}
            type="checkbox"
            checked={props.value}
            onChange={props.onChange}
        />
    )
}