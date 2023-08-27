import { getReact } from "../../reactUtil/reactLoader";

import ConfigField from "./ConfigField"
import type ConfigNamespace from "../ConfigNamespace"

import ConfigDisplayDropdown, { ConfigDisplayDropdownProps } from "../../reactUtil/components/configDisplay/ConfigDisplayDropdown";
import useFieldFactoryHooks from "../../reactUtil/useFieldFactoryHooks";

import stringToReactNode from "../../reactUtil/componentWrappers/stringToReactNode";

export type ConfigFieldDropdownProps<T extends string> = {
    defaultValue: T,
    options: T[]
}

export type ConfigFieldDropdownDisplayProps<T extends string> = Pick<ConfigDisplayDropdownProps<T>, "value" | "onChange" | "showRevertButton" | "revertButtonCallback"> & {
    options: T[]
};

export type ConfigFieldDropdownFactoryProps<T extends string> = Omit<ConfigDisplayDropdownProps<T>, keyof ConfigFieldDropdownDisplayProps<T>> & {
    optionBodies?: Record<T, string>
};

export default class ConfigFieldDropdown<T extends string> extends ConfigField<T> {
    readonly options: T[];
    readonly ReactComponent = ConfigDisplayDropdown<T>;
    readonly ReactFactory;

    constructor (
        id: string,
        namespace: ConfigNamespace,
        props: ConfigFieldDropdownProps<T>
    ) {
        const { defaultValue, options } = props;

        super(id, namespace, defaultValue);

        this.options = options;

        this.ReactFactory = (factoryProps: ConfigFieldDropdownFactoryProps<T>) => {
            useFieldFactoryHooks(this);

            return getReact().createElement(this.ReactComponent, this.transformProps(this.getCurrentDisplayProps(), factoryProps));
        }
    }

    deserializer(value: any): T | undefined {
        const str = String(value)
        return this.options.includes(str as T) ? str as T : undefined;
    }

    serializer(value: T): string {
        return String(value);
    }

    getCurrentDisplayProps(): ConfigFieldDropdownDisplayProps<T> {
        return {
            value: this.getValue(),
            onChange: (value: T) => {
                const v = this.deserializer(value);
                if (v !== undefined) {
                    this.setValue(v);
                }
            },
            showRevertButton: this.isUsingDefault(),
            revertButtonCallback: () => this.clearValue(),
            options: this.options,
        }
    }

    transformProps(
        currentDisplayProps: ConfigFieldDropdownDisplayProps<T>,
        factoryProps: ConfigFieldDropdownFactoryProps<T>
    ): ConfigDisplayDropdownProps<T> {
        return {
            ...currentDisplayProps,
            ...factoryProps,
            options: currentDisplayProps.options.map(option => [option, factoryProps.optionBodies?.[option] ?? option] as [T, string])
        }
    }

    stringRenderProps = ["title", "postTitle", "description", "help"] as const;

    render(factoryProps: Omit<ConfigFieldDropdownFactoryProps<T>, typeof this.stringRenderProps[number]> & Record<typeof this.stringRenderProps[number], string>) {
        const adaptedProps: ConfigFieldDropdownFactoryProps<T> = {...factoryProps};

        for (const prop of this.stringRenderProps) {
            if (adaptedProps[prop] === undefined) {
                continue;
            }
            adaptedProps[prop] = stringToReactNode(factoryProps[prop]);
        }

        return this.ReactFactory(adaptedProps);
    }
}