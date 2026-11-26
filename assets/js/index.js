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

  bytes.setFloat32(0, input.valueAsNumber, false);
  output.textContent = bytes.getUint32(0, false).toString(2).padStart(32, "0");
});

input.addEventListener("input", () => {
  output.textContent = "";
});
