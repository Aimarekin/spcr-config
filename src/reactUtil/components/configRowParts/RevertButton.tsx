import { getReact, getSpicetifyReactComponent } from "../../reactLoader";

import RevertIcon from "../../icons/RevertIcon";
import useSpicetifyLocaleDictionary from "../../useSpicetifyLocaleDictionary";
import stringOrUndefined from "../../../util/stringOrUndefined";

export type RevertButtonProps = {
	onClick?: React.DOMAttributes<HTMLButtonElement>["onClick"];
};

export default function RevertButton(props: RevertButtonProps) {
	const React = getReact(),
		ReactComponent = getSpicetifyReactComponent();

	const localeDictionary = useSpicetifyLocaleDictionary();

	return (
		<ReactComponent.TooltipWrapper
			label={stringOrUndefined(localeDictionary?.["equalizer.reset"]) || "Reset"}
			renderInline={true}
			showDelay={0}
			placement="top"
		>
			<button className="spcr-configuration-revertButton" onClick={props.onClick}>
				<RevertIcon />
			</button>
		</ReactComponent.TooltipWrapper>
	);
}
