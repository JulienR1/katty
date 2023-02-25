import { VoiceBasedChannel, VoiceChannel } from "discord.js";
import { IMusicPlayer } from "../MusicPlayer/IMusicPlayer";

export interface IPlayerLibrary {
  addTo(
    voiceChannel: VoiceChannel | VoiceBasedChannel,
    onLeave: () => void
  ): Promise<IMusicPlayer>;
  getFrom(
    voiceChannel: VoiceChannel | VoiceBasedChannel
  ): IMusicPlayer | undefined;
  removeFrom(voiceChannel: VoiceChannel | VoiceBasedChannel): void;
}
