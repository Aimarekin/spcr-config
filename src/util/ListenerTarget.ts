type GenericEventMap<UsingThis> = Record<string, (this: UsingThis, ...args: any[]) => void>;

export default class ListenerTarget<UsingThis, EventMap extends GenericEventMap<UsingThis>> {
	private _listenerIdCounter = 0;
	listeners: { [K in keyof EventMap]?: { id: number; callback: EventMap[K] }[] } = {};

	listenTo<K extends keyof EventMap>(type: K, callback: EventMap[K], once = false): () => boolean {
		if (!this.listeners[type]) this.listeners[type] = [];

		const thisId = this._listenerIdCounter++;

		this.listeners[type]!.push({
			id: thisId,
			callback
		});

		return () => {
			const foundIndex = this.listeners[type]!.findIndex((listener) => listener.id === thisId);

			if (foundIndex === -1) {
				return false;
			}

			this.listeners[type].splice(foundIndex, 1);

			return true;
		};
	}

	dispatch<K extends keyof EventMap>(type: K, useThis: UsingThis, args?: Parameters<EventMap[K]>): void {
		if (!this.listeners[type]) return;

		for (const listener of this.listeners[type]!) {
			listener.callback.apply(useThis, args);
		}
	}
}
