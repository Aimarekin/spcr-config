import ConfigField from "./ConfigField";
import type ConfigNamespace from "../ConfigNamespace";

import { useForceUpdate } from "../../reactUtil/hooks";
import ConfigRow from "../../reactUtil/components/ConfigRow";
import TextInput from "../../reactUtil/components/inputs/TextInput";

import { ConfigFieldTextProps } from "../ConfigProps";

export default class ConfigFieldText extends ConfigField<string> {
    private _placeholder?: string;
    private _multiline: boolean;

    constructor (
        id: string,
        namespace: ConfigNamespace,
        props: ConfigFieldTextProps
    ) {
        const { multiline = false, placeholder } = props;
        super(id, namespace, props);

        this._multiline = multiline;
        this._placeholder = placeholder;
    }

    deserializer(value: any): string {
        return String(value);
    }

    serializer(value: string): string {
        return String(value);
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

    get multiline() {
        return this._multiline;
    }

    set multiline(value: boolean) {
        if (value === this._multiline) {
            return;
        }
        this._multiline = value;
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
            revertButtonCallback={this.isUsingDefault() ? undefined : () => this.clearValue()}
        >
            <TextInput
                id={this.getFullName()}
                value={this.getValue()}
                placeholder={this.placeholder}
                multiline={this.multiline}
                onChange={(e) => this.setValue(e.target.value)}
            />
        </ConfigRow>
        )
    }
}