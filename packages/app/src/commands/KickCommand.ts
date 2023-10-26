import { DiscordCommand, HandleCommandParams } from "discord-command-handler";
import { SuccessEmbed } from "../embeds/SuccessEmbed";
import { respond } from "../embeds/utils/responses";
import { MusicPlayer } from "../music/MusicPlayer";

@DiscordCommand({ name: "kick", description: "Kick Katty" })
export class KickCommand {
  public async handle({ interaction, voiceChannel }: HandleCommandParams) {
    const response = await respond(interaction).acknowledge("ok bye :(", {
      hide: true,
    });
    MusicPlayer.fromGuild(voiceChannel.guildId).leave();
    await response.edit(new SuccessEmbed().setTitle("ciao for now!"));
  }
}
