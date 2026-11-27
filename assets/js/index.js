"use strict";

const form = document.querySelector("form");
const input = document.querySelector("#input");
const output = document.querySelector("#bits");
const bytes = new DataView(new ArrayBuffer(4));

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.reportValidity()) {
    return;
  }

  // Some browsers normalize -0 to +0 in valueAsNumber.
  bytes.setFloat32(0, Number(input.value), false);
  output.textContent = bytes.getUint32(0, false).toString(2).padStart(32, "0");
});

input.addEventListener("input", () => {
  output.textContent = "";
});
