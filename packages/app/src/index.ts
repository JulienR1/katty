import "./commands";

import { getAutocomplete, getCommandHandler, getSlashCommands } from "discord-command-handler";
import { CacheType, ChatInputCommandInteraction, Client, GuildMember, Interaction } from "discord.js";
import { setup } from "./configuration/env";
import { respond } from "./embeds/utils/responses";
import { MusicPlayer } from "./music/MusicPlayer";
import { MockInteraction } from "./utils/MockInteraction";

setup();

const client = new Client({
  intents: ["Guilds", "GuildVoiceStates", "GuildMessages", "MessageContent"],
});

client.on("ready", async (e) => {
  getSlashCommands();
  console.log(`Logged in as ${client?.user?.tag}`);
});

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith("!")) {
    return;
  }

  const command = message.content.slice(1);
  if (command.startsWith("play ")) {
    const content = command.slice(5);

    await message.author.send(`Mauvaise commande! Utilise \`/play ${content}\``);
    handleInteraction(new MockInteraction("play", message.member, content, message) as any);
  } else if (command.startsWith("reload ")) {
    const content = command.slice(7);
    handleInteraction(new MockInteraction("reload", message.member, content, message) as any);
  }
});

client.on("interactionCreate", handleInteraction);

async function handleInteraction(interaction: Interaction<CacheType>) {
  if (interaction.isButton()) {
    return;
  }

  const handle = getCommandHandler(interaction);
  const autocomplete = getAutocomplete(interaction);

  try {
    if (autocomplete) {
      autocomplete();
    } else if (handle) {
      const voiceChannel = interaction.member instanceof GuildMember ? interaction.member.voice.channel : null;

      if (voiceChannel) {
        handle({ voiceChannel });
      } else {
        await respond(interaction as ChatInputCommandInteraction).refuse("You must be connected to a voice channel.", { hide: true });
      }
    } else {
      console.log("Could not find a command associated with this interaction.", interaction.toString());
    }
  } catch (ex) {
    console.error(ex);
  }
}

client.on("voiceStateUpdate", async (oldState) => {
  if (oldState.channelId) {
    const channel = await client.channels.fetch(oldState.channelId);
    if (channel?.isVoiceBased()) {
      if (channel.members.find((member) => member.id === client.user?.id)) {
        const members = channel.members.filter((member) => !member.user.bot);
        if (members.size === 0) {
          MusicPlayer.fromGuild(oldState.guild.id).leave();
        }
      }
    }
  }
});

client.on("error", (err) => {
  console.error(err);
});

client.login(process.env.DISCORD_TOKEN);
