import { defineComponent, onBeforeUnmount, onMounted } from "vue";
import { mountPrequelBot } from "@prequelui/bot";
import type { BotConfig, Framework, PrequelBotHandle } from "../types";

export const PrequelBot = defineComponent({
  name: "PrequelBot",
  props: {
    framework: { type: String as () => Framework, default: "vue" },
    position: { type: String as () => BotConfig["position"], default: "br" },
    size: { type: Number, default: 64 },
    label: { type: String, default: "PrequelUI Bot" },
    showLabel: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    allowHosts: { type: Array as () => string[], default: () => [] },
  },
  setup(props) {
    let handle: PrequelBotHandle | null = null;
    onMounted(() => {
      if (props.disabled) return;
      const env = (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env;
      if (env && env.DEV === false) return;
      handle = mountPrequelBot(document.body, {
        framework: props.framework,
        position: props.position,
        size: props.size,
        label: props.label,
        showLabel: props.showLabel,
        disabled: props.disabled,
        allowHosts: props.allowHosts,
      });
    });
    onBeforeUnmount(() => {
      handle?.destroy();
      handle = null;
    });
    return () => null;
  },
});

export default PrequelBot;
