import * as config from "../config.json";
import { ICommandContent } from "./models/ICommandContent";
import { ICommandDescription } from "./models/ICommandDescription";
import { CommandVerb, VerbRegistry } from "./VerbRegistry";

export class CommandRequest {
	public verb: CommandVerb;
	public description: ICommandDescription;

	constructor(commandContent: ICommandContent) {
		const bareTextContent = this.removePrefix(commandContent.content);
		const splitTextContent = bareTextContent.split(" ");

		this.verb = this.getVerb(splitTextContent.shift());
		this.description = {
			channel: commandContent.channel,
			member: commandContent.member,
			keywords: splitTextContent,
		};
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
