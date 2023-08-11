import { InputTextualProps } from "../ComponentProps"

export default function NumberInput(props: InputTextualProps<number, HTMLInputElement> & {
    min?: number,
    max?: number,
    step?: number
}) {
    return (
        <input
            id={props.id}
            type="number"
            value={props.value}
            placeholder={props.placeholder}
            min={props.min}
            max={props.max}
            step={props.step}
            onChange={props.onChange}
        />
    )
}