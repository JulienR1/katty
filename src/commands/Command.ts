import { GuildMember } from "discord.js";
import { ICommand } from "./ICommand";
import { CommandVerb } from "./VerbRegistry";

export abstract class Command implements ICommand {
	constructor(private verb: CommandVerb) {}

	public getVerb(): CommandVerb {
		return this.verb;
	}

	abstract execute(origin: GuildMember, keywords: string[]): void;
}
