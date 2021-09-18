import dotenv from "dotenv";
import i18n from "i18n";
import * as config from "./config.json";
import { BitFieldResolvable, Client, Intents, IntentsString } from "discord.js";
import { DiscordEventHandler } from "./events/DiscordEventHandler";
import path from "path/posix";

dotenv.config();

i18n.configure({
	locales: ["en", "fr"],
	directory: path.join(__dirname, "lang"),
});
i18n.setLocale(config.language);

const intents: BitFieldResolvable<IntentsString, number> = [
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.GUILD_VOICE_STATES,
];

const katty = new Client({ intents });
DiscordEventHandler.Instance().bindEvents(katty);
katty.login(process.env.DISCORD_TOKEN);
