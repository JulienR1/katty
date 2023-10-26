import {
  AttachmentBuilder,
  BaseMessageOptions,
  EmbedBuilder,
} from "discord.js";

export class CustomEmbedBuilder extends EmbedBuilder {
  public files: AttachmentBuilder[] = [];
  public components: BaseMessageOptions["components"];
}
