import { MusicPlayer } from "../../music/MusicPlayer";
import { Command } from "../Command";
import { ICommandDescription } from "../models/ICommandDescription";
import { CommandVerb } from "../VerbRegistry";

export class PauseCommand extends Command {
	constructor() {
		super(CommandVerb.PAUSE);
	}

	public execute(description: ICommandDescription): void {
		MusicPlayer.Instance().stop();
	}
}
