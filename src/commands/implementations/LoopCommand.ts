import { MessageEmbed, VoiceChannel } from "discord.js";
import { PlayerLibrary } from "../../music/PlayerLibrary";
import { Command } from "../Command";
import { ErrorEmbed, SuccessEmbed } from "../embeds";
import { ICommandDescription } from "../models/ICommandDescription";
import { CommandVerb } from "../VerbRegistry";
import i18n from "i18n";

export class LoopCommand extends Command {
	constructor() {
		super(CommandVerb.LOOP);
	}

	public execute({ member, channel }: ICommandDescription): void {
		const musicPlayer = PlayerLibrary.Instance().getFrom(member?.voice.channel as VoiceChannel);
		if (!musicPlayer) {
			console.log("TODO: connec!");
			return;
		}

		let embedToSend = new MessageEmbed();
		try {
			musicPlayer.toggleLoop();
			embedToSend = this.successEmbed(musicPlayer.getIsLooping());
		} catch (err) {
			embedToSend = this.errorEmbed();
			console.log(err);
		} finally {
			channel.send({ embeds: [embedToSend] });
		}
	}

	private successEmbed = (isLooping: boolean) =>
		new SuccessEmbed().setTitle(
			i18n.__("loop.title", { loopState: i18n.__(isLooping ? "loop.activeState" : "loop.inactiveState") })
		);

	private errorEmbed = () => new ErrorEmbed().setDescription(i18n.__("loop.error"));
}
