export default function stringOrUndefined(value: any): string | undefined {
	return typeof value === "string" ? value : undefined;
}
