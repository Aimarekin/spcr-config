import { spicetifyReady } from "../util/spicetifyLoader";
import { isNamespaceRegistered, registerNamespace, unregisterNamespace } from "../util/namespaceRegistry";

import ConfigSocket from "./ConfigSocket";
import ConfigFieldToggle from "./configFields/ConfigFieldToggle";
import ConfigFieldText from "./configFields/ConfigFieldText";
import ConfigFieldNumber from "./configFields/ConfigFieldNumber";
import ConfigFieldDropdown from "./configFields/ConfigFieldDropdown";

import { ConfigFieldToggleProps, ConfigFieldTextProps, ConfigFieldNumberProps, ConfigFieldDropdownProps } from "./ConfigProps";

type StoredConfig = {
    migrationIndex?: number,
    records: Record<string, any>
};

export default class ConfigNamespace {
    private _data: StoredConfig | null;
    _closed: boolean = false;
    private _closeConnection: () => void;
    migrationIndex: number | null;
    activeSockets: Record<string, ConfigSocket> = {};

    constructor (
        public readonly id: string,
        migrations?: ((records: StoredConfig["records"]) => StoredConfig["records"])[]
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

    createFieldToggle(id: string, props: ConfigFieldToggleProps) {
        return new ConfigFieldToggle(id, this, props);
    }

    createFieldText(id: string, props: ConfigFieldTextProps) {
        return new ConfigFieldText(id, this, props);
    }

    createFieldNumber(id: string, props: ConfigFieldNumberProps) {
        return new ConfigFieldNumber(id, this, props);
    }

    createFieldDropdown<T extends string>(id: string, props: ConfigFieldDropdownProps<T>) {
        return new ConfigFieldDropdown(id, this, props);
    }
}
