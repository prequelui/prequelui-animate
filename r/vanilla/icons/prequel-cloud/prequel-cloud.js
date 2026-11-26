import { bindPrequelIcon, renderIcon } from "./prequel-icon-core.js";

export const spec = {"slug":"cloud","name":"Cloud","category":"Weather","parts":[{"tag":"path","attrs":{"d":"M6.5 18h11a3.5 3.5 0 0 0 .4-7 5.5 5.5 0 0 0-10.6-1.6A4.25 4.25 0 0 0 6.5 18Z"}}],"roles":["primary"],"closed":[true],"draw":[false],"inside":[false],"hasClosed":true,"highlight":{"cx":7.68,"cy":9.04,"rx":2.4,"ry":1.25},"palette":{"color":{"primary":"oklch(0.62 0.14 235)","primaryDark":"oklch(0.79 0.11 235)","accent":"oklch(0.74 0.16 85)","accentDark":"oklch(0.85 0.13 85)"},"emoji":{"primary":"oklch(0.74 0.13 232)","secondary":"oklch(0.58 0.13 232)","accent":"oklch(0.82 0.16 85)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":0.6,"ease":"easeInOut"}}},"p0":{}},"tap":{"group":{"initial":{"y":0},"animate":{"y":[0,-4,0],"transition":{"duration":0.7,"ease":[0.22,1,0.36,1]}}},"p0":{}},"loop":{"group":{"initial":{"y":0},"animate":{"y":[0,-2.5,0],"transition":{"duration":1.8,"ease":"easeInOut"}}},"p0":{}}},"component":"PrequelCloudIcon"};

export const meta = {"slug":"cloud","name":"Cloud","category":"Weather","component":"PrequelCloudIcon","style":"outline"};

export function createPrequelCloudIcon(root, options = {}) {
  let current = { ...options };
  const render = () => {
    root.innerHTML = renderIcon(spec, current);
  };
  render();
  const controller = bindPrequelIcon(root, spec, () => current);
  return {
    play: controller.play,
    reset: controller.reset,
    destroy: controller.destroy,
    update(next = {}) {
      current = { ...current, ...next };
      render();
    },
    get observed() {
      return controller.observed;
    },
  };
}
