import { DiscordCommand, HandleCommandParams } from "discord-command-handler";
import { MusicPlayer } from "../music/MusicPlayer";
import { acknowledge, refuse } from "../responses";

@DiscordCommand({ name: "kick", description: "Kick Katty" })
export class KickCommand {
  public async handle({ interaction, voiceChannel }: HandleCommandParams) {
    if (!voiceChannel) {
      return await refuse(interaction, "bot-not-connected");
    }

    await acknowledge(interaction);
    MusicPlayer.fromGuild(voiceChannel.guildId).leave();
  }
}
