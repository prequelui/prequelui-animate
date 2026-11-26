// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindPrequelIcon, renderIcon } from "./prequel-icon-core";

const spec = {"slug":"bike","name":"Bike","category":"Travel","parts":[{"tag":"circle","attrs":{"cx":6,"cy":17,"r":3.5}},{"tag":"circle","attrs":{"cx":18,"cy":17,"r":3.5}},{"tag":"path","attrs":{"d":"M6 17l4-6h4l4 6"}},{"tag":"path","attrs":{"d":"M10 11h3a1 1 0 0 1 0 2h-3"}},{"tag":"path","attrs":{"d":"M9.5 11l2 6"}}],"roles":["primary","accent","primary","primary","primary"],"closed":[true,true,false,false,false],"draw":[false,false,false,false,false],"inside":[false,false,false,false,false],"hasClosed":true,"highlight":{"cx":4.6,"cy":15.46,"rx":1.12,"ry":0.7},"palette":{"color":{"primary":"oklch(0.56 0.1 225)","primaryDark":"oklch(0.78 0.08 225)","accent":"oklch(0.66 0.13 200)","accentDark":"oklch(0.8 0.1 200)"},"emoji":{"primary":"oklch(0.74 0.13 232)","secondary":"oklch(0.58 0.13 232)","accent":"oklch(0.82 0.16 85)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"x":0},"animate":{"x":[0,1.5,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{},"p1":{},"p2":{"initial":{"rotate":0,"transformOrigin":"11px 15px"},"animate":{"rotate":[0,25,0],"transition":{"duration":0.55,"ease":"easeInOut"},"transformOrigin":"11px 15px"}},"p3":{},"p4":{}},"tap":{"group":{"initial":{"x":0},"animate":{"x":[0,5,0],"transition":{"duration":0.6,"ease":[0.22,1,0.36,1]}}},"p0":{},"p1":{},"p2":{"initial":{"rotate":0,"transformOrigin":"11px 15px"},"animate":{"rotate":[0,360],"transition":{"duration":0.85,"ease":[0.22,1,0.36,1]},"transformOrigin":"11px 15px"}},"p3":{},"p4":{}},"loop":{"group":{"initial":{"x":0},"animate":{"x":[0,2.4,0],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p0":{},"p1":{},"p2":{"initial":{"rotate":0,"transformOrigin":"11px 15px"},"animate":{"rotate":[0,360],"transition":{"duration":1.8,"ease":"easeInOut"},"transformOrigin":"11px 15px"}},"p3":{},"p4":{}}},"component":"PrequelBikeIcon"};

export function PrequelBikeIcon(props) {
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
