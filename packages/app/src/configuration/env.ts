import { config } from "dotenv";
import { z } from "zod";

const envVariables = z.object({
  DISCORD_TOKEN: z.string(),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}

export const setup = () => {
  config();
  envVariables.parse(process.env);
};
