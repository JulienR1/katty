import { CommandVerb } from "../CommandVerb";
import { Command } from "../Command";

export class PlayCommand extends Command {
	constructor() {
		super(CommandVerb.PLAY);
	}

	public execute(keywords: string[]) {
		console.log("Executing play command w/ args ", keywords);
	}
}
