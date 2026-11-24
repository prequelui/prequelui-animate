let uid = 0;
let styled = false;

function ensureStyles() {
  if (styled) return;
  styled = true;
  const style = document.createElement("style");
  style.textContent = `
    .otp-input.filled { animation: otp-pop 240ms cubic-bezier(0.23,1,0.32,1) both; }
    @keyframes otp-pop { from { transform: scale(0.9); opacity: 0.4; } }
    @media (prefers-reduced-motion: reduce) { .otp-input.filled { animation: none; } }`;
  document.head.appendChild(style);
}

export function createInputOTP(root, options = {}) {
  ensureStyles();
  const { length = 6, defaultValue = "", onChange = undefined, onComplete = undefined } = options;
  const id = `otp-${++uid}`;
  const values = Array.from({ length }, (_, index) => defaultValue[index] ?? "");

  root.innerHTML = `
    <div class="flex items-center gap-2" role="group" aria-label="One-time code" data-otp="${id}">
      ${values
        .map(
          (value, index) => `<input value="${value}" inputmode="numeric" autocomplete="one-time-code"
            maxlength="1" aria-label="Digit ${index + 1}"
            class="otp-input size-10 rounded-lg border bg-background text-center font-mono text-[15px] outline-none focus-visible:ring-2 focus-visible:ring-ring ${value ? "filled" : ""}"
            style="animation-delay:${index * 30}ms" data-index="${index}" />`,
        )
        .join("")}
    </div>`;
  const inputs = [...root.querySelectorAll("input")];

  function commit() {
    const joined = values.join("");
    onChange?.(joined);
    if (joined.length === length) onComplete?.(joined);
  }

  function render() {
    inputs.forEach((input, index) => {
      input.value = values[index];
      input.classList.toggle("filled", !!values[index]);
    });
  }

  function write(index, text) {
    const chars = text.replace(/\D/g, "").slice(0, length - index).split("");
    if (!chars.length) return;
    chars.forEach((char, offset) => {
      values[index + offset] = char;
    });
    commit();
    render();
    inputs[Math.min(length - 1, index + chars.length)]?.focus();
  }

  inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      const digits = input.value.replace(/\D/g, "");
      if (!digits) {
        values[index] = "";
        commit();
        render();
        return;
      }
      write(index, digits);
    });
    input.addEventListener("keydown", (event) => {
      if (event.key !== "Backspace") return;
      event.preventDefault();
      if (values[index]) {
        values[index] = "";
      } else if (index > 0) {
        values[index - 1] = "";
        inputs[index - 1].focus();
      }
      commit();
      render();
    });
    input.addEventListener("paste", (event) => {
      event.preventDefault();
      write(index, event.clipboardData?.getData("text") ?? "");
    });
  });

  return {
    get value() { return values.join(""); },
    destroy() { root.innerHTML = ""; },
  };
}
