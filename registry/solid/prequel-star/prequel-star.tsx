// @ts-nocheck
import { onCleanup, onMount } from "solid-js";
import { bindPrequelIcon, renderIcon } from "./prequel-icon-core";

const spec = {"slug":"star","name":"Star","category":"People","parts":[{"tag":"path","attrs":{"d":"M12 3l2.7 5.6 6.3.9-4.5 4.3 1 6.2-5.5-3-5.5 3 1-6.2L3 9.5l6.3-.9L12 3Z"}}],"roles":["primary"],"closed":[true],"draw":[false],"inside":[false],"hasClosed":true,"highlight":{"cx":8.4,"cy":7.76,"rx":2.4,"ry":1.25},"palette":{"color":{"primary":"oklch(0.64 0.16 355)","primaryDark":"oklch(0.81 0.12 355)","accent":"oklch(0.72 0.14 20)","accentDark":"oklch(0.84 0.11 20)"},"emoji":{"primary":"oklch(0.68 0.2 27)","secondary":"oklch(0.54 0.19 25)","accent":"oklch(0.62 0.22 350)"}},"fill":["M12 3l2.7 5.6 6.3.9-4.5 4.3 1 6.2-5.5-3-5.5 3 1-6.2L3 9.5l6.3-.9L12 3Z"],"animations":{"hover":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.06,1],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{"initial":{"scale":1,"transformOrigin":"center"},"animate":{"scale":[1,1.07,1],"transition":{"duration":0.5,"ease":"easeOut"},"transformOrigin":"center"}},"fill":{"initial":{"opacity":0},"animate":{"opacity":[0,0.35,0],"transition":{"duration":0.6,"ease":"easeOut"}}}},"tap":{"group":{"initial":{"scale":1},"animate":{"scale":[1,0.9,1.14,0.98,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p0":{"initial":{"scale":1,"transformOrigin":"center"},"animate":{"scale":[1,0.9,1.16,0.97,1],"transition":{"duration":0.65,"ease":"easeInOut"},"transformOrigin":"center"}},"fill":{"initial":{"opacity":0},"animate":{"opacity":[0,0.55,0],"transition":{"duration":0.85,"ease":"easeInOut"}}}},"loop":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.04,1],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p0":{"initial":{"scale":1,"transformOrigin":"center"},"animate":{"scale":[1,1.05,1],"transition":{"duration":1.4,"ease":"easeInOut"},"transformOrigin":"center"}},"fill":{"initial":{"opacity":0},"animate":{"opacity":[0,0.25,0],"transition":{"duration":1.8,"ease":"easeInOut"}}}}},"component":"PrequelStarIcon"};

export function PrequelStarIcon(props) {
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
