import { Command } from "../Command";
import { CommandVerb } from "../CommandVerb";

export class PlayCommand implements Command {
	private verb: CommandVerb;

	constructor() {
		this.verb = CommandVerb.PLAY;
	}

	public getVerb(): CommandVerb {
		return this.verb;
	}

	public execute(keywords: string[]) {
		console.log("Executing play command w/ args ", keywords);
	}
}
