import { Client, Intents } from "discord.js";
import dotenv from "dotenv";
import { bindCommands } from "./events/DiscordEventHandler";

dotenv.config();

const katty = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
});

bindCommands(katty);

katty.login(process.env.DISCORD_TOKEN);
