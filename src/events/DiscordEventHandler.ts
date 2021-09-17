import { Client } from "discord.js";
import { DiscordEvent } from "./DiscordEvent";
import { MessageEvent } from "./MessageEvent";
import { ReadyEvent } from "./ReadyEvent";

const commands: DiscordEvent[] = [new ReadyEvent(), new MessageEvent()];

export class DiscordEventHandler {
	private static instance: DiscordEventHandler | undefined = undefined;

	private constructor() {}

	public static Instance(): DiscordEventHandler {
		if (DiscordEventHandler.instance === undefined) {
			DiscordEventHandler.instance = new DiscordEventHandler();
		}
		return DiscordEventHandler.instance;
	}

	public bindEvents(katty: Client) {
		commands.forEach((command) => {
			command.setKatty(katty);
		});
	}
}
