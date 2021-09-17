import { Awaited, Client, ClientEvents } from "discord.js";
import { DiscordEvent } from "./DiscordEvent";

export class ReadyEvent extends DiscordEvent {
	public eventName: keyof ClientEvents;

	constructor() {
		super();
		this.eventName = "ready";
	}

	setKatty(katty: Client) {
		super.setKatty(katty);
		katty.on(this.eventName, () => this.onEvent());
	}

	onEvent(): Awaited<void> {
		console.log(`Logged in as ${this.katty?.user?.tag}`);
	}
}
