import { isSpicetifyReady, waitForSpicetify } from "../util/spicetifyLoader";
import { getReact } from "./reactLoader";

type SpicetifyLocaleDictionary = ReturnType<typeof Spicetify.Locale.getDictionary>;

export default function useSpicetifyLocaleDictionary(): SpicetifyLocaleDictionary | null {
	const React = getReact();

	const [dictionary, setDictionary] = React.useState<SpicetifyLocaleDictionary | null>(() => {
		if (isSpicetifyReady()) {
			return Spicetify.Locale.getDictionary();
		}
		return null;
	});

	React.useEffect(() => {
		if (!isSpicetifyReady()) {
			waitForSpicetify().then(() => {
				setDictionary(Spicetify.Locale.getDictionary());
			});
		}
	}, []);

	return dictionary as SpicetifyLocaleDictionary;
}
