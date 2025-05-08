import { j as fallback, d as attr_class, f as escape_html, k as bind_props } from "./index.js";
function Toast($$payload, $$props) {
  let message = $$props["message"];
  let show = $$props["show"];
  let type = fallback($$props["type"], "success");
  if (show) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div${attr_class("toast svelte-1q32h6p", void 0, {
      "success": type === "success",
      "error": type === "error"
    })}>${escape_html(message)}</div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { message, show, type });
}
export {
  Toast as T
};
