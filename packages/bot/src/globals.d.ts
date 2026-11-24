import type { PrequelBotHandle } from "./types";

declare global {
  const process:
    | { env?: { NODE_ENV?: string; [key: string]: string | undefined } }
    | undefined;

  interface Window {
    __PREQUEL_BOT__?: PrequelBotHandle;
    __PREQUEL_BOT_DISABLED__?: "host" | "flag" | "prod";
    __PREQUEL_FRAMEWORK__?: string;
    prequelBot?: PrequelBotHandle;
  }
}

export {};
