import { VoiceBasedChannel } from "discord.js";
import config from "../config.json";
import { MusicPlayer } from "./MusicPlayer";

interface IRegisteredPlayer {
  player: MusicPlayer;
  timeout: NodeJS.Timeout;
  onLeave: () => void;
}

export class PlayerLibrary {
  private static instance: PlayerLibrary | undefined = undefined;

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

  public addTo(
    voiceChannel: VoiceBasedChannel,
    onLeave: () => void
  ): Promise<MusicPlayer> {
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
    this.players[key] = { player, timeout, onLeave };

    return player.join(voiceChannel);
  }

  public getFrom(voiceChannel: VoiceBasedChannel): MusicPlayer | undefined {
    const registeredPlayer = this.players[this.getKeyFrom(voiceChannel)];
    if (registeredPlayer) {
      this.refreshExitTimer(voiceChannel);
      return registeredPlayer.player;
    }
    return undefined;
  }

  public removeFrom(voiceChannel: VoiceBasedChannel): void {
    if (!this.getFrom(voiceChannel)) {
      throw new Error("Cannot remove an unexisting player.");
    }

    const key = this.getKeyFrom(voiceChannel);
    this.players[key].player.leave();
    this.players[key].onLeave();

    clearTimeout(this.players[key].timeout);
    delete this.players[key];
  }

  private getKeyFrom(voiceChannel: VoiceBasedChannel): string {
    return `${voiceChannel.guildId}-${voiceChannel.id}`;
  }

  private refreshExitTimer(voiceChannel: VoiceBasedChannel) {
    clearTimeout(this.players[this.getKeyFrom(voiceChannel)].timeout);
    this.players[this.getKeyFrom(voiceChannel)].timeout =
      this.generateTimeout(voiceChannel);
  }

  private generateTimeout(voiceChannel: VoiceBasedChannel): NodeJS.Timeout {
    return setTimeout(() => {
      const subscribedPlayer = this.players[this.getKeyFrom(voiceChannel)];
      if (
        subscribedPlayer?.player.isVoiceConnected(voiceChannel) &&
        subscribedPlayer.player.getQueue().length > 0
      ) {
        subscribedPlayer.timeout = this.generateTimeout(voiceChannel);
      } else {
        this.removeFrom(voiceChannel);
      }
    }, config.voiceCommunication.maxIdleTime);
  }
}
