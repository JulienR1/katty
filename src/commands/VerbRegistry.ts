export enum CommandVerb {
	NONE = "None",
	PLAY = "Play",
	JOIN = "Join",
	KICK = "Kick",
	NEXT = "Next",
	PAUSE = "Pause",
	RESUME = "Resume",
	QUEUE = "Queue",
	LOOP = "Loop",
	CLEAR = "Clear",
}

export const VerbRegistry: { [key in CommandVerb]?: string[] } = {
	Play: ["play", "p"],
	Join: ["join"],
	Kick: ["kick", "leave"],
	Next: ["skip", "next", "s", "n"],
	Pause: ["pause", "stop"],
	Resume: ["resume", "continue", "res"],
	Queue: ["queue", "q", "list"],
	Loop: ["loop", "l", "existentialisme"],
	Clear: ["clear", "c", "empty"],
};
