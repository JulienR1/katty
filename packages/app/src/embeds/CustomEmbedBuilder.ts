import { AttachmentBuilder, EmbedBuilder } from "discord.js";

export class CustomEmbedBuilder extends EmbedBuilder {
  public files: AttachmentBuilder[] = [];
}
