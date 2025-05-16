import { e as ensure_array_like, b as attr, d as escape_html, p as pop, a as push } from "../../../chunks/index.js";
import "../../../chunks/supabase.js";
function _page($$payload, $$props) {
  push();
  let drawingId = "";
  let brushSize = 5;
  const colors = ["black", "red", "blue", "green"];
  const each_array = ensure_array_like(colors);
  $$payload.out += `<div class="container svelte-hwv8gf"><div class="controls svelte-hwv8gf"><input type="text"${attr("value", drawingId)} placeholder="Enter Drawing ID" class="svelte-hwv8gf"> <button class="svelte-hwv8gf">Choose Drawing</button> <button class="svelte-hwv8gf">Reset</button> <button class="svelte-hwv8gf">Save Drawing</button> <select class="svelte-hwv8gf"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let color = each_array[$$index];
    $$payload.out += `<option${attr("value", color)}>${escape_html(color)}</option>`;
  }
  $$payload.out += `<!--]--></select> <input type="range"${attr("value", brushSize)} min="1" max="50" class="svelte-hwv8gf"> <button class="svelte-hwv8gf">Clear Canvas</button></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <canvas width="800" height="600" class="svelte-hwv8gf"></canvas></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  pop();
}
export {
  _page as default
};
