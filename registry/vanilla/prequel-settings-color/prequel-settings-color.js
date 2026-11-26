import { createPrequelSettingsIcon } from "./prequel-settings.js";

export function createPrequelSettingsColorIcon(root, options = {}) {
  const controller = createPrequelSettingsIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
