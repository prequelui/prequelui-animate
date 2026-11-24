import { useEffect, useRef } from "react";
import { mountPrequelBot } from "@prequelui/bot";
import type { BotConfig, PrequelBotHandle } from "../types";

export type PrequelBotProps = Partial<BotConfig> & {
  disabled?: boolean;
  onReady?: (handle: PrequelBotHandle | null) => void;
};

export function PrequelBot(props: PrequelBotProps) {
  const handle = useRef<PrequelBotHandle | null>(null);
  const config = useRef(props);

  useEffect(() => {
    if (props.disabled) return;
    if (typeof process !== "undefined" && process.env?.NODE_ENV === "production") return;
    handle.current = mountPrequelBot(document.body, { ...config.current, framework: props.framework ?? "react" });
    props.onReady?.(handle.current);
    return () => {
      handle.current?.destroy();
      handle.current = null;
      props.onReady?.(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export default PrequelBot;
