import { getReact } from "../reactLoader";

/**
 * @deprecated The method should not be used
 */
export default function stringToReactNode(text: string): React.ReactNode {
	const React = getReact();

	const splitText = text.split("\n");
	return splitText.map((line, index) => {
		return (
			// eslint-disable-next-line react/jsx-key
			<React.Fragment>
				{line}
				{index === splitText.length - 1 ? null : <br />}
			</React.Fragment>
		);
	});
}
