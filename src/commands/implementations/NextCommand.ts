import { MusicPlayer } from "../../music/MusicPlayer";
import { Command } from "../Command";
import { ICommandDescription } from "../models/ICommandDescription";
import { CommandVerb } from "../VerbRegistry";

export class NextCommand extends Command {
	constructor() {
		super(CommandVerb.NEXT);
	}

	public execute(description: ICommandDescription): void {
		MusicPlayer.Instance().next();
	}
}
