import { InputTextualProps } from "../ComponentProps"

export default function TextInput(props: InputTextualProps<string, HTMLInputElement | HTMLTextAreaElement> & {
    multiline?: boolean,
}) {
    return (
        props.multiline
        ? (
            <input
                id={props.id}
                type="text"
                value={props.value}
                placeholder={props.placeholder}
                onChange={props.onChange}
            />
        )
        : (
            <textarea
                id={props.id}
                value={props.value}
                placeholder={props.placeholder}
                onChange={props.onChange}
            />
        )
    )
}