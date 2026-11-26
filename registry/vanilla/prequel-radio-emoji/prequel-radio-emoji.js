import { createPrequelRadioIcon } from "./prequel-radio.js";

export function createPrequelRadioEmojiIcon(root, options = {}) {
  const controller = createPrequelRadioIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
