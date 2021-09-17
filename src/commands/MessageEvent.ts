import { Awaited, Client, ClientEvents, Message } from "discord.js";
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

	async onEvent(message: Message): Promise<Awaited<void>> {
		console.log("TODO");
	}
}
