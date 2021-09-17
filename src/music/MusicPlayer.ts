import {
	AudioPlayer,
	createAudioPlayer,
	createAudioResource,
	entersState,
	joinVoiceChannel,
	VoiceConnection,
	VoiceConnectionStatus,
} from "@discordjs/voice";
import { VoiceChannel } from "discord.js";
import { createDiscordJSAdapter } from "../voiceAdapter/JsAdapter";
import { IMusicPlayer } from "./IMusicPlayer";
import { Track } from "./Track";
import * as config from "./../config.json";

export class MusicPlayer implements IMusicPlayer {
	private static instance: MusicPlayer | undefined;
	private trackQueue: Track[] = [];

	private connection: VoiceConnection | undefined = undefined;
	private player: AudioPlayer;

	private constructor() {
		this.player = createAudioPlayer();
	}

	public static Instance(): MusicPlayer {
		if (MusicPlayer.instance === undefined) {
			MusicPlayer.instance = new MusicPlayer();
		}
		return MusicPlayer.instance;
	}

	public async joinChannel(channel: VoiceChannel) {
		if (!channel) {
			throw new Error("No valid channel to connect to.");
		}

		if (this.connection) {
			if (![VoiceConnectionStatus.Disconnected, VoiceConnectionStatus.Destroyed].includes(this.connection.state.status))
				return;
		}

		const connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			adapterCreator: createDiscordJSAdapter(channel),
		});

		try {
			await entersState(connection, VoiceConnectionStatus.Ready, config.voiceCommunication.maxLoadTime);
			connection.subscribe(this.player);
			this.connection = connection;
		} catch (err) {
			connection.destroy();
			throw err;
		}
	}

	public async enqueue(channel: VoiceChannel, track: Track) {
		await this.joinChannel(channel);
		console.log("Adding track to the queue: ", track);
		this.trackQueue.push(track);

		const res = createAudioResource(track.getStream());
		this.player.play(res);
	}
}
