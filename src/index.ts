import dotenv from "dotenv";
import { Client, Intents, VoiceChannel } from "discord.js";
import {
	AudioPlayerStatus,
	createAudioPlayer,
	createAudioResource,
	entersState,
	joinVoiceChannel,
	StreamType,
	VoiceConnectionStatus,
} from "@discordjs/voice";
import { createDiscordJSAdapter } from "./adapter";

dotenv.config();

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
});
const musicPlayer = createAudioPlayer();

const playSong = () => {
	const resource = createAudioResource("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", {
		inputType: StreamType.Arbitrary,
	});
	musicPlayer.play(resource);
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

client.on("messageCreate", async (message) => {
	if (message.author.bot) {
		return;
	}

	await message.reply("Trying to play a recording now.");

	const channel = message.member?.voice.channel;
	if (channel) {
		try {
			const connection = await connectToChannel(channel as VoiceChannel);
			connection.subscribe(musicPlayer);
			await playSong();
			await message.reply("Go!");
		} catch (err) {
			console.error(err);
		}
	} else {
		message.reply("You need to be connected to summon Katty.");
	}
});

client.login(process.env.DISCORD_TOKEN);
