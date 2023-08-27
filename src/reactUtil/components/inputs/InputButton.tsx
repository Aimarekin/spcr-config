import { getReact } from "../../reactLoader"

export type InputButtonProps = React.PropsWithChildren<{}>

export default function InputButton(props: InputButtonProps) {
    const React = getReact();
    return (
        <button>
            {props.children}
        </button>
    )
}