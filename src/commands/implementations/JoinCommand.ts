import { MusicPlayer } from "../../music/MusicPlayer";
import { Command } from "../Command";
import { ICommandDescription } from "../models/ICommandDescription";
import { CommandVerb } from "../VerbRegistry";

export class JoinCommand extends Command {
	constructor() {
		super(CommandVerb.JOIN);
	}

	public async execute({ member }: ICommandDescription) {
		MusicPlayer.Instance().join(member.voice.channel);
	}
}
