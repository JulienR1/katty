import { DiscordCommand, HandleCommandParams } from "discord-command-handler";
import { AutocompleteInteraction } from "discord.js";
import { MusicPlayer } from "../music/MusicPlayer";
import { acknowledge, refuse } from "../responses";

@DiscordCommand({
  name: "move",
  description: "Change the playlist order",
  extra: (builder) =>
    builder
      .addStringOption((option) =>
        option
          .setName("track")
          .setDescription("The track to move in the playlist")
          .setRequired(true)
          .setAutocomplete(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("position")
          .setDescription("The target position in the playlist")
          .setRequired(true)
          .setMinValue(1)
      ),
})
export class MoveCommand {
  public async autocomplete(interaction: AutocompleteInteraction) {
    if (!interaction.guildId) {
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

    const musicPlayer = await MusicPlayer.fromGuild(voiceChannel.guildId);
    const trackCount = musicPlayer.playlist.getAll().length;

    const track = interaction.options.getString("track", true);
    const position = interaction.options.getInteger("position", true);

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
