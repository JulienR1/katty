import { VoiceChannel } from "discord.js";
import { IPlayerLibrary } from "./IPlayerLibrary";
import { IMusicPlayer, MusicPlayer } from "../MusicPlayer";
import config from "./../../config.json";

interface IRegisteredPlayer {
	player: IMusicPlayer;
	timeout: NodeJS.Timeout;
}

export class PlayerLibrary implements IPlayerLibrary {
	private static instance: IPlayerLibrary | undefined = undefined;

	private players: { [key: string]: IRegisteredPlayer };

	constructor() {
		this.players = {};
	}

	public static Instance() {
		if (PlayerLibrary.instance === undefined) {
			PlayerLibrary.instance = new PlayerLibrary();
		}
		return PlayerLibrary.instance;
	}

	public addTo(voiceChannel: VoiceChannel): IMusicPlayer {
		if (this.getFrom(voiceChannel)) {
			throw new Error("The provided channel already has a music player.");
		}

		const player = new MusicPlayer();
		const timeout = this.generateTimeout(voiceChannel);
		this.players[this.getKeyFrom(voiceChannel)] = { player, timeout };

		return player;
	}

	public getFrom(voiceChannel: VoiceChannel): IMusicPlayer | undefined {
		const { player } = this.players[this.getKeyFrom(voiceChannel)];
		if (player) {
			this.refreshExitTimer(voiceChannel);
			return player;
		}
		return undefined;
	}

	public removeFrom(voiceChannel: VoiceChannel): void {
		if (!this.getFrom(voiceChannel)) {
			throw new Error("Cannot remove an unexisting player.");
		}

		clearTimeout(this.players[this.getKeyFrom(voiceChannel)].timeout);
		delete this.players[this.getKeyFrom(voiceChannel)];
	}

	private getKeyFrom(voiceChannel: VoiceChannel): string {
		return `${voiceChannel.guildId}-${voiceChannel.id}`;
	}

	private refreshExitTimer(voiceChannel: VoiceChannel) {
		clearTimeout(this.players[this.getKeyFrom(voiceChannel)].timeout);
		this.players[this.getKeyFrom(voiceChannel)].timeout = this.generateTimeout(voiceChannel);
	}

	private generateTimeout(voiceChannel: VoiceChannel): NodeJS.Timeout {
		return setTimeout(() => this.removeFrom(voiceChannel), config.voiceCommunication.maxIdleTime);
	}
}
