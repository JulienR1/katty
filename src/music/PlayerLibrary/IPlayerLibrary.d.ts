import { VoiceChannel } from "discord.js";
import { IMusicPlayer } from "../MusicPlayer/IMusicPlayer";

export interface IPlayerLibrary {
	addTo(voiceChannel: VoiceChannel): Promise<IMusicPlayer>;
	getFrom(voiceChannel: VoiceChannel): IMusicPlayer | undefined;
	removeFrom(voiceChannel: VoiceChannel): void;
}
