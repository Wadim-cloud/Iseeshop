import { Q as copy_payload, R as assign_payload, C as pop, z as push, M as head } from "../../chunks/index.js";
import "../../chunks/client.js";
/* empty css                                                      */
import "../../chunks/supabase.js";
function _page($$payload, $$props) {
  push();
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    head($$payload2, ($$payload3) => {
      $$payload3.title = `<title>Pexos - Creative Platform</title>`;
      $$payload3.out += `<meta name="description" content="A collaborative creative platform" class="svelte-1aduj7e">`;
    });
    {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="container svelte-1aduj7e" role="status" aria-live="polite"><div class="loading-content svelte-1aduj7e"><img src="/logo192.png" alt="Pexos Logo" class="logo-image floating svelte-1aduj7e"> <p class="loading-text floating svelte-1aduj7e">Loading Pexos...</p></div></div>`;
    }
    $$payload2.out += `<!--]--> `;
    {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]-->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  pop();
}
export {
  _page as default
};
