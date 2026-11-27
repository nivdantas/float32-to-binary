const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const script = readFileSync(path.join(__dirname, "../assets/js/index.js"), "utf8");

function loadConverter() {
  const handlers = {};
  const form = {
    reportValidity: () => true,
    addEventListener: (name, handler) => { handlers[name] = handler; },
  };
  const input = {
    value: "",
    addEventListener: (name, handler) => { handlers[name] = handler; },
  };
  const output = { textContent: "" };
  const elements = { form, "#input": input, "#bits": output };
  vm.runInNewContext(script, {
    document: { querySelector: (selector) => elements[selector] },
  }, { timeout: 1000 });

  return {
    form,
    input,
    output,
    submit() {
      let prevented = false;
      handlers.submit({ preventDefault: () => { prevented = true; } });
      assert.equal(prevented, true);
    },
    edit: handlers.input,
  };
}

const cases = [
  ["positive zero", 0, 0x00000000],
  ["negative zero", "-0", 0x80000000],
  ["negative zero in scientific notation", "-0e2", 0x80000000],
  ["negative fraction", -2.5, 0xc0200000],
  ["rounding up", 0.1, 0x3dcccccd],
  ["tie rounds to even", 1 + 2 ** -24, 0x3f800000],
  ["smallest subnormal", 2 ** -149, 0x00000001],
  ["negative underflow", -(2 ** -150), 0x80000000],
  ["overflow", 1e39, 0x7f800000],
];

for (const [name, value, expected] of cases) {
  test(name, () => {
    const converter = loadConverter();
    converter.input.value = String(value);
    converter.submit();
    assert.equal(converter.output.textContent, expected.toString(2).padStart(32, "0"));
  });
}

test("editing clears stale bits and invalid input leaves the result empty", () => {
  const converter = loadConverter();
  converter.input.value = "1";
  converter.submit();
  assert.equal(converter.output.textContent.length, 32);

  converter.input.value = "";
  converter.edit();
  converter.form.reportValidity = () => false;
  converter.submit();
  assert.equal(converter.output.textContent, "");
});
