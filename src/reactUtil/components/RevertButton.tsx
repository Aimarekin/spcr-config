import RevertIcon from "../icons/RevertIcon";

export default function RevertButton(props: {onClick: () => void}) {
    return (
        <Spicetify.ReactComponent.TooltipWrapper
            label = {Spicetify.Locale.getDictionary()?.["equalizer.reset"] || "Reset"}
            renderInline = {true}
            showDelay = {10}
            placement = "top"
        >
            <button
                className="spcr-configuration-revertButton"
                onClick={props.onClick}
            >
                <RevertIcon/>
            </button>
        </Spicetify.ReactComponent.TooltipWrapper>
    )
}