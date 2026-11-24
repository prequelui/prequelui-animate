import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
export async function confirm(question, options, defaultYes = false) {
    if (options.yes)
        return true;
    if (!options.interactive || !input.isTTY || !output.isTTY)
        return defaultYes;
    const rl = readline.createInterface({ input, output });
    try {
        const suffix = defaultYes ? " [Y/n] " : " [y/N] ";
        const answer = (await rl.question(`${question}${suffix}`)).trim().toLowerCase();
        if (!answer)
            return defaultYes;
        return answer === "y" || answer === "yes" || answer === "o" || answer === "oui";
    }
    finally {
        rl.close();
    }
}
export async function choose(question, options, promptOptions) {
    if (promptOptions.yes || !input.isTTY || !output.isTTY)
        return options[0];
    const rl = readline.createInterface({ input, output });
    try {
        output.write(`${question}\n`);
        options.forEach((option, index) => {
            output.write(`  ${index + 1}. ${option}\n`);
        });
        const answer = (await rl.question(`Choose 1-${options.length} [1] `)).trim();
        const index = Number.parseInt(answer, 10);
        if (!Number.isFinite(index) || index < 1 || index > options.length) {
            return options[0];
        }
        return options[index - 1];
    }
    finally {
        rl.close();
    }
}
