import dotenv from "dotenv";
import { Client, Intents, VoiceChannel, Message } from "discord.js";
import {
	AudioPlayerStatus,
	createAudioPlayer,
	entersState,
	joinVoiceChannel,
	VoiceConnectionStatus,
} from "@discordjs/voice";
import { createDiscordJSAdapter } from "./adapter";
import { downloadMusic } from "./youtube";

dotenv.config();

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
});
const musicPlayer = createAudioPlayer();

const playSong = async () => {
	const resource = await downloadMusic();
	if (resource) {
		musicPlayer.play(resource);
	} else {
		console.log("No resource to play.");
	}
	return entersState(musicPlayer, AudioPlayerStatus.Playing, 5e3);
};

const connectToChannel = async (channel: VoiceChannel) => {
	const connection = joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: createDiscordJSAdapter(channel),
	});

	try {
		await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
		return connection;
	} catch (err) {
		connection.destroy();
		throw err;
	}
};

client.on("ready", () => {
	console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("messageCreate", async (message: Message) => {
	if (message.author.bot) {
		return;
	}

	console.log("Received message: " + message.content);

	const channel = message.member?.voice.channel;
	if (channel) {
		try {
			const connection = await connectToChannel(channel as VoiceChannel);
			connection.subscribe(musicPlayer);
			await playSong();
		} catch (err) {
			console.error(err);
		}
	} else {
		message.reply("You need to be connected to summon Katty.");
	}
});

client.login(process.env.DISCORD_TOKEN);
