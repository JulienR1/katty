import { EmbedFieldData, TextBasedChannels, VoiceChannel } from "discord.js";
import i18n from "i18n";
import * as config from "./../../config.json";
import { IMusicPlayer } from "../../music/MusicPlayer";
import { Command } from "../Command";
import { ICommandDescription } from "../models/ICommandDescription";
import { CommandVerb } from "../VerbRegistry";
import { PlayerLibrary } from "../../music/PlayerLibrary";
import { YoutubeTrackFactory } from "../../music/Track/Factories";
import { BotNotConnectedEmbed, SuccessEmbed } from "../embeds";

export class QueueCommand extends Command {
	constructor() {
		super(CommandVerb.QUEUE, i18n.__("description.queue"));
	}

	public async execute({ member, channel }: ICommandDescription): Promise<void> {
		const musicPlayer = PlayerLibrary.Instance().getFrom(member?.voice.channel as VoiceChannel);
		if (!musicPlayer) {
			channel.send({ embeds: [new BotNotConnectedEmbed()] });
			return;
		}

		const queue = musicPlayer.getQueue();
		if (queue.length === 0) {
			return this.onEmptyQueue(channel, musicPlayer);
		}

		const songsEmbed: EmbedFieldData[] = queue.map((track, index) => ({
			name: index.toString(),
			value: `[${track.title}](${track.url})`,
			inline: true,
		}));

		const queueEmbed = new SuccessEmbed();
		queueEmbed.setTitle(i18n.__("queue.title"));
		queueEmbed.setThumbnail(queue[0].thumbnailURL || "");
		queueEmbed.addField(i18n.__("queue.now"), songsEmbed[0].value, false);
		queueEmbed.addFields(songsEmbed.splice(1, config.songsToDisplayInQueue));
		queueEmbed.setFooter(i18n.__("queue.nextNSongs", { songCount: config.songsToDisplayInQueue.toString() }));

		channel.send({ embeds: [queueEmbed] });
	}

	private async onEmptyQueue(channel: TextBasedChannels, musicPlayer: IMusicPlayer) {
		channel.send({ embeds: [new SuccessEmbed().setTitle(i18n.__("queue.empty"))] });

		const cricketTrack = await new YoutubeTrackFactory().from("https://www.youtube.com/watch?v=RktX4lbe_g4");
		musicPlayer.enqueue(cricketTrack);
	}
}
