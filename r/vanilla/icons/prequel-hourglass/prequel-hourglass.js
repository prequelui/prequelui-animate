import { bindPrequelIcon, renderIcon } from "./prequel-icon-core.js";

export const spec = {"slug":"hourglass","name":"Hourglass","category":"Time","parts":[{"tag":"path","attrs":{"d":"M6 2h12M6 22h12"}},{"tag":"path","attrs":{"d":"M8 2v3c0 2.4 4 4.2 4 7s-4 4.6-4 7v3"}},{"tag":"path","attrs":{"d":"M16 2v3c0 2.4-4 4.2-4 7s4 4.6 4 7v3"}}],"roles":["primary","primary","primary"],"closed":[false,false,false],"draw":[false,false,false],"inside":[false,false,false],"hasClosed":false,"highlight":null,"palette":{"color":{"primary":"oklch(0.68 0.14 75)","primaryDark":"oklch(0.82 0.11 75)","accent":"oklch(0.62 0.16 40)","accentDark":"oklch(0.76 0.13 40)"},"emoji":{"primary":"oklch(0.82 0.16 85)","secondary":"oklch(0.66 0.15 80)","accent":"oklch(0.72 0.19 48)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"rotate":0},"animate":{"rotate":[0,8,0],"transition":{"duration":0.5,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.06,1],"transition":{"duration":0.55,"ease":"easeInOut"}}},"p2":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.06,1],"transition":{"duration":0.55,"ease":"easeInOut"}}}},"tap":{"group":{"initial":{"rotate":0},"animate":{"rotate":[0,180,360],"transition":{"duration":0.9,"ease":[0.22,1,0.36,1]}}},"p0":{},"p1":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.4,1],"scale":[1,1.14,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p2":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.4,1],"scale":[1,1.14,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}}},"loop":{"group":{"initial":{"rotate":0},"animate":{"rotate":[0,180,360],"transition":{"duration":2.2,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.05,1],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p2":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.05,1],"transition":{"duration":1.5,"ease":"easeInOut"}}}}},"component":"PrequelHourglassIcon"};

export const meta = {"slug":"hourglass","name":"Hourglass","category":"Time","component":"PrequelHourglassIcon","style":"outline"};

export function createPrequelHourglassIcon(root, options = {}) {
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
