import { DiscordCommand, HandleCommandParams } from "discord-command-handler";
import { MusicPlayer } from "../music/MusicPlayer";
import { acknowledge, refuse } from "../responses";

@DiscordCommand({
  name: "loop",
  description: "Replay the current song in a loop",
})
export class LoopCommand {
  public async handle({ interaction, voiceChannel }: HandleCommandParams) {
    if (!voiceChannel) {
      return await refuse(interaction, "bot-not-connected");
    }

    await acknowledge(interaction);
    await MusicPlayer.fromGuild(voiceChannel.guildId).toggleLoop();
  }
}
