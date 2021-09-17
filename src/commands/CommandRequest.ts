import { GuildMember } from "discord.js";
import * as config from "../config.json";
import { CommandVerb, VerbRegistry } from "./VerbRegistry";

export class CommandRequest {
	public origin: GuildMember | undefined = undefined;
	public verb: CommandVerb = CommandVerb.NONE;
	public keywords: string[] = [];

	constructor(member: GuildMember | null, content: string) {
		const slicedContent = this.removePrefix(content);
		this.getCommandContent(slicedContent);
		this.setOrigin(member);
	}

	private setOrigin(member: GuildMember | null) {
		if (member) {
			this.origin = member;
		} else {
			throw new Error("No member was provided.");
		}
	}

	private removePrefix(content: string): string {
		if (!this.hasPrefix(content)) {
			throw new Error("The requested prefix was not found.");
		}
		return content.slice(config.commandPrefix.length);
	}

	private hasPrefix(content: string): boolean {
		return content.startsWith(config.commandPrefix);
	}

	private getCommandContent(content: string): void {
		const tempKeywords = content.split(" ");
		this.verb = this.getVerb(tempKeywords.shift());
		this.keywords = tempKeywords;
	}

	private getVerb(dirtyVerb: string | undefined): CommandVerb {
		if (dirtyVerb) {
			const lowerVerb = dirtyVerb?.toLowerCase();
			return Object.keys(VerbRegistry).find((key) =>
				VerbRegistry[key as CommandVerb]?.includes(lowerVerb)
			) as CommandVerb;
		}
		return CommandVerb.NONE;
	}
}
