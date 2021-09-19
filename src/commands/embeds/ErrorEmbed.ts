import i18n from "i18n";
import * as colors from "./../../colors.json";
import { ColorResolvable, MessageEmbed } from "discord.js";

export class ErrorEmbed extends MessageEmbed {
	constructor() {
		super();
		this.setTitle(i18n.__("error"));
		this.setColor(colors.errorRed as ColorResolvable);
	}
}
