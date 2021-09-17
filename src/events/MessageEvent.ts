import { Awaited, Client, ClientEvents, Message } from "discord.js";
import { Command } from "../commands/Command";
import { CommandHandler } from "../commands/CommandHandler";
import { DiscordEvent } from "./DiscordEvent";

export class MessageEvent extends DiscordEvent {
	public eventName: keyof ClientEvents;

	constructor() {
		super();
		this.eventName = "messageCreate";
	}

	setKatty(katty: Client) {
		super.setKatty(katty);
		katty.on<string>(this.eventName, async (message: Message) => this.onEvent(message));
	}

	async onEvent({ content, author }: Message): Promise<Awaited<void>> {
		if (author.bot) {
			return;
		}

		try {
			const command = new Command(content);
			CommandHandler.Instance().executeCommand(command);
		} catch (err) {}
	}
}
