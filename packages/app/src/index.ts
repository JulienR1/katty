import "./commands";

import {
  getCommandHandler,
  getSlashCommands,
  postSlashCommands,
} from "discord-command-handler";
import { Client, GuildMember } from "discord.js";
import { env, i18n } from "./configuration";

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
  if (interaction.isCommand() && interaction.isRepliable()) {
    const voiceChannel =
      interaction.member instanceof GuildMember
        ? interaction.member.voice.channel
        : null;

    const handle = getCommandHandler(interaction.commandName);
    handle({ interaction, voiceChannel });
  }
});

client.on("error", (err) => {
  console.error(err);
});

client.login(process.env.DISCORD_TOKEN);
