import { CommandVerb } from "./CommandVerb";

export interface ICommand {
	getVerb(): CommandVerb;
	execute(keywords: string[]): void;
}
