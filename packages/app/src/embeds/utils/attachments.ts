import { AttachmentBuilder } from "discord.js";

type ImageAttachment = [AttachmentBuilder, string];

const makeAttachment = (filename: string): ImageAttachment => [
  new AttachmentBuilder(`./assets/${filename}`),
  `attachment://${filename}`,
];

export const LostTravolta = () => makeAttachment("lost_travolta.gif");
export const Skull = () => makeAttachment("skull.png");
