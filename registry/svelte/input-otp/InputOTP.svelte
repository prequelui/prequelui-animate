<script>
  let { length = 6, defaultValue = "", value = undefined, onChange = undefined, onComplete = undefined } = $props();

  let values = $state(
    Array.from({ length }, (_, index) => (value ?? defaultValue)[index] ?? ""),
  );
  let inputs = [];

  function commit() {
    const joined = values.join("");
    onChange?.(joined);
    if (joined.length === length) onComplete?.(joined);
  }

  function write(index, text) {
    const chars = text.replace(/\D/g, "").slice(0, length - index).split("");
    if (!chars.length) return;
    chars.forEach((char, offset) => {
      values[index + offset] = char;
    });
    commit();
    inputs[Math.min(length - 1, index + chars.length)]?.focus();
  }

  function onInput(event, index) {
    const digits = event.target.value.replace(/\D/g, "");
    if (!digits) {
      values[index] = "";
      commit();
      return;
    }
    write(index, digits);
    event.target.value = values[index] ?? "";
  }

  function onBackspace(index) {
    if (values[index]) {
      values[index] = "";
      commit();
    } else if (index > 0) {
      values[index - 1] = "";
      commit();
      inputs[index - 1]?.focus();
    }
  }
</script>

<div class="flex items-center gap-2" role="group" aria-label="One-time code">
  {#each values as char, index (index)}
    <input
      bind:this={inputs[index]}
      value={char}
      inputmode="numeric"
      autocomplete="one-time-code"
      maxlength="1"
      aria-label={`Digit ${index + 1}`}
      class="otp-input size-10 rounded-lg border bg-background text-center font-mono text-[15px] outline-none focus-visible:ring-2 focus-visible:ring-ring"
      class:filled={!!char}
      style={`animation-delay:${index * 30}ms`}
      oninput={(event) => onInput(event, index)}
      onkeydown={(event) => event.key === "Backspace" && (event.preventDefault(), onBackspace(index))}
      onpaste={(event) => {
        event.preventDefault();
        write(index, event.clipboardData?.getData("text") ?? "");
      }}
    />
  {/each}
</div>

<style>
  .otp-input.filled { animation: otp-pop 240ms cubic-bezier(0.23, 1, 0.32, 1) both; }
  @keyframes otp-pop { from { transform: scale(0.9); opacity: 0.4; } }
  @media (prefers-reduced-motion: reduce) {
    .otp-input.filled { animation: none; }
  }
</style>
