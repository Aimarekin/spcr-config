import { spicetifyReady } from "./util/spicetifyLoder";
import { isNamespaceRegistered, registerNamespace, unregisterNamespace } from "./util/namespaceRegistry";
import { useForceUpdate } from "./reactUtil/hooks";
import ConfigRow from "./reactUtil/components/ConfigRow";

type StoredConfig = {
    migrationIndex?: number,
    records: Record<string, any>
}

export class ConfigNamespace {
    private _data: StoredConfig | null;
    _closed: boolean = false;
    private _closeConnection: () => void;
    migrationIndex: number | null;
    activeSockets: Record<string, ConfigSocket> = {};

    constructor (
        public readonly id: string,
        migrations?: ((records: Record<string, any>) => Record<string, any>)[]
    ) {
        if (!spicetifyReady) {
            throw new Error("Spicetify is not ready! Please wait for spicetifyReady to be true before creating a ConfigNamespace. The async function waitForSpicetify() will resolve once it is.");
        }
        if (isNamespaceRegistered(id)) {
            throw new Error(`ConfigNamespace with id ${id} already exists! Extension might have duplicate instances.`);
        }

        registerNamespace(id);
        this.migrationIndex = migrations?.length ?? null;

        this._closeConnection = this.saveToStorage.bind(this);
        window.addEventListener("beforeunload", this._closeConnection);

        const stored = Spicetify.LocalStorage.get(this.id);
        if (stored === null) {
            this._data = null;
            return
        }

        let storedParsed: StoredConfig | null = null;
        try {
            storedParsed = JSON.parse(stored);
        }
        catch (e) { }

        if (storedParsed === null || typeof storedParsed !== "object") {
            console.error(`Failed to parse config namespace ${this.id}!`);
            this._data = null;
            return;
        }

        if (this.migrationIndex !== null) {
            for (let i = storedParsed.migrationIndex ?? -1; i < this.migrationIndex; i++) {
                storedParsed.records = migrations![i + 1](storedParsed.records);
            }
            storedParsed.migrationIndex = this.migrationIndex;
        }
        
        this._data = storedParsed;
    }

    close() {
        if (this._closed) {
            throw new Error(`ConfigNamespace ${this.id} is already closed!`);
        }
        window.removeEventListener("beforeunload", this._closeConnection);
        this.saveToStorage();
        unregisterNamespace(this.id);
    }

    saveToStorage() {
        if (this._closed) {
            throw new Error(`ConfigNamespace ${this.id} is closed and cannot be used!`);
        }

        if (this._data === null || Object.keys(this._data.records).length === 0) {
            Spicetify.LocalStorage.remove(this.id);
        }
        else {
            Spicetify.LocalStorage.set(this.id, JSON.stringify(this._data));
        }
    }

    _getStored(field: string): any | undefined {
        if (this._closed) {
            throw new Error(`ConfigNamespace ${this.id} is closed and cannot be used!`);
        }

        if (this._data === null) {
            return undefined;
        }
        return this._data.records[field];
    }

    _setStored(field: string, value: any | undefined) {
        if (this._closed) {
            throw new Error(`ConfigNamespace ${this.id} is closed and cannot be used!`);
        }

        if (value === undefined) {
            this._clearStored(field);
            return;
        }
        if (this._data === null) {
            this._data = { records: {} };
        }
        this._data.records[field] = value;
    }

    _clearStored(id: string) {
        if (this._closed) {
            throw new Error(`ConfigNamespace ${this.id} is closed and cannot be used!`);
        }
        
        if (this._data === null) {
            return;
        }
        delete this._data.records[id];
    }

    createSocket(id: string) {
        return new ConfigSocket(id, this);
    }

    createStore<T>(id: string, defaultValue: any, deserializer?: (value: any) => (T | undefined), serializer?: (value: T) => any) {
        return new ConfigStore<T>(id, this, defaultValue, deserializer, serializer);
    }

    createFieldText(id: string, props: ConfigFieldTextProps) {
        return new ConfigFieldText(id, this, props);
    }

    createFieldToggle(id: string, props: ConfigFieldToggleProps) {
        return new ConfigFieldToggle(id, this, props);
    }

    createFieldNumber(id: string, props: ConfigFieldNumberProps) {
        return new ConfigFieldNumber(id, this, props);
    }

    createFieldDropdown<T extends string>(id: string, props: ConfigFieldDropdownProps<T>) {
        return new ConfigFieldDropdown(id, this, props);
    }
}

export class ConfigSocket extends EventTarget {
    constructor(
        readonly id: string,
        private readonly namespace: ConfigNamespace,
    ) {
        super();

        if (this.namespace._closed) {
            throw new Error(`ConfigNamespace ${this.namespace.id} is closed and cannot be used!`);
        }
        if (this.namespace.activeSockets[this.id]) {
            throw new Error(`ConfigSocket with id ${this.id} already exists! Do not create more than one class for the same setting.`);
        }

        this.namespace.activeSockets[this.id] = this;
    }

    getValue(): any {
        return this.namespace._getStored(this.id);
    }

    setValue(value: any) {
        const prevValue = this.getValue();
        this.namespace._setStored(this.id, value);

        if (prevValue !== value) {
            this.dispatchEvent(new Event("storedValueChange"));
        }
    }

    clearValue() {
        const prevValue = this.getValue();
        this.namespace._clearStored(this.id);

        if (prevValue !== undefined) {
            this.dispatchEvent(new Event("storedValueChange"));
        }
    }

    getFullName() {
        return `${this.namespace.id}.${this.id}`;
    }
}

export class ConfigStore<T> extends ConfigSocket {
    _currentValue: T;
    _isDefault: boolean;

    constructor(
        id: string,
        namespace: ConfigNamespace,
        public readonly defaultValue: T,
        public readonly deserializer?: Deserializer<T>,
        public readonly serializer?: Serializer<T>,
    ) {
        super(id, namespace);

        const storedValue = this._getDeserializedStoredValue();
        
        if (storedValue === undefined) {
            this._currentValue = defaultValue;
            this._isDefault = true;
        }
        else {
            this._currentValue = storedValue;
            this._isDefault = false;
        }
    }

    private _getDeserializedStoredValue(): T | undefined {
        const storedValue = super.getValue();
        if (storedValue === undefined) {
            return this.defaultValue;
        }

        if (this.deserializer) {
            const deserialized = this.deserializer(storedValue);
            if (deserialized === undefined) {
                return this.defaultValue;
            }
            return deserialized;
        }

        return storedValue;
    }

    getValue(): T {
        return this._currentValue;
    }

    setValue(value: T) {
        if (value === undefined) {
            this.clearValue();
            return;
        }

        const prevValue = this._currentValue;
        const prevDefault = this._isDefault;

        this._currentValue = value;
        this._isDefault = false;
        super.setValue(this.serializer ? this.serializer(value) : value);

        if (prevValue !== value) {
            this.dispatchEvent(new Event("valueChange"));
        }
        if (prevDefault) {
            this.dispatchEvent(new Event("defaultChange"));
        }
    }

    clearValue() {
        const prevValue = this._currentValue;
        const prevDefault = this._isDefault;

        this._currentValue = this.defaultValue;
        this._isDefault = true;
        super.clearValue();

        if (prevValue !== this.defaultValue) {
            this.dispatchEvent(new Event("valueChange"));
        }
        if (!prevDefault) {
            this.dispatchEvent(new Event("defaultChange"));
        }
    }

    isUsingDefault() {
        return this._isDefault;
    }
}



export class ConfigField<T> extends ConfigStore<T> {
    private _description?: string;
    private _help?: string;

    constructor (
        id: string,
        namespace: ConfigNamespace,
        props: ConfigFieldProps<T>,
        deserialize?: (value: any) => (T | undefined),
        serialize?: (value: T) => any,
    ) {
        const { defaultValue, description, help } = props;

        super(id, namespace, defaultValue, deserialize, serialize);
        this._description = description;
        this._help = help;

        super.addEventListener("valueChange", () => this.dispatchEvent(new Event("renderingChange")));
        super.addEventListener("defaultChange", () => this.dispatchEvent(new Event("renderingChange")));
    }

    get description() {
        return this._description;
    }

    set description(value: string | undefined) {
        if (value === this._description) {
            return;
        }
        this._description = value;
        this.dispatchEvent(new Event("renderingChange"));
    }

    get help() {
        return this._help;
    }

    set help(value: string | undefined) {
        if (value === this._help) {
            return;
        }
        this._help = value;
        this.dispatchEvent(new Event("renderingChange"));
    }

    Render() {
        throw new Error("Render method not implemented.");
    }
}

export class ConfigFieldText extends ConfigField<string> {
    private _multiline: boolean;
    private _placeholder?: string;

    constructor (
        id: string,
        namespace: ConfigNamespace,
        props: ConfigFieldTextProps
    ) {
        const { multiline = false, placeholder } = props;
        super(id, namespace, props, (value: any) => String(value), (value: string) => String(value) );

        this._multiline = multiline;
        this._placeholder = placeholder;
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

    Render() {
        const forceUpdate = useForceUpdate();

        Spicetify.React.useEffect(() => {
            this.addEventListener("renderingChange", forceUpdate);
            return () => this.removeEventListener("renderingChange", forceUpdate);
        }, []);

        return (
        <ConfigRow
            labelFor={this.getFullName()}
            description={this.description}
            help={this.help}
            revertButtonCallback={this.isUsingDefault() ? undefined : () => this.clearValue()}
        >
            {
            this.multiline
            ? (
                <textarea
                    id={this.getFullName()}
                    defaultValue={this.getValue()}
                    placeholder={this.placeholder}
                    onBlur={(e) => this.setValue(e.target.value)}
                />
            )
            : (
                <input
                    id={this.getFullName()}
                    type="text"
                    defaultValue={this.getValue()}
                    placeholder={this.placeholder}
                    onBlur={(e) => this.setValue(e.target.value)}
                />
            )
            }
        </ConfigRow>
        )
    }
}

export class ConfigFieldToggle extends ConfigField<boolean> {
    constructor (
        id: string,
        namespace: ConfigNamespace,
        props: ConfigFieldToggleProps
    ) {
        super(id, namespace, props, (value: any) => Boolean(value), (value: boolean) => Boolean(value));
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
            labelFor={this.getFullName()}
            description={this.description}
            help={this.help}
            revertButtonCallback={this.isUsingDefault() ? undefined : () => this.clearValue()}
        >
            <input
                id={this.getFullName()}
                type="checkbox"
                defaultChecked={this.getValue()}
                onChange={(e) => this.setValue(e.target.checked)}
            />
        </ConfigRow>
        )
    }
}

export class ConfigFieldNumber extends ConfigField<number> {
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

        super(
            id, namespace, props,
            (value: any) => {
                let num = Number(value)

                if (isNaN(num)) {
                    return undefined;
                }
                if (step !== undefined && num % step !== 0) {
                    num = Math.round(num / step) * step;
                }
                if (min !== undefined && num < min) {
                    return min;
                }
                if (max !== undefined && num > max) {
                    return max;
                }

                return num;
            },
            (value: number) => Number(value)
        );

        this._min = min;
        this._max = max;
        this._step = step;
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
            labelFor={this.getFullName()}
            description={this.description}
            help={this.help}
            revertButtonCallback={this.isUsingDefault() ? undefined : () => this.clearValue()}
        >
            <input
                id={this.getFullName()}
                type="number"
                defaultValue={this.getValue()}
                min={this.min}
                max={this.max}
                step={this.step}
                onBlur={(e) => this.setValue(e.target.valueAsNumber)}
            />
        </ConfigRow>
        )
    }
}

export class ConfigFieldDropdown<T extends string> extends ConfigField<T> {
    private _options: string[];

    constructor (
        id: string,
        namespace: ConfigNamespace,
        props: ConfigFieldDropdownProps<T>
    ) {
        const { options = [] } = props;

        super(
            id, namespace, props,
            (value: any) => {
                const str = String(value) as T
                return options.includes(str) ? (str) : undefined;
            },
            (value: string) => String(value)
        );

        this._options = options;
    }

    get options() {
        return this._options;
    }

    set options(value: string[]) {
        if (value === this._options) {
            return;
        }
        this._options = value;
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
            labelFor={this.getFullName()}
            description={this.description}
            help={this.help}
            revertButtonCallback={this.isUsingDefault() ? undefined : () => this.clearValue()}
        >
            <select
                id={this.getFullName()}
                defaultValue={this.getValue()}
                onBlur={(e) => this.setValue(e.target.value as T)}
            >
                {this.options.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
        </ConfigRow>
        )
    }
}