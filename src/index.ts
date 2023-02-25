import { BitFieldResolvable, Client, Intents, IntentsString } from "discord.js";
import { getCommandHandler, getSlashCommands } from "./commands";
import { env, i18n, postSlashCommands } from "./configuration";

env.setup();
i18n.setup();

const intents: BitFieldResolvable<IntentsString, number> = [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_VOICE_STATES,
];

const client = new Client({ intents });

client.on("ready", async (e) => {
  if (e.application.id === undefined) {
    throw new Error("Could not find application id.");
  }

  const commands = getSlashCommands();
  const guilds = await client.guilds.fetch();
  const guildIds = guilds.map((guild) => guild.id);

  await postSlashCommands(commands, guildIds, e.application.id);

  console.log(`Logged in as ${client?.user?.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    const handle = getCommandHandler(interaction.commandName);
    handle(interaction);
  }
});

client.on("error", (err) => {
  console.error(err);
});

client.login(process.env.DISCORD_TOKEN);
