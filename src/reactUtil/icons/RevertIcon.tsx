import { getReact } from "../reactLoader"

export default function RevertIcon() {
    const React = getReact();

    return (<svg
        role="img"
        height="16" width="16"
        aria-describedby="hover-or-focus-tooltip"
        aria-hidden="true"
        tabIndex={0}
        className="Svg-sc-ytk21e-0 Svg-img-16-icon spcr-configuration-revert"
        viewBox="0 0 16 16"
        data-encore-id="icon"
        dangerouslySetInnerHTML={{
            __html: `<path d="M 2.849,-0.922 L 2.8499999999999996,-0.922 L 0.019999999999999574,-3.75 L 2.8489999999999984,-6.577999999999999 A 0.75,0.75 0.0 0,1 3.908999999999999,-5.518 L 2.8919999999999995,-4.5 L 4.838999999999999,-4.5 A 2.25,2.25 0.0 0,0 6.562999999999999,-5.304 L 12.736,-12.66 A 3.75,3.75 0.0 0,1 15.609,-14.0 L 16.0,-14.0 L 16.0,-12.5 L 15.61,-12.5 A 2.25,2.25 0.0 0,0 13.886000000000001,-11.696 L 7.713000000000001,-4.34 A 3.75,3.75 0.0 0,1 4.84,-3.0 L 2.891,-3.0 L 3.9090000000000007,-1.9820000000000002 A 0.75,0.75 0.0 1,1 2.849,-0.922Z"></path>`
        }}
    />)
}