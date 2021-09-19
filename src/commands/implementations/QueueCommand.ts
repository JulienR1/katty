import { MusicPlayer } from "../../music/MusicPlayer";
import { Command } from "../Command";
import { ICommandDescription } from "../models/ICommandDescription";
import { CommandVerb } from "../VerbRegistry";

export class QueueCommand extends Command {
	constructor() {
		super(CommandVerb.QUEUE);
	}

	public execute({ channel }: ICommandDescription): void {
		console.log("queue: ", MusicPlayer.Instance().queue());
		channel.send(JSON.stringify(MusicPlayer.Instance().queue()));
	}
}
