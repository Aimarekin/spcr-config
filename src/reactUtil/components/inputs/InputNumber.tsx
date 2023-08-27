import { getReact } from "../../reactLoader"

export type InputNumberProps = {
    id?: string,
    value?: number,
    onChange?: (value: number, e: React.ChangeEvent<HTMLInputElement>) => void,
    placeholder?: string,
    min?: number,
    max?: number,
    step?: number
}

export default function InputNumber(props: InputNumberProps) {
    const React = getReact();

    return (
        <input
            id={props.id}
            className="x-settings-input"
            type="number"
            value={props.value}
            placeholder={props.placeholder}
            min={props.min}
            max={props.max}
            step={props.step}
            onChange={(e) => props.onChange?.(Number(e.target.value), e)}
        />
    )
}