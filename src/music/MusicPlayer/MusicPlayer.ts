import { AudioPlayer, AudioPlayerState, AudioPlayerStatus, createAudioPlayer, entersState, joinVoiceChannel, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";
import { VoiceChannel } from "discord.js";
import { IMusicPlayer } from ".";
import { createDiscordJSAdapter } from "../../voiceAdapter/JsAdapter";
import { ITrack, ITrackData } from "../Track";
import config from "./../../config.json";

export class MusicPlayer implements IMusicPlayer {
  private audioPlayer: AudioPlayer;
  private voiceChannel: VoiceChannel;
  private voiceConnection: VoiceConnection | undefined = undefined;

  private playlist: ITrack[];
  private isLooping = false;

  constructor(initialVoiceChannel: VoiceChannel) {
    this.playlist = [];
    this.voiceChannel = initialVoiceChannel;

    this.audioPlayer = createAudioPlayer();
    this.audioPlayer.on("stateChange", (oldState, newState) => this.onPlayerStateChange(oldState, newState));
  }

  private onPlayerStateChange(oldState: AudioPlayerState, newState: AudioPlayerState) {
    if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
      if (!this.isLooping) {
        this.playlist.shift();
      }
      this.triggerTrack();
    }
  }

  private async triggerTrack() {
    if (this.audioPlayer.state.status !== AudioPlayerStatus.Idle) {
      return;
    }

    if (this.playlist.length === 0) {
      return;
    }

    const trackResource = await this.playlist[0].getAudioResource();
    this.audioPlayer.play(trackResource);
  }

  public isVoiceConnected(voiceChannel: VoiceChannel): boolean {
    if (voiceChannel?.id !== this.voiceConnection?.joinConfig.channelId) {
      return false;
    }

    const disconnectedStatuses = [VoiceConnectionStatus.Disconnected, VoiceConnectionStatus.Destroyed];
    return !disconnectedStatuses.includes(this.voiceConnection.state.status);
  }

  public getIsLooping(): boolean {
    return this.isLooping;
  }

  public async join(channel: VoiceChannel): Promise<IMusicPlayer> {
    if (!channel) {
      throw new Error("No channel to connect to.");
    }

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: createDiscordJSAdapter(channel),
    });

    try {
      await entersState(connection, VoiceConnectionStatus.Ready, config.voiceCommunication.maxLoadTime);
      connection.subscribe(this.audioPlayer);
      this.voiceConnection = connection;
    } catch (err) {
      connection.destroy();
      throw err;
    }

    return this;
  }

  public leave(): void {
    if (this.voiceConnection?.joinConfig.channelId === this.voiceChannel.id) {
      this.voiceConnection?.disconnect();
    }
  }

  public enqueue(tracks: ITrack[]): IMusicPlayer {
    this.playlist.push(...tracks);
    this.triggerTrack();
    return this;
  }

  public togglePause(isPausing: boolean): IMusicPlayer {
    isPausing ? this.audioPlayer.pause() : this.audioPlayer.unpause();
    return this;
  }

  public toggleLoop(): IMusicPlayer {
    this.isLooping = !this.isLooping;
    return this;
  }

  public next(): IMusicPlayer {
    if (this.audioPlayer.state.status === AudioPlayerStatus.Playing) {
      this.audioPlayer.stop();
    }
    return this;
  }

  public shuffle(): IMusicPlayer {
    for (let i = 1; i < this.playlist.length - 1; i++) {
      const j = Math.floor(Math.random() * (this.playlist.length - i) + i);
      const tempTrack = this.playlist[i];
      this.playlist[i] = this.playlist[j];
      this.playlist[j] = tempTrack;
    }
    return this;
  }

  public clear(): IMusicPlayer {
    this.playlist.length = 1;
    return this;
  }

  public move(trackIndex: number, targetIndex: number): IMusicPlayer {
    if (this.playlist && this.playlist.length > trackIndex && this.playlist.length > targetIndex && trackIndex > 0 && targetIndex > 0 && targetIndex !== trackIndex) {
      const targetTrack = this.playlist[targetIndex];
      this.playlist[targetIndex] = this.playlist[trackIndex];
      this.playlist[trackIndex] = targetTrack;
    } else {
      throw new Error("Invalid parameters in move.");
    }
    return this;
  }

  public remove(trackIndex: number): IMusicPlayer {
    if (this.playlist && trackIndex > 0 && trackIndex < this.playlist.length) {
      this.playlist.splice(trackIndex, 1);
    } else {
      throw new Error("Invalid parameters in remove.");
    }
    return this;
  }

  public seek(timestamp: string): IMusicPlayer {
    // TODO
    return this;
  }

  public getQueue(): ITrackData[] {
    const playlistData = this.playlist.map((track) => track.getData());
    return JSON.parse(JSON.stringify(playlistData));
  }
}
