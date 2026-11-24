import { For, createSignal } from "solid-js";

export type InputOTPProps = {
  length?: number;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
};

export function InputOTP(props: InputOTPProps) {
  const length = props.length ?? 6;
  const initial = props.defaultValue ?? "";
  const [values, setValues] = createSignal(
    Array.from({ length }, (_, index) => initial[index] ?? ""),
  );
  const inputs: (HTMLInputElement | undefined)[] = [];

  function commit(next: string[]) {
    setValues(next);
    const joined = next.join("");
    props.onChange?.(joined);
    if (joined.length === length) props.onComplete?.(joined);
  }

  function write(index: number, text: string) {
    const chars = text.replace(/\D/g, "").slice(0, length - index).split("");
    if (!chars.length) return;
    const next = [...values()];
    chars.forEach((char, offset) => {
      next[index + offset] = char;
    });
    commit(next);
    inputs[Math.min(length - 1, index + chars.length)]?.focus();
  }

  function backspace(index: number) {
    const next = [...values()];
    if (next[index]) {
      next[index] = "";
      commit(next);
    } else if (index > 0) {
      next[index - 1] = "";
      commit(next);
      inputs[index - 1]?.focus();
    }
  }

  return (
    <div class="flex items-center gap-2" role="group" aria-label="One-time code">
      <For each={values()}>
        {(char, index) => (
          <input
            ref={(node) => {
              inputs[index()] = node;
            }}
            value={char}
            inputmode="numeric"
            autocomplete="one-time-code"
            maxlength={1}
            aria-label={`Digit ${index() + 1}`}
            class="otp-input size-10 rounded-lg border bg-background text-center font-mono text-[15px] outline-none focus-visible:ring-2 focus-visible:ring-ring"
            classList={{ filled: !!char }}
            style={{ "animation-delay": `${index() * 30}ms` }}
            onInput={(event) => {
              const digits = event.currentTarget.value.replace(/\D/g, "");
              if (!digits) {
                const next = [...values()];
                next[index()] = "";
                commit(next);
                return;
              }
              write(index(), digits);
              event.currentTarget.value = values()[index()] ?? "";
            }}
            onKeyDown={(event) => {
              if (event.key === "Backspace") {
                event.preventDefault();
                backspace(index());
              }
            }}
            onPaste={(event) => {
              event.preventDefault();
              write(index(), event.clipboardData?.getData("text") ?? "");
            }}
          />
        )}
      </For>
      <style>{`
        .otp-input.filled { animation: otp-pop 240ms cubic-bezier(0.23,1,0.32,1) both; }
        @keyframes otp-pop { from { transform: scale(0.9); opacity: 0.4; } }
        @media (prefers-reduced-motion: reduce) { .otp-input.filled { animation: none; } }
      `}</style>
    </div>
  );
}
