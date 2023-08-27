import { getReact } from "../reactLoader"

export default function HelpIcon() {
    const React = getReact();

    return (<svg
        role="img"
        height="16" width="16"
        aria-describedby="hover-or-focus-tooltip"
        aria-hidden="true"
        tabIndex={0}
        className="Svg-sc-ytk21e-0 Svg-img-16-icon x-settings-tooltipIcon"
        viewBox="0 0 16 16"
        data-encore-id="icon"
        dangerouslySetInnerHTML={{
            __html: `<path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"></path><path d="M7.25 12.026v-1.5h1.5v1.5h-1.5zm.884-7.096A1.125 1.125 0 0 0 7.06 6.39l-1.431.448a2.625 2.625 0 1 1 5.13-.784c0 .54-.156 1.015-.503 1.488-.3.408-.7.652-.973.818l-.112.068c-.185.116-.26.203-.302.283-.046.087-.097.245-.097.57h-1.5c0-.47.072-.898.274-1.277.206-.385.507-.645.827-.846l.147-.092c.285-.177.413-.257.526-.41.169-.23.213-.397.213-.602 0-.622-.503-1.125-1.125-1.125z"></path>`
        }}
    />)
}