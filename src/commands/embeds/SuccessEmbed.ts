import i18n from "i18n";
import * as colors from "./../../colors.json";
import { ColorResolvable, MessageEmbed } from "discord.js";

export class SuccessEmbed extends MessageEmbed {
	constructor() {
		super();
		this.setTitle(i18n.__("success"));
		this.setColor(colors.successGreen as ColorResolvable);
	}
}
