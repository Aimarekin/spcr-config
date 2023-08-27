import { getReact } from "../../reactLoader"

export type InputToggleProps = {
    id?: string,
    value?: boolean,
    onChange?: (v: boolean, e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function InputToggle(props: InputToggleProps) {
    const React = getReact();

    return (
        <label className="x-toggle-wrapper">
            <input
                id={props.id}
                className="x-toggle-input"
                type="checkbox"
                checked={props.value}
                onChange={(e) => props.onChange?.(e.target.checked, e)}
            />
            <span className="x-toggle-indicatorWrapper">
                <span className="x-toggle-indicator"/>
            </span>
        </label>
    )
}