import { bindPrequelIcon, renderIcon } from "./prequel-icon-core.js";

export const spec = {"slug":"trash","name":"Trash","category":"Files","parts":[{"tag":"path","attrs":{"d":"M4 6h16"}},{"tag":"path","attrs":{"d":"M8 6V4h8v2"}},{"tag":"path","attrs":{"d":"M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14"}},{"tag":"path","attrs":{"d":"M10 11v6M14 11v6"}}],"roles":["primary","primary","primary","primary"],"closed":[false,false,false,false],"draw":[false,false,false,false],"inside":[false,false,false,false],"hasClosed":false,"highlight":null,"palette":{"color":{"primary":"oklch(0.62 0.13 230)","primaryDark":"oklch(0.8 0.1 230)","accent":"oklch(0.7 0.14 205)","accentDark":"oklch(0.82 0.11 205)"},"emoji":{"primary":"oklch(0.74 0.13 232)","secondary":"oklch(0.58 0.13 232)","accent":"oklch(0.78 0.14 165)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"rotate":0},"animate":{"rotate":[0,-5,4,-2,0],"transition":{"duration":0.5,"ease":"easeInOut"}}},"p0":{},"p1":{},"p2":{},"p3":{"initial":{"x":0},"animate":{"x":[0,-2.5,2.5,-1.5,0],"transition":{"duration":0.5,"ease":"easeInOut"}}}},"tap":{"group":{"initial":{"rotate":0},"animate":{"rotate":[0,-11,10,-6,3,0],"transition":{"duration":0.8,"ease":"easeInOut"}}},"p0":{},"p1":{},"p2":{},"p3":{"initial":{"x":0},"animate":{"x":[0,-4,4,-3,2,0],"transition":{"duration":0.75,"ease":"easeInOut"}}}},"loop":{"group":{"initial":{"rotate":0},"animate":{"rotate":[0,-3,3,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p0":{},"p1":{},"p2":{},"p3":{"initial":{"x":0},"animate":{"x":[0,-2,2,0],"transition":{"duration":1.4,"ease":"easeInOut"}}}}},"component":"PrequelTrashIcon"};

export const meta = {"slug":"trash","name":"Trash","category":"Files","component":"PrequelTrashIcon","style":"outline"};

export function createPrequelTrashIcon(root, options = {}) {
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
