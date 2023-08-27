import { isNamespaceRegistered, registerNamespace } from "../util/namespaceRegistry";

import NamespaceRegisteredError from "../util/errors/NamespaceRegisteredError";

import throwIfSpicetifyNotReady from "../util/throwIfSpicetifyNotReady";

import ConfigSocket from "./ConfigSocket";
import ConfigFieldToggle, { ConfigFieldToggleProps } from "./configFields/ConfigFieldToggle";
import ConfigFieldText, { ConfigFieldTextProps } from "./configFields/ConfigFieldText";
import ConfigFieldNumber, { ConfigFieldNumberProps } from "./configFields/ConfigFieldNumber";
import ConfigFieldDropdown, { ConfigFieldDropdownProps } from "./configFields/ConfigFieldDropdown";

type StoredConfig = {
    migrationIndex?: number,
    records: Record<string, any>
};

export default class ConfigNamespace {
    private _data: StoredConfig | null = null;
    private _hasLoaded = false;
    private _hasBeenModified = false;
    migrationIndex: number | null;
    activeSockets: Record<string, ConfigSocket> = {};

    constructor (
        public readonly id: string,
        public readonly migrations?: ((records: StoredConfig["records"]) => StoredConfig["records"])[]
    ) {
        if (isNamespaceRegistered(id)) {
            throw new NamespaceRegisteredError(id);
        }

        registerNamespace(id);
        this.migrationIndex = migrations?.length ?? null;
    }

    get hasLoaded(): boolean {
        return this._hasLoaded;
    }

    get hasBeenModified(): boolean {
        return this._hasBeenModified;
    }

    forceLoad(): boolean {
        if (this.hasLoaded) {
            return false;
        }
        throwIfSpicetifyNotReady("Accessing and modifying data requires Spicetify to be loaded.");

        this._hasLoaded = true;
        window.addEventListener("beforeunload", () => this.saveToStorage());

        const stored = Spicetify.LocalStorage.get(this.id);
        if (stored === null) {
            this._data = null;
            return true;
        }

        let storedParsed: StoredConfig | null = null;
        try {
            storedParsed = JSON.parse(stored);
        }
        catch (e) { }

        if (storedParsed === null || typeof storedParsed !== "object") {
            console.error(`Failed to parse config namespace ${this.id}!`);
            this._data = null;
            return true;
        }

        if (this.migrationIndex !== null) {
            for (let i = storedParsed.migrationIndex ?? -1; i < this.migrationIndex; i++) {
                storedParsed.records = this.migrations![i + 1](storedParsed.records);
            }
            storedParsed.migrationIndex = this.migrationIndex;
        }
        
        this._data = storedParsed;

        return true;
    }

    saveToStorage(forced: boolean = false) {
        if (!this.hasLoaded) this.forceLoad();
        if (!this.hasBeenModified && !forced) return;

        if (this._data === null || Object.keys(this._data.records).length === 0) {
            Spicetify.LocalStorage.remove(this.id);
        }
        else {
            Spicetify.LocalStorage.set(this.id, JSON.stringify(this._data));
        }
    }

    _getStored(field: string): any | undefined {
        this.forceLoad();

        if (this._data === null) {
            return undefined;
        }

        return this._data.records[field];
    }

    _setStored(field: string, value: any | undefined) {
        this.forceLoad();

        if (value === undefined) {
            this._clearStored(field);
            return;
        }

        if (this._data === null) {
            this._data = { records: {} };
        }

        this._hasBeenModified = true;
        this._data.records[field] = value;
    }

    _clearStored(id: string) {
        this.forceLoad();

        if (this._data === null) {
            return;
        }

        this._hasBeenModified = true;
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
