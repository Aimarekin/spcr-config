import ConfigField from "./ConfigField"
import type ConfigNamespace from "../ConfigNamespace"

import { useForceUpdate } from "../../reactUtil/hooks"
import ConfigRow from "../../reactUtil/components/ConfigRow"
import DropdownInput from "../../reactUtil/components/inputs/DropdownInput"

import { ConfigFieldDropdownProps } from "../ConfigProps"

export default class ConfigFieldDropdown<T extends string> extends ConfigField<T> {
    private _options: [T, string][];
    private _optionKeys: Set<T>;

    constructor (
        id: string,
        namespace: ConfigNamespace,
        props: ConfigFieldDropdownProps<T>
    ) {
        const { options } = props;

        super(id, namespace, props);

        this._options = options.map(a => [...a]);
        this._optionKeys = new Set(options.map(([key]) => key));
    }

    deserializer(value: any): T | undefined {
        const str = String(value)
        return this._optionKeys.has(str as T) ? str as T : undefined;
    }

    serializer(value: T): string {
        return String(value);
    }

    get options(): [T, string][] {
        return this._options.map(a => [...a]);
    }

    set options(value: [T, string][]) {
        if (value === this._options) {
            return;
        }
        this._options = value.map(a => [...a]);
        this._optionKeys = new Set(value.map(([key]) => key));
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
            <DropdownInput
                id={this.getFullName()}
                value={this.getValue()}
                options={this.options}
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