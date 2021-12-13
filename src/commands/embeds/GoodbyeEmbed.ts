import i18n from "i18n";
import { VoiceChannel } from "discord.js";
import { SuccessEmbed } from ".";

export class GoodbyeEmbed extends SuccessEmbed {
	constructor(voiceChannel: VoiceChannel) {
		super();
		this.setTitle(i18n.__("goodbye.title"));
		this.setDescription(this.getDescription(voiceChannel));
	}

	private getDescription(voiceChannel: VoiceChannel): string {
		return voiceChannel.members
			.map((member) => {
				if (member.user.bot) {
					return undefined;
				}
				return i18n.__("goodbye.message", { username: member.nickname || "" });
			})
			.filter((val) => val)
			.join("\n");
	}
}
