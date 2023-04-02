import { DiscordCommand, HandleCommandParams } from "discord-command-handler";
import { SuccessEmbed } from "../embeds/SuccessEmbed";
import { formatDescription } from "../embeds/utils/formatters";
import { respond } from "../embeds/utils/responses";
import { MusicPlayer } from "../music/MusicPlayer";

@DiscordCommand({
  name: "queue",
  description: "Get the current tracks in the playlist.",
  extra: (builder) =>
    builder.addIntegerOption((option) =>
      option.setName("page").setDescription("The page to render").setMinValue(1)
    ),
})
export class QueueCommand {
  public async handle({ interaction, voiceChannel }: HandleCommandParams) {
    const response = await respond(interaction).acknowledge("Coming up!");
    const tracks = MusicPlayer.fromGuild(
      voiceChannel.guildId
    ).playlist.getAll();

    const pageSize = 10;
    const pageCount = Math.ceil(tracks.length / pageSize);
    const page = Math.min(
      interaction.options.getInteger("page") ?? 1,
      pageCount
    );

    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(page * pageSize, tracks.length);
    const tracksToRender = tracks.slice(startIndex, endIndex);

    await response.edit(
      new SuccessEmbed()
        .setTitle("Queue")
        .setDescription(
          formatDescription(
            tracksToRender.map((track) => `- ${track.info.title}\n`).join(", ")
          )
        )
        .setFooter({ text: "lol jvais le mettre clean un jour" })
    );
  }
}
