const EMBED_TITLE_MAX_LENGTH = 256;
const EMBED_FOOTER_MAX_LENGTH = 2048;
const EMBED_FIELD_MAX_LENGTH = 1024;
const EMBED_DESCRIPTION_LENGTH = 4096;

const trimStringToLength = (str: string, maxLength: number) => {
  const parsedStr = str.substring(0, maxLength - 3);
  if (parsedStr.length === maxLength - 3) {
    return parsedStr.concat("...");
  }
  return parsedStr;
};

export const formatTime = (seconds: number) =>
  new Date(seconds * 1000).toISOString().slice(11, 19);

export const formatOrdinalNumber = (num: number) => {
  const pr = new Intl.PluralRules("en-US", { type: "ordinal" });

  const suffixes = new Map([
    ["one", "st"],
    ["two", "nd"],
    ["few", "rd"],
    ["other", "th"],
  ]);

  const rule = pr.select(num);
  const suffix = suffixes.get(rule);
  return `${num}${suffix}`;
};

export const formatTitle = (title: string, extraCharCount = 0) => {
  const maxTitleLength = EMBED_TITLE_MAX_LENGTH - extraCharCount;
  return trimStringToLength(title, maxTitleLength);
};

export const formatDescription = (description: string, extraCharCount = 0) => {
  const maxDescriptionLength = EMBED_DESCRIPTION_LENGTH - extraCharCount;
  return trimStringToLength(description, maxDescriptionLength);
};

export const formatField = (field: string, extraCharCount = 0) => {
  const maxFieldLength = EMBED_FIELD_MAX_LENGTH - extraCharCount;
  return trimStringToLength(field, maxFieldLength);
};

export const formatFooter = (footer: string, extraCharCount = 0) => {
  const maxFooterLength = EMBED_FOOTER_MAX_LENGTH - extraCharCount;
  return trimStringToLength(footer, maxFooterLength);
};
