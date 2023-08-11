import ConfigField from "./ConfigField";
import type ConfigNamespace from "../ConfigNamespace";

import { useForceUpdate } from "../../reactUtil/hooks";
import ConfigRow from "../../reactUtil/components/ConfigRow";
import NumberInput from "../../reactUtil/components/inputs/NumberInput";

import { ConfigFieldNumberProps } from "../ConfigProps";

export default class ConfigFieldNumber extends ConfigField<number> {
    private _placeholder?: string;
    private _min?: number;
    private _max?: number;
    private _step?: number;

    constructor (
        id: string,
        namespace: ConfigNamespace,
        props: ConfigFieldNumberProps
    ) {
        const { min, max, step } = props;

        if (min !== undefined && max !== undefined && min > max) {
            throw new Error("min cannot be greater than max");
        }

        super(id, namespace, props);

        this._min = min;
        this._max = max;
        this._step = step;
        this._placeholder = props.placeholder;
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

    get placeholder() {
        return this._placeholder;
    }

    set placeholder(value: string | undefined) {
        if (value === this._placeholder) {
            return;
        }
        this._placeholder = value;
        this.dispatchEvent(new Event("renderingChange"));
    }

    get min() {
        return this._min;
    }

    set min(value: number | undefined) {
        if (value === this._min) {
            return;
        }

        if (value !== undefined && this._max !== undefined && value > this._max) {
            throw new Error("min cannot be greater than max");
        }

        this._min = value;
        this.dispatchEvent(new Event("renderingChange"));
    }

    get max() {
        return this._max;
    }

    set max(value: number | undefined) {
        if (value === this._max) {
            return;
        }

        if (this._min !== undefined && value !== undefined && this._min > value) {
            throw new Error("min cannot be greater than max");
        }

        this._max = value;
        this.dispatchEvent(new Event("renderingChange"));
    }

    get step() {
        return this._step;
    }

    set step(value: number | undefined) {
        if (value === this._step) {
            return;
        }
        this._step = value;
        this.dispatchEvent(new Event("renderingChange"));
    }

    Render() {
        const forceUpdate = useForceUpdate();

        Spicetify.React.useEffect(() => {
            this.addEventListener("renderingChange", forceUpdate);
            return () => this.removeEventListener("renderingChange", forceUpdate);
        }, []);

        return (
        <ConfigRow
            id={this.getFullName()}
            description={this.description}
            help={this.help}
            showRevertButton={this.isUsingDefault()}
            revertButtonCallback={() => this.clearValue()}
        >
            <NumberInput
                id={this.getFullName()}
                value={this.getValue()}
                placeholder={this.placeholder}
                min={this.min}
                max={this.max}
                step={this.step}
                onChange={(e) => {
                    const deserialized = this.deserializer(e.target.value);
                    if (deserialized !== undefined) {
                        this.setValue(deserialized);
                    }
                }}
            />
        </ConfigRow>
        )
    }
}