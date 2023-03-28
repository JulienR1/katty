import { DiscordCommand, HandleCommandParams } from "discord-command-handler";
import { MusicPlayer } from "../music/MusicPlayer";
import { acknowledge, refuse } from "../responses";

@DiscordCommand({ name: "pause", description: "Stop playing the current song" })
export class PauseCommand {
  public async handle({ interaction, voiceChannel }: HandleCommandParams) {
    if (!voiceChannel) {
      return await refuse(interaction, "bot-not-connected");
    }

    await acknowledge(interaction);
    await MusicPlayer.fromGuild(voiceChannel.guildId).togglePause();
  }
}
