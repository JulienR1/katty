import i18n from "i18n";
import * as colors from "./../../colors.json";
import { ColorResolvable, MessageEmbed } from "discord.js";

export class BotNotConnectedEmbed extends MessageEmbed {
	constructor() {
		super();
		this.setTitle(i18n.__("notConnected.bot"));
		this.setColor(colors.errorRed as ColorResolvable);
	}
}
