import dotenv from "dotenv";
import { Client, Intents } from "discord.js";

dotenv.config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on("ready", () => {
	console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("messageCreate", (message) => {
	console.log(message);
});

client.login(process.env.DISCORD_TOKEN);
