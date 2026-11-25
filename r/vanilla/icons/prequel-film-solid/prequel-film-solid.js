import { createPrequelFilmIcon } from "./prequel-film.js";

export function createPrequelFilmSolidIcon(root, options = {}) {
  const controller = createPrequelFilmIcon(root, { ...options, variant: "solid" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "solid" });
    },
  };
}
