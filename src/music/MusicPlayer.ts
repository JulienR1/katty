import {
	AudioPlayer,
	AudioPlayerStatus,
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
import { CommandVerb } from "../commands/VerbRegistry";

export class MusicPlayer implements IMusicPlayer {
	private static instance: MusicPlayer | undefined;
	private trackQueue: Track[] = [];

	private connection: VoiceConnection | undefined = undefined;
	private player: AudioPlayer;

	private currentChannelId = "-1";

	private songEndErrorListeners: { [key in CommandVerb]?: () => void } = {};

	private constructor() {
		this.player = createAudioPlayer();
		this.player.on("stateChange", (oldState, newState) => {
			if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
				try {
					this.onSongFinished();
				} catch (err) {
					Object.values(this.songEndErrorListeners).forEach((callback) => {
						callback();
					});
				}
			}
		});
	}

	public static Instance(): MusicPlayer {
		if (MusicPlayer.instance === undefined) {
			MusicPlayer.instance = new MusicPlayer();
		}
		return MusicPlayer.instance;
	}

	private async onSongFinished() {
		this.trackQueue.shift();
		await this.playSong();
	}

	private async playSong() {
		if (this.trackQueue.length === 0) {
			throw new Error("No songs to play.");
		}

		const currentTrack = this.trackQueue[0];
		// const resource = createAudioResource(currentTrack.getStream());
		const resource = await currentTrack.getStream();
		this.player.play(resource);
	}

	public async join(channel: VoiceChannel) {
		if (!channel) {
			throw new Error("No valid channel to connect to.");
		}

		if (this.connection) {
			if (this.currentChannelId === channel.id) {
				const invalidStates = [VoiceConnectionStatus.Disconnected, VoiceConnectionStatus.Destroyed];
				if (!invalidStates.includes(this.connection.state.status)) {
					return;
				}
			}
		}

		const connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			adapterCreator: createDiscordJSAdapter(channel),
		});

		try {
			await entersState(connection, VoiceConnectionStatus.Ready, config.voiceCommunication.maxLoadTime);
			connection.subscribe(this.player);
			this.currentChannelId = channel.id;
			this.connection = connection;
		} catch (err) {
			connection.destroy();
			throw err;
		}
	}

	public async leave() {
		this.connection?.disconnect();
		this.currentChannelId = "-1";
	}

	public async enqueue(channel: VoiceChannel, track: Track) {
		await this.join(channel);
		this.trackQueue.push(track);
		await this.play();
	}

	public async play() {
		if (this.player.state.status === AudioPlayerStatus.Playing) {
			return;
		}
		if (this.player.state.status === AudioPlayerStatus.Paused) {
			this.resume();
		} else {
			await this.playSong();
		}
	}

	public next() {
		if (this.player.state.status === AudioPlayerStatus.Playing) {
			this.player.stop();
		} else {
			throw new Error("No songs to skip to.");
		}
	}

	public stop() {
		if (this.player.state.status === AudioPlayerStatus.Playing) {
			this.player.pause();
		}
	}

	public resume() {
		if (this.player.state.status === AudioPlayerStatus.Paused) {
			this.player.unpause();
		}
	}

	public queue(): Track[] {
		return JSON.parse(JSON.stringify(this.trackQueue));
	}

	public bindToSongEndErrors(verb: CommandVerb, callback: () => void) {
		this.songEndErrorListeners[verb] = callback;
	}
}
