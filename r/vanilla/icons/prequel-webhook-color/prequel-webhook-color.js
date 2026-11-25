import { createPrequelWebhookIcon } from "./prequel-webhook.js";

export function createPrequelWebhookColorIcon(root, options = {}) {
  const controller = createPrequelWebhookIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
