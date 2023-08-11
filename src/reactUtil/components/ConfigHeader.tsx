export default function ConfigHeader(props: React.PropsWithChildren<{ text?: React.ReactNode }>) {
    return (
    <div className="x-settings-section">
        {props.text !== undefined && <h2>{props.text}</h2>}
        {props.children}
    </div>
    )
}