import "clsx";
import { p as pop, a as push } from "../../../../chunks/index.js";
import "../../../../chunks/supabase.js";
import "../../../../chunks/client.js";
function _page($$payload, $$props) {
  push();
  $$payload.out += `<div>Authenticating...</div>`;
  pop();
}
export {
  _page as default
};
