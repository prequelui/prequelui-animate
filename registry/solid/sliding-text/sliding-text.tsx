import { animate } from "motion";

export type SlidingTextProps = {
  text: string;
  direction?: "up" | "down";
  trigger?: "hover" | "click";
  class?: string;
};

export function SlidingText(props: SlidingTextProps) {
  let track: HTMLSpanElement | undefined;
  let offset = 0;
  let controls: { stop?: () => void } | undefined;
  const sign = () => (props.direction === "down" ? 1 : -1);
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const slideTo = (next: boolean) => {
    if (!track) return;
    const lap = sign() * (next ? 1 : 0);
    const transform =
      lap === 0 ? "translateY(0%)" : `translateY(calc(${lap * 100}% + ${lap} * 0.6em))`;
    controls?.stop?.();
    controls = animate(
      track,
      { transform },
      reduce() ? { duration: 0 } : { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
    );
  };

  return (
    <span
      data-slot="sliding-text"
      data-direction={props.direction ?? "down"}
      data-trigger={props.trigger ?? "hover"}
      class={`relative inline-block overflow-clip ${props.class ?? ""}`}
      style={{ "padding-block": "0.25em", "margin-block": "-0.25em" }}
      onPointerEnter={(event) => {
        if (props.trigger !== "click" && event.pointerType !== "touch") slideTo(true);
      }}
      onPointerLeave={(event) => {
        if (props.trigger !== "click" && event.pointerType !== "touch") slideTo(false);
      }}
      onClick={() => {
        if (props.trigger !== "click") return;
        offset += 1;
        slideTo(offset % 2 === 1);
      }}
    >
      <span
        ref={track}
        data-slot="sliding-text-track"
        class="relative inline-block"
        style={{ transform: "translateY(0%)" }}
      >
        {props.text}
        <span
          data-slot="sliding-text-copy"
          aria-hidden="true"
          class="absolute left-0 w-full"
          style={{ top: `calc(${-sign() * 100}% - ${sign()} * 0.6em)` }}
        >
          {props.text}
        </span>
      </span>
    </span>
  );
}
