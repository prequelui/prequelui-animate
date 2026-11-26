import { bindPrequelIcon, renderIcon } from "./prequel-icon-core.js";

export const spec = {"slug":"phone","name":"Phone","category":"Communication","parts":[{"tag":"path","attrs":{"d":"M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5L17 13l4 1.5v3a2.5 2.5 0 0 1-2.8 2.5A17 17 0 0 1 4 6.8 2.5 2.5 0 0 1 6.5 3Z"}},{"tag":"path","attrs":{"d":"M15 3a6 6 0 0 1 6 6"}}],"roles":["primary","primary"],"closed":[true,false],"draw":[false,false],"inside":[false,true],"hasClosed":true,"highlight":{"cx":3.5,"cy":3.5,"rx":2.4,"ry":1.25},"palette":{"color":{"primary":"oklch(0.56 0.1 225)","primaryDark":"oklch(0.78 0.08 225)","accent":"oklch(0.66 0.13 200)","accentDark":"oklch(0.8 0.1 200)"},"emoji":{"primary":"oklch(0.74 0.13 232)","secondary":"oklch(0.58 0.13 232)","accent":"oklch(0.82 0.16 85)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"rotate":0},"animate":{"rotate":[0,-6,5,-3,0],"transition":{"duration":0.6,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.06,1],"transition":{"duration":0.55,"ease":"easeInOut"}}}},"tap":{"group":{"initial":{"rotate":0},"animate":{"rotate":[0,-14,12,-8,4,0],"transition":{"duration":0.95,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.4,1],"scale":[1,1.14,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}}},"loop":{"group":{"initial":{"rotate":0},"animate":{"rotate":[0,-4,4,0],"transition":{"duration":1.6,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.05,1],"transition":{"duration":1.5,"ease":"easeInOut"}}}}},"component":"PrequelPhoneIcon"};

export const meta = {"slug":"phone","name":"Phone","category":"Communication","component":"PrequelPhoneIcon","style":"outline"};

export function createPrequelPhoneIcon(root, options = {}) {
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
