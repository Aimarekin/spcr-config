export type InputProps<T, ElementType = Element> = {
    id: string,
    value: T,
    onChange: React.ChangeEventHandler<ElementType>,
}

export type InputTextualProps<T, ElementType = Element> = InputProps<T, ElementType> & {
    placeholder?: string,
};

export type ConfigRowProps = {
    id: string,
    description?: React.ReactNode,
    help?: string,
    showRevertButton?: boolean,
    revertButtonCallback?: React.DOMAttributes<HTMLButtonElement>["onClick"]
}