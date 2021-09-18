import { MusicPlayer } from "../../music/MusicPlayer";
import { Command } from "../Command";
import { ICommandDescription } from "../models/ICommandDescription";
import { CommandVerb } from "../VerbRegistry";

export class ResumeCommand extends Command {
	constructor() {
		super(CommandVerb.RESUME);
	}

	public execute(description: ICommandDescription): void {
		MusicPlayer.Instance().resume();
	}
}
