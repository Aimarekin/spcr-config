export default class SocketOccupiedError extends Error {
	name = "SocketOccupiedError";

	constructor(
		public namespaceId: string,
		public socketName: string
	) {
		super(`${namespaceId}'s field ${socketName} already has a connected socket. Disconnect it first.`);
	}
}
