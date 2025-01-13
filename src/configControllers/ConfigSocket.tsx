import type ConfigNamespace from "./ConfigNamespace";

import ListenerTarget from "../util/ListenerTarget";
import SocketOccupiedError from "../util/errors/SocketOccupiedError";

export type ConfigSocketEventMap<UsingThis> = {
	storedValueChange: (this: UsingThis, value: any, prevValue: any) => void;
};

export default class ConfigSocket {
	_listenerTarget: ListenerTarget<ConfigSocket, ConfigSocketEventMap<ConfigSocket>> = new ListenerTarget();
	listenTo = this._listenerTarget.listenTo;

	constructor(
		readonly namespace: ConfigNamespace,
		readonly id: string
	) {
		if (this.namespace.activeSockets[this.id]) {
			throw new SocketOccupiedError(namespace.id, id);
		}

		this.namespace.activeSockets[this.id] = this;
	}

	getValue(): any {
		return this.namespace._getStored(this.id);
	}

	setValue(value: any) {
		const prevValue = this.getValue();
		this.namespace._setStored(this.id, value);

		this._listenerTarget.dispatch("storedValueChange", this, [value, prevValue]);
	}

	clearValue() {
		const prevValue = this.getValue();

		if (prevValue !== undefined) {
			this.namespace._clearStored(this.id);
			this._listenerTarget.dispatch("storedValueChange", this, [undefined, prevValue]);
		}
	}

	getFullName() {
		return `${this.namespace.id}.${this.id}`;
	}
}
