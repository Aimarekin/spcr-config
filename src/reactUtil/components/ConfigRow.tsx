import { getReact } from "../reactLoader"

export type ConfigRowProps = {
    firstColumn?: React.ReactNode
    secondColumn?: React.ReactNode
}

export default function ConfigRow(props: ConfigRowProps) {
    const React = getReact();

    return (
        <div className="x-settings-row">
            <div className="x-settings-firstColumn">
                {props.firstColumn}
            </div>
            <div className="x-settings-secondColumn">
                {props.secondColumn}
            </div>
        </div>
    )
}