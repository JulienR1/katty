import { MusicPlayer } from "../../music/MusicPlayer";
import { Command } from "../Command";
import { ICommandDescription } from "../models/ICommandDescription";
import { CommandVerb } from "../VerbRegistry";

export class KickCommand extends Command {
	constructor() {
		super(CommandVerb.KICK);
	}

	public execute(description: ICommandDescription): void {
		MusicPlayer.Instance().leave();
	}
}
