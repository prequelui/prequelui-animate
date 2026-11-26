import { bindLinearScene, renderLinearScene } from "../linear-core.js";

export const svg = "<svg viewBox=\"0 0 400 320\" width=\"100%\" height=\"100%\" fill=\"none\" preserveAspectRatio=\"xMidYMid meet\" aria-hidden=\"true\"><g data-linear-block=\"tip\" data-linear-index=\"1\"><path d=\"M258.64 98.76L259.68 97.16L261.65 95.8L270.78 91.24L273.5 90.25L276.7 89.73L280.06 89.73L283.26 90.25L285.98 91.24L295.1 95.8L297.08 97.16L298.12 98.76L298.12 122.79L297.08 124.39L295.1 125.75L285.98 130.31L283.26 131.3L280.06 131.82L276.7 131.82L273.5 131.3L270.78 130.31L261.65 125.75L259.68 124.39L258.64 122.79Z\" fill=\"var(--ls-plate)\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-edge)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M298.12 100.44L297.08 102.04L295.1 103.4L285.98 107.97L283.26 108.95L280.06 109.47L276.7 109.47L273.5 108.95L270.78 107.97L261.65 103.4L259.68 102.04L258.64 100.44\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-lo)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M282.71 92.88L291.83 97.44L292.96 98.21L293.55 99.12L293.55 100.08L292.96 101L291.83 101.77L282.71 106.33L281.16 106.89L279.34 107.19L277.42 107.19L275.6 106.89L274.05 106.33L264.92 101.77L263.8 101L263.2 100.08L263.2 99.12L263.8 98.21L264.92 97.44L274.05 92.88L275.6 92.31L277.42 92.02L279.34 92.02L281.16 92.31L282.71 92.88Z\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-mid)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><ellipse cx=\"278.38\" cy=\"99.6\" rx=\"8.6\" ry=\"4.3\" stroke=\"none\" fill=\"var(--ls-hi)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /></g><g data-linear-block=\"star\" data-linear-index=\"0\"><path d=\"M94.98 167.18L154.65 108.63L284.46 118.91L305.02 183.81L305.02 202.43L187.92 232.27L94.98 185.8Z\" fill=\"var(--ls-plate)\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-edge)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M284.46 118.91\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-lo)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M281.19 120.54L249.68 154.93L300.9 182.76L225.76 178.41L188.64 211.36L173.71 174.28L99.55 166.82L165.46 148.26L156.75 110.69L212.42 136.3Z\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-mid)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M229.73 146.27L220.35 157.25L236.06 166.24L212.28 165.18L200.02 175.42L194.7 163.79L171.43 161.12L191.92 155L189.79 143.11L207.77 150.96Z\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-hi)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /></g></svg>";

export const meta = {
  "slug": "star",
  "name": "Star",
  "family": "Effects",
  "collection": "Interface",
  "component": "createLinearStar"
};

export function createLinearStar(root, options = {}) {
  let current = { ...options };
  const render = () => {
    root.innerHTML = renderLinearScene(svg, current);
  };
  render();
  const controller = bindLinearScene(root, current);
  return {
    replay: controller.replay,
    destroy: controller.destroy,
    update(next = {}) {
      current = { ...current, ...next };
      render();
    },
  };
}
