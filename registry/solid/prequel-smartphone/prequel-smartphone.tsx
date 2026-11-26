// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindPrequelIcon, renderIcon } from "./prequel-icon-core";

const spec = {"slug":"smartphone","name":"Smartphone","category":"Devices","parts":[{"tag":"rect","attrs":{"x":7,"y":2,"width":10,"height":20,"rx":2}},{"tag":"path","attrs":{"d":"M11 18h2"}},{"tag":"path","attrs":{"d":"M10.5 5.5h3"}}],"roles":["primary","primary","primary"],"closed":[true,false,false],"draw":[false,false,false],"inside":[false,true,true],"hasClosed":true,"highlight":{"cx":10,"cy":7.6,"rx":1.6,"ry":0.83},"palette":{"color":{"primary":"oklch(0.6 0.13 265)","primaryDark":"oklch(0.78 0.1 265)","accent":"oklch(0.7 0.15 285)","accentDark":"oklch(0.82 0.12 285)"},"emoji":{"primary":"oklch(0.74 0.13 232)","secondary":"oklch(0.58 0.13 232)","accent":"oklch(0.6 0.2 300)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{},"p1":{},"p2":{}},"tap":{"group":{"initial":{"y":0},"animate":{"y":[0,-6,0],"transition":{"duration":0.5,"ease":[0.22,1,0.36,1]}}},"p0":{},"p1":{},"p2":{}},"loop":{"group":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p0":{},"p1":{},"p2":{}}},"component":"PrequelSmartphoneIcon"};

export function PrequelSmartphoneIcon(props) {
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
