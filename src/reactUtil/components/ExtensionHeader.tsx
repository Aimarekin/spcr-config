export default function ExtensionHeader(props: { name: React.ReactNode, version?: React.ReactNode, link?: string }) {
    return (
    <div className="x-settings-headerContainer">
        <h1>{props.link ? <a href={props.link}>{props.name}</a> : props.name }</h1>
        {props.version && <span>Version {props.version}</span>}
    </div>
    )
}