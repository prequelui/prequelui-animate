import { mountFromScript } from "./index";

const script = document.currentScript as HTMLScriptElement | null;
mountFromScript(script);
