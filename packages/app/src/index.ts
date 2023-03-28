import "./commands";

import { getCommandHandler, getSlashCommands } from "discord-command-handler";
import { Client, GuildMember } from "discord.js";
import { setup } from "./configuration/env";
import { MusicPlayer } from "./music/MusicPlayer";

setup();

const client = new Client({
  intents: ["Guilds", "GuildVoiceStates", "GuildMessages"],
});

client.on("ready", async (e) => {
  getSlashCommands();
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
