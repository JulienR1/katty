import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  DiscordGatewayAdapterCreator,
  entersState,
  getVoiceConnection,
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { BaseGuild, VoiceBasedChannel } from "discord.js";
import { err, ok, Result } from "../types/Result";
import { Playlist } from "./Playlist";

type GuildId = BaseGuild["id"];

const musicPlayerRegistry: Record<GuildId, MusicPlayer> = {};
export class MusicPlayer {
  public playlist: Playlist;

  private audioPlayer: AudioPlayer;
  private guildId: GuildId;
  private looping: boolean;

  private inactivityTimeout: NodeJS.Timeout | null = null;

  private constructor(guildId: GuildId) {
    this.audioPlayer = createAudioPlayer();
    this.playlist = new Playlist();
    this.guildId = guildId;
    this.looping = false;

    this.audioPlayer.on<"stateChange">(
      "stateChange",
      async ({ status: oldStatus }, { status: newStatus }) => {
        if (
          oldStatus !== AudioPlayerStatus.Idle &&
          newStatus === AudioPlayerStatus.Idle
        ) {
          this.selectNextTrack();
          const foundTrack = await this.playTrack();
          this.inactivityTimeout = setTimeout(this.leave, 5 * 60 * 1000);
        }

        if (newStatus !== AudioPlayerStatus.Idle) {
          if (this.inactivityTimeout) {
            clearTimeout(this.inactivityTimeout);
          }
          this.inactivityTimeout = null;
        }
      }
    );
  }

  public static fromGuild(guildId: GuildId) {
    if (musicPlayerRegistry[guildId]) {
      return musicPlayerRegistry[guildId];
    }

    const musicPlayer = new MusicPlayer(guildId);
    musicPlayerRegistry[guildId] = musicPlayer;
    return musicPlayer;
  }

  public async join(
    channel: VoiceBasedChannel
  ): Promise<Result<VoiceConnection>> {
    const connection = joinVoiceChannel({
      guildId: this.guildId,
      channelId: channel.id,
      adapterCreator: channel.guild
        .voiceAdapterCreator as DiscordGatewayAdapterCreator,
    });

    const networkChangeStateHandler = (_: any, newState: any) => {
      const newUdp = Reflect.get(newState, "udp");
      clearInterval(newUdp?.keepAliveInterval);
    };

    connection.on<"stateChange">("stateChange", (oldState, newState) => {
      const oldNetworking = Reflect.get(oldState, "networking");
      const newNetworking = Reflect.get(newState, "networking");

      oldNetworking?.off("stateChange", networkChangeStateHandler);
      newNetworking?.on("stateChange", networkChangeStateHandler);
      if (
        oldState.status === VoiceConnectionStatus.Ready &&
        newState.status === VoiceConnectionStatus.Connecting
      ) {
        connection.configureNetworking();
      }
    });

    try {
      await entersState(connection, VoiceConnectionStatus.Ready, 10000);
      connection.subscribe(this.audioPlayer);
      return ok(connection);
    } catch (e) {
      connection.destroy();
      return err(typeof e === "string" ? e : "Unknown error");
    }
  }

  public async playTrack() {
    const track = this.playlist.at(0);

    if (track.isOk()) {
      const audio = await track.value.getAudioResource();
      this.audioPlayer.play(audio);
    }
  }

  public selectNextTrack() {
    if (!this.looping) {
      this.playlist.remove(0);
    }
  }

  public seek(timestamp: number) {
    // TODO
  }

  public togglePause(): boolean {
    if (this.audioPlayer.state.status === AudioPlayerStatus.Paused) {
      this.audioPlayer.unpause();
      return false;
    } else {
      this.audioPlayer.pause();
      return true;
    }
  }

  public toggleLoop(looping = this.looping): boolean {
    this.looping = !looping;
    return this.looping;
  }

  public leave() {
    this.audioPlayer.stop();
    getVoiceConnection(this.guildId)?.destroy();
    delete musicPlayerRegistry[this.guildId];
  }
}
