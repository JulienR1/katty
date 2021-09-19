import { EmbedFieldData, GuildMember, TextBasedChannels, VoiceChannel } from "discord.js";
import i18n from "i18n";
import * as config from "./../../config.json";
import { MusicPlayer } from "../../music/MusicPlayer";
import { Track } from "../../music/Track";
import { Command } from "../Command";
import { SuccessEmbed } from "../embeds/SuccessEmbed";
import { ICommandDescription } from "../models/ICommandDescription";
import { CommandVerb } from "../VerbRegistry";

export class QueueCommand extends Command {
	constructor() {
		super(CommandVerb.QUEUE);
	}

	public async execute({ member, channel }: ICommandDescription): Promise<void> {
		const queue = MusicPlayer.Instance().queue();
		if (queue.length === 0) {
			return this.onEmptyQueue(member, channel);
		}

		const songsEmbed: EmbedFieldData[] = queue.map((track, index) => ({
			name: index.toString(),
			value: `[${track.title}](${track.url})`,
			inline: true,
		}));

		const queueEmbed = new SuccessEmbed();
		queueEmbed.setTitle(i18n.__("queue.title"));
		queueEmbed.setThumbnail(queue[0].thumbnailURL || "");
		queueEmbed.addField("Now", songsEmbed[0].value, false);
		queueEmbed.addFields(songsEmbed.splice(1, config.songsToDisplayInQueue));
		queueEmbed.setFooter(i18n.__("queue.nextNSongs", { songCount: config.songsToDisplayInQueue.toString() }));

		channel.send({ embeds: [queueEmbed] });
	}

	private async onEmptyQueue(member: GuildMember | null, channel: TextBasedChannels) {
		channel.send({ embeds: [new SuccessEmbed().setTitle(i18n.__("queue.empty"))] });

		const cricketTrack = await new Track().fromURL("https://www.youtube.com/watch?v=RktX4lbe_g4");
		MusicPlayer.Instance().enqueue(member?.voice.channel as VoiceChannel, cricketTrack);
	}
}
