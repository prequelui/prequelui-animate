import { createPrequelWebhookIcon } from "./prequel-webhook.js";

export function createPrequelWebhookSolidIcon(root, options = {}) {
  const controller = createPrequelWebhookIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
