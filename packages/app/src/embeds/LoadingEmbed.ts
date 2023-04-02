import { CustomEmbedBuilder } from "./CustomEmbedBuilder";

export class LoadingEmbed extends CustomEmbedBuilder {
  public constructor() {
    super();

    this.setColor([240, 197, 43]);
    this.setTimestamp();
  }
}
