import { bindPrequelIcon, renderIcon } from "./prequel-icon-core.js";

export const spec = {"slug":"trending-up","name":"Trending Up","category":"Charts","parts":[{"tag":"polyline","attrs":{"points":"3 17 9 11 13 15 21 7"}},{"tag":"polyline","attrs":{"points":"15 7 21 7 21 13"}}],"roles":["primary","primary"],"closed":[false,false],"draw":[true,false],"inside":[false,false],"hasClosed":false,"highlight":null,"palette":{"color":{"primary":"oklch(0.6 0.16 290)","primaryDark":"oklch(0.78 0.13 290)","accent":"oklch(0.7 0.15 310)","accentDark":"oklch(0.82 0.12 310)"},"emoji":{"primary":"oklch(0.6 0.2 300)","secondary":"oklch(0.46 0.18 300)","accent":"oklch(0.68 0.2 27)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"x":0},"animate":{"x":[0,1.5,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{"initial":{"pathLength":1,"opacity":1},"animate":{"pathLength":[0,1],"opacity":[0.35,1],"transition":{"duration":0.65,"ease":"easeInOut"}}},"p1":{"initial":{"y":0},"animate":{"y":[0,-1.5,0],"transition":{"duration":0.45,"ease":"easeOut"}}}},"tap":{"group":{"initial":{"x":0},"animate":{"x":[0,5,0],"transition":{"duration":0.6,"ease":[0.22,1,0.36,1]}}},"p0":{"initial":{"pathLength":1,"opacity":1},"animate":{"pathLength":[0,1],"opacity":[0.35,1],"transition":{"duration":0.8,"ease":"easeInOut"}}},"p1":{"initial":{"y":0},"animate":{"y":[0,-4,0],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}}},"loop":{"group":{"initial":{"x":0},"animate":{"x":[0,2.4,0],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p0":{"initial":{"pathLength":1,"opacity":1},"animate":{"pathLength":[1,0.15,1],"opacity":[1,0.6,1],"transition":{"duration":1.7,"ease":"easeInOut"}}},"p1":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":1.4,"ease":"easeInOut"}}}}},"component":"PrequelTrendingUpIcon"};

export const meta = {"slug":"trending-up","name":"Trending Up","category":"Charts","component":"PrequelTrendingUpIcon","style":"outline"};

export function createPrequelTrendingUpIcon(root, options = {}) {
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
