import {
  createAudioPlayer,
  createAudioResource,
  entersState,
  joinVoiceChannel,
  NoSubscriberBehavior,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { DiscordCommand, HandleCommandParams } from "discord-command-handler";
import { AutocompleteInteraction } from "discord.js";
import play from "play-dl";
import { Track } from "../music/Track";
import { isPlaylist, isUrl } from "../music/utils";
import { acknowledge, refuse } from "../responses";

@DiscordCommand({
  name: "play",
  description: "Request a song to play",
  extra: (builder) =>
    builder.addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Search query")
        .setRequired(true)
        .setAutocomplete(true)
    ),
})
export class PlayCommand {
  public async autocomplete(interaction: AutocompleteInteraction) {
    const query = interaction.options.getFocused();

    if (!isUrl(query)) {
      const videos = await play.search(query, { limit: 5 });
      const options = videos.map((video) => ({
        value: video.url,
        name: video.title ?? "Unknown title",
      }));

      await interaction.respond(options);
      return;
    }

    if (isPlaylist(query)) {
      const playlist = await play.playlist_info(query);
      const option = {
        value: playlist.url!,
        name: playlist.title ?? "Unknown playlist",
      };

      await interaction.respond([option]);
      return;
    }

    const { video_details } = await play.video_basic_info(query);
    const option = {
      value: video_details.url,
      name: video_details.title ?? "Unknown video",
    };

    await interaction.respond([option]);
    return;
  }

  public async handle({ interaction, voiceChannel }: HandleCommandParams) {
    if (!voiceChannel) {
      return await refuse(interaction, "bot-not-connected");
    }

    const editReply = await acknowledge(interaction);

    const query = interaction.options.getString("query", true);
    const url = await this.getUrlFromQuery(query);
    const tracks = await Track.make(url);

    if (tracks.length === 0) {
      return await editReply.edit("Could not find any songs. Aborting.");
    } else if (tracks.length === 1) {
      await editReply.edit(`Adding ${tracks[0].info.title} to the playlist.`);
    } else {
      await editReply.edit(`Adding ${tracks.length} songs to the playlist.`);
    }

    // const trackPromises = Object.values(factories).map((factory) =>
    //   factory.prototype.from(searchKeys)
    // );
    // const tracks = await Promise.any(trackPromises);

    // const playerLibrary = PlayerLibrary.Instance();
    // (
    //   playerLibrary.getFrom(voiceChannel) ||
    //   (await playerLibrary.addTo(voiceChannel, () => console.log("bye")))
    // ).enqueue(tracks);

    // const track = tracks.shift();
    // console.log("chose track: ", track);

    // await Track.make(searchKeys);

    // const tracks = await play.search(query);
    // const track = tracks.shift();

    // if (!track) {
    //   await editReply.edit("no track lol");
    //   return;
    // }

    const audioPlayer = createAudioPlayer({
      behaviors: { noSubscriber: NoSubscriberBehavior.Play },
    });
    // audioPlayer.on<"stateChange">("stateChange", (oldState, newState) => {
    //   console.log("Changed state: ", oldState, newState);
    // });

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator as any,
    });
    await entersState(connection, VoiceConnectionStatus.Ready, 10000);
    connection.on("error", (err) => console.log(err));
    connection.on("debug", (msg) => console.log(msg));

    const networkChangeStateHandler = (_: any, newState: any) => {
      const newUdp = Reflect.get(newState, "udp");
      clearInterval(newUdp?.keepAliveInterval);
    };

    connection.on<"stateChange">("stateChange", (oldState, newState) => {
      const oldNetworking = Reflect.get(oldState, "networking");
      const newNetworking = Reflect.get(newState, "networking");

      oldNetworking?.off("stateChange", networkChangeStateHandler);
      newNetworking?.on("stateChange", networkChangeStateHandler);
      if (
        oldState.status === VoiceConnectionStatus.Ready &&
        newState.status === VoiceConnectionStatus.Connecting
      ) {
        connection.configureNetworking();
      }
    });

    // const audio = await track.getAudioResource();
    // const info = await play.video_info(track.getData().url);
    // console.log(info);
    // const audio = await play.stream(track.getData().url);
    const audio = await play.stream(tracks[0].info.url);
    const resource = createAudioResource(audio.stream, {
      inputType: audio.type,
    });
    audio.stream.on("error", (err) => console.log(err));
    audio.stream.on("finish", () => console.log("finish"));
    audio.stream.on("end", () => console.log("end"));
    audio.stream.on("close", () => console.log("close"));

    audioPlayer.play(resource);
    connection.subscribe(audioPlayer);

    audioPlayer.on("error", (err) => console.log(err));

    await editReply.edit("started playing: " + tracks[0].info.title);
  }

  private async getUrlFromQuery(query: string) {
    if (isUrl(query)) {
      return query;
    }

    const videoUrls = await play.search(query);
    return videoUrls[0].url;
  }
}
