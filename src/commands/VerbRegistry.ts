import { CommandVerb } from "./CommandVerb";

export const VerbRegistry: { [key in CommandVerb]?: string[] } = {
	Play: ["play", "p"],
};
