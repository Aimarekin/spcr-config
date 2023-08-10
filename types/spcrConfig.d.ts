type ConfigFieldProps<T> = {
    defaultValue: T,
    description?: string,
    help?: string,
}

type ConfigFieldTextProps = ConfigFieldProps<string> & {
    multiline?: boolean,
    placeholder?: string,
}

type ConfigFieldToggleProps = ConfigFieldProps<boolean>

type ConfigFieldNumberProps = ConfigFieldProps<number> & {
    min?: number,
    max?: number,
    step?: number,
}

type ConfigFieldDropdownProps<T extends string> = ConfigFieldProps<T> & {
    options: T[],
}

type StoredConfig = {
    migrationIndex?: number,
    records: Record<string, any>
}

class ConfigNamespace {
    private _data: StoredConfig | null;
    _closed: boolean;
    private _closeConnection: () => void;
    migrationIndex: number | null;
    activeSockets: Record<string, ConfigSocket>;
  
    constructor(id: string, migrations?: ((records: Record<string, any>) => Record<string, any>)[]);
  
    close(): void;
  
    saveToStorage(): void;
  
    _getStored(field: string): any | undefined;
  
    _setStored(field: string, value: any | undefined): void;
  
    _clearStored(id: string): void;
  
    createSocket(id: string): ConfigSocket;
  
    createStore<T>(id: string, defaultValue: any, deserializer?: (value: any) => (T | undefined), serializer?: (value: T) => any): ConfigStore<T>;
  
    createField<T>(id: string, defaultValue: any, description?: string, help?: string, deserialize?: (value: any) => (T | undefined), serialize?: (value: T) => any): ConfigField<T>;
  
    createFieldText(id: string, props: ConfigFieldTextProps): ConfigFieldText;
  
    createFieldToggle(id: string, props: ConfigFieldToggleProps): ConfigFieldToggle;
  
    createFieldNumber(id: string, props: ConfigFieldNumberProps): ConfigFieldNumber;
  
    createFieldDropdown<T extends string>(id: string, props: ConfigFieldDropdownProps<T>): ConfigFieldDropdown<T>;
}

class ConfigSocket extends EventTarget {
    readonly id: string;
    private readonly namespace: ConfigNamespace;
  
    constructor(id: string, namespace: ConfigNamespace);
  
    getValue(): any;
  
    setValue(value: any): void;
  
    clearValue(): void;
  
    getFullName(): string;
}

type Deserializer<T> = (value: any) => (T | undefined);
type Serializer<T> = (value: T) => any;

class ConfigStore<T> extends ConfigSocket {
  readonly defaultValue: T;
  readonly deserializer?: Deserializer<T>;
  readonly serializer?: Serializer<T>;

  constructor(id: string, namespace: ConfigNamespace, defaultValue: T, deserializer?: Deserializer<T>, serializer?: Serializer<T>);

  getValue(): T;

  setValue(value: T): void;

  clearValue(): void;

  isUsingDefault(): boolean;
}

class ConfigField<T> extends ConfigStore<T> {
    private _description?: string;
    private _help?: string;
  
    constructor(id: string, namespace: ConfigNamespace, props: ConfigFieldProps<T>, deserialize?: Deserializer<T>, serialize?: Serializer<T>);
  
    description?: string;
  
    help?: string;

    Render(): JSX.Element;
}

class ConfigFieldText extends ConfigStore<string> {
    private _multiline: boolean;
    private _placeholder?: string;
  
    constructor(id: string, namespace: ConfigNamespace, props: ConfigFieldTextProps);
  
    multiline: boolean;
  
    placeholder?: string;
}

class ConfigFieldToggle extends ConfigStore<boolean> {
    constructor(id: string, namespace: ConfigNamespace, props: ConfigFieldToggleProps);
  
    toggle(): boolean;
}

class ConfigFieldNumber extends ConfigStore<number> {
    private _min?: number;
    private _max?: number;
    private _step?: number;
  
    constructor(id: string, namespace: ConfigNamespace, props: ConfigFieldNumberProps);
  
    min?: number;
  
    max?: number;
  
    step?: number;
}

class ConfigFieldDropdown<T extends string> extends ConfigStore<T> {
    private _options: T[];
  
    constructor(id: string, namespace: ConfigNamespace, props: ConfigFieldDropdownProps<T>);
  
    options: T[];
}