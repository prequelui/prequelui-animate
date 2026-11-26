import { createPrequelFilmIcon } from "./prequel-film.js";

export function createPrequelFilmColorIcon(root, options = {}) {
  const controller = createPrequelFilmIcon(root, { ...options, variant: "color" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "color" });
    },
  };
}
