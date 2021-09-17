import { CommandVerb } from "./CommandVerb";

export interface Command {
	getVerb(): CommandVerb;
	execute(keywords: string[]): void;
}
