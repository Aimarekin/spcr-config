import { getReact } from "../reactLoader"

export default function stringToReactNode(text: string): React.ReactNode {
    const React = getReact();

    const splitText = text.split('\n');
    return splitText.map((line, index) => {
        return (
            <React.Fragment key={index}>
                <span key={index}>{line}</span>{index === splitText.length - 1 ? null : <br/>}
            </React.Fragment>
        )
    });
}