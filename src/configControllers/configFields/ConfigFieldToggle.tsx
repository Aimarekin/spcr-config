import ConfigField from "./ConfigField";
import type ConfigNamespace from "../ConfigNamespace";

import { useForceUpdate } from "../../reactUtil/hooks";
import ConfigRow from "../../reactUtil/components/ConfigRow";
import ToggleInput from "../../reactUtil/components/inputs/ToggleInput";

import { ConfigFieldToggleProps } from "../ConfigProps";

export default class ConfigFieldToggle extends ConfigField<boolean> {
    constructor (
        id: string,
        namespace: ConfigNamespace,
        props: ConfigFieldToggleProps
    ) {
        super(id, namespace, props);
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
            <ToggleInput
                id={this.getFullName()}
                value={this.getValue()}
                onChange={(e) => this.setValue(e.target.checked)}
            />
        </ConfigRow>
        )
    }
}