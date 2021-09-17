import * as config from "../config.json";
import { CommandVerb } from "./CommandVerb";
import { VerbRegistry } from "./VerbRegistry";

export class CommandRequest {
	public verb: CommandVerb = CommandVerb.NONE;
	public keywords: string[] = [];

	constructor(content: string) {
		const slicedContent = this.removePrefix(content);
		this.getCommandContent(slicedContent);
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
