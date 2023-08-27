import { getReact } from "../reactLoader"

export type ConfigSectionProps = React.PropsWithChildren<{}>

export default function ConfigSection(props: ConfigSectionProps) {
    const React = getReact();

    return (
        <div className="x-settings-section">
            {props.children}
        </div>
    )
}