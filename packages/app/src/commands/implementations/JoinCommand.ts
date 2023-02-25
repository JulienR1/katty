import { TextBasedChannels, VoiceChannel } from "discord.js";
import { PlayerLibrary } from "../../music/PlayerLibrary";
import { Command } from "../Command";
import { GoodbyeEmbed } from "../embeds";
import { ICommandDescription } from "../models/ICommandDescription";
import { CommandVerb } from "../VerbRegistry";
import config from "./../../config.json";
import i18n from "i18n";

export class JoinCommand extends Command {
	constructor() {
		super(CommandVerb.JOIN, i18n.__("description.join"));
	}

	public async execute({ member, channel }: ICommandDescription) {
		try {
			const voiceChannel = member?.voice.channel as VoiceChannel;
			PlayerLibrary.Instance().addTo(voiceChannel, () => this.goodbyeEmbed(channel, voiceChannel));
		} catch (err) {
			console.log(err);
		}
	}

	private goodbyeEmbed = (channel: TextBasedChannels, voiceChannel: VoiceChannel) => {
		if (voiceChannel.members.size > 1 && config.voiceCommunication.notifyOnLeave) {
			channel.send({ embeds: [new GoodbyeEmbed(voiceChannel)] });
		}
	};
}
