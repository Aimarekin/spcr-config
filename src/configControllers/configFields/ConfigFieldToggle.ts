import { getReact } from "../../reactUtil/reactLoader";

import ConfigField from "./ConfigField";
import type ConfigNamespace from "../ConfigNamespace";

import ConfigDisplayToggle, {ConfigDisplayToggleProps} from "../../reactUtil/components/configDisplay/ConfigDisplayToggle";
import useFieldFactoryHooks from "../../reactUtil/useFieldFactoryHooks";

export type ConfigFieldToggleDisplayProps = Pick<ConfigDisplayToggleProps, "value" | "onChange" | "showRevertButton" | "revertButtonCallback">;

export type ConfigFieldToggleFactoryProps = Omit<ConfigDisplayToggleProps, keyof ConfigFieldToggleDisplayProps>;

export type ConfigFieldToggleProps = {
    defaultValue: boolean
}

export default class ConfigFieldToggle extends ConfigField<boolean> {
    readonly ReactComponent = ConfigDisplayToggle;
    readonly ReactFactory;

    constructor (
        id: string,
        namespace: ConfigNamespace,
        props: ConfigFieldToggleProps
    ) {
        const { defaultValue } = props;

        super(id, namespace, defaultValue);

        this.ReactFactory = (props: ConfigFieldToggleFactoryProps) => {
            useFieldFactoryHooks(this);

            return getReact().createElement(this.ReactComponent, this.transformProps(this.getCurrentDisplayProps(), props));
        }
    }

    deserializer(value: any): boolean {
        return Boolean(value);
    }

    serializer(value: boolean): boolean {
        return Boolean(value);
    }

    toggle(): boolean {
        const setTo = !this.getValue();
        this.setValue(setTo);
        return setTo;
    }

    getCurrentDisplayProps(): ConfigFieldToggleDisplayProps {
        return {
            value: this.getValue(),
            onChange: (value: boolean) => {
                const v = this.deserializer(value);
                if (v !== undefined) {
                    this.setValue(v);
                }
            },
            showRevertButton: this.isUsingDefault(),
            revertButtonCallback: () => this.clearValue()
        }
    }

    transformProps(
        currentDisplayProps: ConfigFieldToggleDisplayProps,
        factoryProps: ConfigFieldToggleFactoryProps
    ): ConfigDisplayToggleProps {
        return {
            ...currentDisplayProps,
            ...factoryProps
        }
    }
}