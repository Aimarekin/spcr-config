import { getReact } from "../../reactLoader"

export type InputTextProps = {
    id?: string,
    value?: string,
    onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    placeholder?: string,
    multiline?: boolean
}

export default function InputText(props: InputTextProps) {
    const React = getReact();

    if (props.multiline) {
        return (
            <textarea
                id={props.id}
                value={props.value}
                placeholder={props.placeholder}
                onChange={(e) => props.onChange?.(e.target.value, e)}
            />
        )
    }
    else {
        return (
            <input
                id={props.id}
                type="text"
                value={props.value}
                placeholder={props.placeholder}
                onChange={(e) => props.onChange?.(e.target.value, e)}
            />
        )
    }
}