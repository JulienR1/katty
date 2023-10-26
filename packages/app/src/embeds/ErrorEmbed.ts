import { CustomEmbedBuilder } from "./CustomEmbedBuilder";
import { Skull } from "./utils/attachments";

export class ErrorEmbed extends CustomEmbedBuilder {
  public constructor() {
    super();

    const [skull, skulUrl] = Skull();
    this.setColor([219, 41, 29]);
    this.setThumbnail(skulUrl);

    this.files.push(skull);
  }
}
