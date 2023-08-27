import { getReact } from "../../reactUtil/reactLoader";

import ConfigField from "./ConfigField";
import type ConfigNamespace from "../ConfigNamespace";

import ConfigDisplayNumber, { ConfigDisplayNumberProps } from "../../reactUtil/components/configDisplay/ConfigDisplayNumber";
import useFieldFactoryHooks from "../../reactUtil/useFieldFactoryHooks";

export type ConfigFieldNumberProps = {
    defaultValue: number,
    min?: number,
    max?: number,
    step?: number
}

export type ConfigFieldNumberDisplayProps = Pick<ConfigDisplayNumberProps, "value" | "onChange" | "showRevertButton" | "revertButtonCallback">;

export type ConfigFieldNumberFactoryProps = Omit<ConfigDisplayNumberProps, keyof ConfigFieldNumberDisplayProps>

export default class ConfigFieldNumber extends ConfigField<number> {
    readonly min?: number;
    readonly max?: number;
    readonly step?: number;
    readonly ReactComponent = ConfigDisplayNumber;
    readonly ReactFactory;

    constructor (
        id: string,
        namespace: ConfigNamespace,
        props: ConfigFieldNumberProps,
    ) {
        const { defaultValue, min, max, step } = props;

        if (min !== undefined && max !== undefined && min > max) {
            throw new Error("min cannot be greater than max");
        }

        super(id, namespace, defaultValue);

        this.min = min;
        this.max = max;
        this.step = step;

        this.ReactFactory = (factoryProps: ConfigFieldNumberFactoryProps) => {
            useFieldFactoryHooks(this);

            return getReact().createElement(this.ReactComponent, this.transformProps(this.getCurrentDisplayProps(),factoryProps));
        }
    }

    deserializer(value: any): number | undefined {
        let num = Number(value)

        if (isNaN(num)) {
            return undefined;
        }
        if (this.step !== undefined && num % this.step !== 0) {
            num = Math.round(num / this.step) * this.step;
        }
        if (this.min !== undefined && num < this.min) {
            return this.min;
        }
        if (this.max !== undefined && num > this.max) {
            return this.max;
        }

        return num;
    }

    serializer(value: number): number {
        return Number(value);
    }

    getCurrentDisplayProps(): ConfigFieldNumberDisplayProps {
        return {
            value: this.getValue(),
            onChange: (value: number) => {
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
        currentDisplayProps: ConfigFieldNumberDisplayProps,
        factoryProps: ConfigFieldNumberFactoryProps
    ): ConfigDisplayNumberProps {
        return {
            ...currentDisplayProps,
            ...factoryProps
        }
    }
}