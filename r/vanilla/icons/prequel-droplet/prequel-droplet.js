import { bindPrequelIcon, renderIcon } from "./prequel-icon-core.js";

export const spec = {"slug":"droplet","name":"Droplet","category":"Nature","parts":[{"tag":"path","attrs":{"d":"M12 3s7 7.5 7 12a7 7 0 0 1-14 0c0-4.5 7-12 7-12Z"}}],"roles":["primary"],"closed":[true],"draw":[false],"inside":[false],"hasClosed":true,"highlight":{"cx":4.3,"cy":8.32,"rx":2.4,"ry":1.25},"palette":{"color":{"primary":"oklch(0.6 0.15 145)","primaryDark":"oklch(0.79 0.12 145)","accent":"oklch(0.74 0.16 95)","accentDark":"oklch(0.86 0.13 95)"},"emoji":{"primary":"oklch(0.82 0.18 130)","secondary":"oklch(0.66 0.16 130)","accent":"oklch(0.78 0.14 165)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"y":0},"animate":{"y":[0,1.5,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{"initial":{"scale":1},"animate":{"scale":[1,1.07,1],"transition":{"duration":0.5,"ease":"easeOut"}}}},"tap":{"group":{"initial":{"y":0},"animate":{"y":[0,5,0],"transition":{"duration":0.6,"ease":[0.22,1,0.36,1]}}},"p0":{"initial":{"scale":1},"animate":{"scale":[1,0.9,1.16,0.97,1],"transition":{"duration":0.65,"ease":"easeInOut"}}}},"loop":{"group":{"initial":{"y":0},"animate":{"y":[0,2.4,0],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p0":{"initial":{"scale":1},"animate":{"scale":[1,1.05,1],"transition":{"duration":1.4,"ease":"easeInOut"}}}}},"component":"PrequelDropletIcon"};

export const meta = {"slug":"droplet","name":"Droplet","category":"Nature","component":"PrequelDropletIcon","style":"outline"};

export function createPrequelDropletIcon(root, options = {}) {
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
