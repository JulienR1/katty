import { GuildMember } from "discord.js";
import { CommandVerb } from "./VerbRegistry";

export interface ICommand {
	getVerb(): CommandVerb;
	execute(origin: GuildMember, keywords: string[]): void;
}
