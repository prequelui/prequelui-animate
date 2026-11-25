import { createPrequelWebhookIcon } from "./prequel-webhook.js";

export function createPrequelWebhookEmojiIcon(root, options = {}) {
  const controller = createPrequelWebhookIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
