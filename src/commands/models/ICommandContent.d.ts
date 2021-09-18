import { GuildMember, TextBasedChannels } from "discord.js";

export interface ICommandContent {
	channel: TextBasedChannels;
	member: GuildMember | null;
	content: string;
}
