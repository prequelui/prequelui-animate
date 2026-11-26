// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindPrequelIcon, renderIcon } from "./prequel-icon-core";

const spec = {"slug":"car","name":"Car","category":"Travel","parts":[{"tag":"path","attrs":{"d":"M5 16l1.5-6.5A2 2 0 0 1 8.4 8h7.2a2 2 0 0 1 1.9 1.5L19 16"}},{"tag":"rect","attrs":{"x":3,"y":15,"width":18,"height":3.5,"rx":1.5}},{"tag":"circle","attrs":{"cx":7.5,"cy":19.5,"r":1.7}},{"tag":"circle","attrs":{"cx":16.5,"cy":19.5,"r":1.7}},{"tag":"path","attrs":{"d":"M8 12h8"}}],"roles":["primary","primary","accent","accent","primary"],"closed":[false,true,true,true,false],"draw":[false,false,false,false,false],"inside":[false,false,false,false,false],"hasClosed":true,"highlight":{"cx":8.4,"cy":15.98,"rx":1.1,"ry":0.7},"palette":{"color":{"primary":"oklch(0.56 0.1 225)","primaryDark":"oklch(0.78 0.08 225)","accent":"oklch(0.66 0.13 200)","accentDark":"oklch(0.8 0.1 200)"},"emoji":{"primary":"oklch(0.74 0.13 232)","secondary":"oklch(0.58 0.13 232)","accent":"oklch(0.82 0.16 85)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{},"p1":{},"p2":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p3":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p4":{}},"tap":{"group":{"initial":{"y":0},"animate":{"y":[0,-6,0],"transition":{"duration":0.5,"ease":[0.22,1,0.36,1]}}},"p0":{},"p1":{},"p2":{"initial":{"y":0},"animate":{"y":[0,-4,0],"transition":{"duration":0.5,"ease":[0.22,1,0.36,1]}}},"p3":{"initial":{"y":0},"animate":{"y":[0,-4,0],"transition":{"duration":0.5,"ease":[0.22,1,0.36,1]}}},"p4":{}},"loop":{"group":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p0":{},"p1":{},"p2":{"initial":{"y":0},"animate":{"y":[0,-1.5,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p3":{"initial":{"y":0},"animate":{"y":[0,-1.5,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p4":{}}},"component":"PrequelCarIcon"};

export function PrequelCarIcon(props) {
  let host;

  const view = () =>
    renderIcon(spec, {
      size: props.size ?? 28,
      variant: props.variant ?? "outline",
      weight: props.weight ?? "regular",
      className: props.class ?? "",
      label: props.label ?? "",
    });

  onMount(() => {
    const controller = bindPrequelIcon(host, spec, () => ({
      speed: props.speed ?? 1,
      tempo: props.tempo ?? 1,
      delay: props.delay ?? 0,
      loop: props.loop ?? false,
      animate: props.animate ?? false,
      animateOnHover: props.animateOnHover ?? true,
      animateOnTap: props.animateOnTap ?? true,
      animateOnView: props.animateOnView ?? false,
      animateOnViewOnce: props.animateOnViewOnce ?? true,
      animation: props.animation ?? "hover",
    }));
    onCleanup(() => controller.destroy());
  });

  return (
    <span
      ref={host}
      data-slot="prequel-icon-host"
      style={{ display: "contents" }}
      innerHTML={view()}
    />
  );
}
