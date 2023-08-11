import HelpIcon from "../icons/HelpIcon"

export default function HelpTooltip(props: {text: React.ReactNode}) {
    return (
        <div className="x-settings-tooltip">
            <Spicetify.ReactComponent.TooltipWrapper
                label = {props.text}/*{
                    <>
                        {props.text.split("\n").map((line) => <>{line}<br/></>)}    
                    </>
                }*/
                renderInline = {true}
                showDelay = {10}
                placement = "top"
                labelClassName = "x-settings-tooltipIconWrapper"
            >
                <HelpIcon/>
            </Spicetify.ReactComponent.TooltipWrapper>
        </div>
    )
}