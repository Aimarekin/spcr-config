import ExtensionHeader from "./ExtensionHeader"

export default function ConfigExtensionSection(props: { extensionName: string, extensionVersion?: string, extensionLink?: string, children: React.ReactNode }) {
    return (<>
    <div className="x-settings-section">
        <ExtensionHeader extensionName={props.extensionName} extensionVersion={props.extensionVersion} extensionLink={props.extensionLink}/>
    </div>
    {props.children}
    </>)
}