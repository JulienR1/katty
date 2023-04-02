import { DiscordCommand, HandleCommandParams } from "discord-command-handler";
import { MusicPlayer } from "../music/MusicPlayer";
import { acknowledge } from "../responses";

@DiscordCommand({ name: "pause", description: "Stop playing the current song" })
export class PauseCommand {
  public async handle({ interaction, voiceChannel }: HandleCommandParams) {
    await acknowledge(interaction);
    await MusicPlayer.fromGuild(voiceChannel.guildId).togglePause();
  }
}
