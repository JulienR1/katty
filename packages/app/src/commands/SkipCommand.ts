import { DiscordCommand, HandleCommandParams } from "discord-command-handler";
import { MusicPlayer } from "../music/MusicPlayer";
import { acknowledge, refuse } from "../responses";

@DiscordCommand({
  name: "skip",
  description: "Skip to the next song",
})
export class SkipCommand {
  public async handle({ interaction, voiceChannel }: HandleCommandParams) {
    if (!voiceChannel) {
      return await refuse(interaction, "bot-not-connected");
    }

    await acknowledge(interaction);
    const musicPlayer = await MusicPlayer.fromGuild(voiceChannel.guildId);
    musicPlayer.toggleLoop(false);
    musicPlayer.selectNextTrack();
    await musicPlayer.playTrack(true);
  }
}
