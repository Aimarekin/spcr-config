

export default function ExtensionHeader(props: { extensionName: string, extensionVersion?: string, extensionLink?: string }) {
    return (
    <div className="x-settings-headerContainer">
        <h1>{props.extensionLink ? <a href={props.extensionLink}>{props.extensionName}</a> : props.extensionName }</h1>
        {props.extensionVersion && <span>Version {props.extensionVersion}</span>}
    </div>
    )
}