import { createPrequelPackageIcon } from "./prequel-package.js";

export function createPrequelPackageEmojiIcon(root, options = {}) {
  const controller = createPrequelPackageIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
