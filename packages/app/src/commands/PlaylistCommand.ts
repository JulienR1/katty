import { DiscordCommand, HandleCommandParams } from "discord-command-handler";
import {
  AutocompleteInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import { MusicPlayer } from "../music/MusicPlayer";
import { acknowledge, refuse } from "../responses";

const baseMoveSubcommand = (
  subcommand: SlashCommandSubcommandBuilder,
  name: string
) =>
  subcommand
    .setName(name)
    .setDescription("Move a track in the playlist")
    .addStringOption((option) =>
      option
        .setName("track")
        .setDescription("The track to move in the playlist")
        .setRequired(true)
        .setAutocomplete(true)
    );

@DiscordCommand({
  name: "playlist",
  description: "Edit the playlist",
  extra: (builder) =>
    builder
      .addSubcommand((subcommand) =>
        subcommand.setName("shuffle").setDescription("Randomize the playlist")
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("clear")
          .setDescription("Remove every track from the playlist")
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("remove")
          .setDescription("Remove a track from the playlist")
          .addStringOption((option) =>
            option
              .setName("track")
              .setDescription("The track to remove")
              .setRequired(true)
              .setAutocomplete(true)
          )
      )
      .addSubcommand((subcommand) => baseMoveSubcommand(subcommand, "promote"))
      .addSubcommand((subcommand) =>
        baseMoveSubcommand(subcommand, "move").addIntegerOption((option) =>
          option
            .setName("position")
            .setDescription("The target position in the playlist")
            .setRequired(true)
            .setMinValue(1)
        )
      ),
})
export class PlaylistCommand {
  public async autocomplete(interaction: AutocompleteInteraction) {
    if (!interaction.guildId) {
      return;
    }

    const command = interaction.options.getSubcommand(true);
    if (!["remove", "move", "promote"].includes(command)) {
      return;
    }

    const userInput = interaction.options.getFocused();
    const inputIsTitle = !/^[0-9]+$/g.test(userInput);

    if (inputIsTitle) {
      const tracks = await MusicPlayer.fromGuild(
        interaction.guildId
      ).playlist.getAll();

      tracks.shift();
      const tackOptions = tracks.map((track, i) => ({
        value: (i + 1).toString(),
        name: track.info.title,
      }));

      const potentialTracks = tackOptions.filter(
        (track) =>
          userInput.length === 0 ||
          track.name.toLowerCase().includes(userInput.toLowerCase())
      );
      const trimmedTracks = potentialTracks.slice(
        0,
        Math.min(potentialTracks.length, 25)
      );

      await interaction.respond(trimmedTracks);
      return;
    }
  }

  public async handle({ interaction, voiceChannel }: HandleCommandParams) {
    if (!voiceChannel) {
      return await refuse(interaction, "bot-not-connected");
    }

    const musicPlayer = MusicPlayer.fromGuild(voiceChannel.guildId);

    switch (interaction.options.getSubcommand(true)) {
      case "shuffle":
        return this.shuffle(interaction, musicPlayer);
      case "clear":
        return this.clear(interaction, musicPlayer);
      case "remove":
        return this.remove(interaction, musicPlayer);
      case "move":
      case "promote":
        return this.move(interaction, musicPlayer);
      default:
        await refuse(interaction, "invalid-params");
    }
  }

  private async shuffle(
    interaction: HandleCommandParams["interaction"],
    musicPlayer: MusicPlayer
  ) {
    const reply = await acknowledge(interaction);
    musicPlayer.playlist.shuffle();
    await reply.edit("Shuffled the playlist.");
  }

  private async clear(
    interaction: HandleCommandParams["interaction"],
    musicPlayer: MusicPlayer
  ) {
    const reply = await acknowledge(interaction);
    musicPlayer.playlist.clear();
    await reply.edit("Cleared the playlist.");
  }

  private async remove(
    interaction: HandleCommandParams["interaction"],
    musicPlayer: MusicPlayer
  ) {
    const track = interaction.options.getString("track", true);
    const tracks = musicPlayer.playlist.getAll();

    const trackIndex = parseInt(track);
    if (isNaN(trackIndex) || trackIndex < 1 || trackIndex >= tracks.length) {
      return await refuse(interaction, "invalid-params");
    }

    const reply = await acknowledge(interaction);
    musicPlayer.playlist.remove(trackIndex);
    await reply.edit(
      `Removed "${tracks[trackIndex].info.title}" from the playlist.`
    );
  }

  private async move(
    interaction: HandleCommandParams["interaction"],
    musicPlayer: MusicPlayer
  ) {
    const trackCount = musicPlayer.playlist.getAll().length;

    const subcommand = interaction.options.getSubcommand(true);
    const track = interaction.options.getString("track", true);
    const position =
      subcommand === "move"
        ? interaction.options.getInteger("position", true)
        : 1;

    const trackIndex = parseInt(track);
    if (
      isNaN(trackIndex) ||
      position < 1 ||
      trackIndex < 1 ||
      trackIndex >= trackCount ||
      position >= trackCount
    ) {
      return await refuse(interaction, "invalid-params");
    }

    await acknowledge(interaction);
    musicPlayer.playlist.move(trackIndex, position);
  }
}
