import { TextBasedChannels } from "discord.js";
import { CommandVerb } from "../VerbRegistry";

export interface ICommandDescription {
	keywords: string[];
	channel: TextBasedChannels;
	member: GuildMember | null;
}
