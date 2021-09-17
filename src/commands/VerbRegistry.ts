export enum CommandVerb {
	NONE = "None",
	PLAY = "Play",
	JOIN = "Join",
}

export const VerbRegistry: { [key in CommandVerb]?: string[] } = {
	Play: ["play", "p"],
	Join: ["join"],
};
