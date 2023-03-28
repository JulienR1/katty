import "./commands";

import {
  getCommandHandler,
  getSlashCommands,
  postSlashCommands,
} from "discord-command-handler";
import { Client, GuildMember } from "discord.js";
import { env, i18n } from "./configuration";
import { MusicPlayer } from "./music/MusicPlayer";

env.setup();
i18n.setup();

const client = new Client({
  intents: ["Guilds", "GuildVoiceStates", "GuildMessages"],
});

client.on("ready", async (e) => {
  if (e.application.id === undefined) {
    throw new Error("Could not find application id.");
  }

  const commands = getSlashCommands();
  const guilds = await client.guilds.fetch();
  const guildIds = guilds.map((guild) => guild.id);

  await postSlashCommands(
    commands,
    guildIds,
    e.application.id,
    process.env.DISCORD_TOKEN
  );

  console.log(`Logged in as ${client?.user?.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  const handle = getCommandHandler(interaction);

  if (handle) {
    const voiceChannel =
      interaction.member instanceof GuildMember
        ? interaction.member.voice.channel
        : null;

    handle({ voiceChannel });
  } else {
    console.log(
      "Could not find a command associated with this interaction.",
      interaction.toString()
    );
  }
});

client.on("voiceStateUpdate", async (oldState) => {
  if (oldState.channelId) {
    const channel = await client.channels.fetch(oldState.channelId);
    if (channel?.isVoiceBased()) {
      const members = channel.members.filter((member) => !member.user.bot);
      if (members.size === 0) {
        MusicPlayer.fromGuild(oldState.guild.id).leave();
      }
    }
  }
});

client.on("error", (err) => {
  console.error(err);
});

client.login(process.env.DISCORD_TOKEN);
