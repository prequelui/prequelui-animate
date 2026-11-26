import { createPrequelSnowflakeIcon } from "./prequel-snowflake.js";

export function createPrequelSnowflakeColorIcon(root, options = {}) {
  const controller = createPrequelSnowflakeIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
