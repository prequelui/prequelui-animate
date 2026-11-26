import { createPrequelUmbrellaIcon } from "./prequel-umbrella.js";

export function createPrequelUmbrellaEmojiIcon(root, options = {}) {
  const controller = createPrequelUmbrellaIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
