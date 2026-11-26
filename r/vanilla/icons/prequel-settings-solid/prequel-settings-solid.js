import { createPrequelSettingsIcon } from "./prequel-settings.js";

export function createPrequelSettingsSolidIcon(root, options = {}) {
  const controller = createPrequelSettingsIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
