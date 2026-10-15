import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../assets/js/copy_code.js", import.meta.url), "utf8");

function copyFixture(text, writeText) {
  let button;
  const code = { innerText: text, textContent: text };
  const block = {
    querySelector: (selector) => selector.startsWith("pre") ? null : code,
    parentElement: { insertBefore() {} },
  };
  vm.runInNewContext(source, {
    document: {
      querySelectorAll: () => [block],
      createElement(tag) {
        const element = { append() {}, addEventListener(event, handler) { this[event] = handler; } };
        if (tag === "button") button = element;
        return element;
      },
    },
    window: { navigator: { clipboard: { writeText } } },
    setTimeout() {},
  });
  return button;
}

test("copying code preserves leading indentation and the trailing newline", async () => {
  const original = "    def control():\n        return action\n";
  let copied;
  const button = copyFixture(original, async (text) => { copied = text; });
  await button.click();
  assert.equal(copied, original);
  assert.equal(button.ariaLabel, "Code copied");
});

test("clipboard failure does not claim code was copied", async () => {
  const button = copyFixture("action = policy(state)\n", () => { throw new Error("Clipboard unavailable"); });
  await button.click();
  assert.equal(button.ariaLabel, "Copy failed; select the code manually");
});
