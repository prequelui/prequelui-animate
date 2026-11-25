import { createPrequelFilmIcon } from "./prequel-film.js";

export function createPrequelFilmEmojiIcon(root, options = {}) {
  const controller = createPrequelFilmIcon(root, { ...options, variant: "emoji" });
  return {
    ...controller,
    update(next = {}) {
      controller.update({ ...next, variant: "emoji" });
    },
  };
}
