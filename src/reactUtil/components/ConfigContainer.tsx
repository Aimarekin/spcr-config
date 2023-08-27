import { getReact } from "../reactLoader"

export type ConfigContainerProps = React.PropsWithChildren<{}>

export default function ConfigContainer(props: ConfigContainerProps) {
    const React = getReact();
    
    return (
        <div className="spcr-config-container">
            {props.children}
        </div>
    )
}