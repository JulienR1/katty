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

	public addTo(voiceChannel: VoiceChannel): Promise<IMusicPlayer> {
		if (this.getFrom(voiceChannel)?.isVoiceConnected(voiceChannel)) {
			throw new Error("The provided channel already has a music player.");
		}

		const key = this.getKeyFrom(voiceChannel);
		if (this.players[key]) {
			// If a player returns to a previous server before its cd is over.
			clearTimeout(this.players[key].timeout);
		}

		const player = new MusicPlayer(voiceChannel);
		const timeout = this.generateTimeout(voiceChannel);
		this.players[key] = { player, timeout };

		return player.join(voiceChannel);
	}

	public getFrom(voiceChannel: VoiceChannel): IMusicPlayer | undefined {
		const registeredPlayer = this.players[this.getKeyFrom(voiceChannel)];
		if (registeredPlayer) {
			this.refreshExitTimer(voiceChannel);
			return registeredPlayer.player;
		}
		return undefined;
	}

	public removeFrom(voiceChannel: VoiceChannel): void {
		if (!this.getFrom(voiceChannel)) {
			throw new Error("Cannot remove an unexisting player.");
		}

		const key = this.getKeyFrom(voiceChannel);
		this.players[key].player.leave();

		clearTimeout(this.players[key].timeout);
		delete this.players[key];
	}

	private getKeyFrom(voiceChannel: VoiceChannel): string {
		return `${voiceChannel.guildId}-${voiceChannel.id}`;
	}

	private refreshExitTimer(voiceChannel: VoiceChannel) {
		clearTimeout(this.players[this.getKeyFrom(voiceChannel)].timeout);
		this.players[this.getKeyFrom(voiceChannel)].timeout = this.generateTimeout(voiceChannel);
	}

	private generateTimeout(voiceChannel: VoiceChannel): NodeJS.Timeout {
		return setTimeout(() => {
			const subscribedPlayer = this.players[this.getKeyFrom(voiceChannel)];
			if (subscribedPlayer?.player.isVoiceConnected(voiceChannel) && subscribedPlayer.player.getQueue().length > 0) {
				subscribedPlayer.timeout = this.generateTimeout(voiceChannel);
			} else {
				this.removeFrom(voiceChannel);
			}
		}, config.voiceCommunication.maxIdleTime);
	}
}
