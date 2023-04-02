import { DiscordCommand, HandleCommandParams } from "discord-command-handler";
import { SuccessEmbed } from "../embeds/SuccessEmbed";
import { respond } from "../embeds/utils/responses";
import { MusicPlayer } from "../music/MusicPlayer";

@DiscordCommand({ name: "join", description: "Summon Katty" })
export class JoinCommand {
  public async handle({ interaction, voiceChannel }: HandleCommandParams) {
    const response = await respond(interaction).acknowledge("omw!", {
      hide: true,
    });
    await MusicPlayer.fromGuild(voiceChannel.guildId).join(voiceChannel);
    await response.edit(new SuccessEmbed().setTitle("yo!"));
  }
}
