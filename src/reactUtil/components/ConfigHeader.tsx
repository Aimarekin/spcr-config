export default function ConfigHeader(props: { text?: string, children: React.ReactNode }) {
    return (
    <div className="x-settings-section">
        {props.text !== undefined && <h2>{props.text}</h2>}
        {props.children}
    </div>
    )
}