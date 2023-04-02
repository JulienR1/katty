import { CustomEmbedBuilder } from "./CustomEmbedBuilder";

export class SuccessEmbed extends CustomEmbedBuilder {
  public constructor() {
    super();

    this.setColor([75, 181, 67]);
    this.setTimestamp();
  }
}
