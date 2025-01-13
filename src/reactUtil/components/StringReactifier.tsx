import { getReact } from "../reactLoader";

export default function StringReactifier(props: { children: string | string[] }) {
	const React = getReact();

	let { children } = props;

	if (typeof children === "object") {
		children = children.join("");
	}

	const splitText = children.split("\n");
	return splitText.map((line, index) => {
		return (
			// eslint-disable-next-line react/jsx-key
			<>
				{line}
				{index === splitText.length - 1 ? null : <br />}
			</>
		);
	});
}
