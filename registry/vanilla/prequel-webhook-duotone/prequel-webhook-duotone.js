import { createPrequelWebhookIcon } from "./prequel-webhook.js";

export function createPrequelWebhookDuotoneIcon(root, options = {}) {
  const controller = createPrequelWebhookIcon(root, { ...options, variant: "duotone" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "duotone" });
    },
  };
}
