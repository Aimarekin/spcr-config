export type ConfigFieldProps<T> = {
    defaultValue: T,
    description?: string,
    help?: string,
};

export type TextualConfigFieldProps<T> = ConfigFieldProps<T> & {
    placeholder?: string,
};

export type ConfigFieldTextProps = TextualConfigFieldProps<string> & {
    multiline?: boolean,
};

export type ConfigFieldToggleProps = ConfigFieldProps<boolean>;

export type ConfigFieldNumberProps = TextualConfigFieldProps<number> & {
    min?: number,
    max?: number,
    step?: number,
};

export type ConfigFieldDropdownProps<T extends string> = ConfigFieldProps<T> & {
    options: [T, string][],
};