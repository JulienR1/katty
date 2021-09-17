import dotenv from "dotenv";
import { BitFieldResolvable, Client, Intents, IntentsString } from "discord.js";
import { DiscordEventHandler } from "./events/DiscordEventHandler";
import { CommandHandler } from "./commands/CommandHandler";

dotenv.config();

const intents: BitFieldResolvable<IntentsString, number> = [
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.GUILD_VOICE_STATES,
];

const katty = new Client({ intents });
DiscordEventHandler.Instance().bindEvents(katty);
katty.login(process.env.DISCORD_TOKEN);
