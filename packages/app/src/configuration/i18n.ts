import i18n from "i18n";
import path from "path";
import * as config from "../config.json";

export const setup = () => {
  i18n.configure({
    locales: ["en", "fr"],
    defaultLocale: "en",
    directory: path.join(__dirname, "lang"),
    objectNotation: true,
  });
  i18n.setLocale(config.language);
};
