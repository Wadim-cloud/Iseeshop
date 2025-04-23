import { P as copy_payload, Q as assign_payload, C as pop, z as push, I as head } from "../../chunks/index.js";
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
      $$payload3.out += `<meta name="description" content="A collaborative creative platform for drawing, plotting, selling, and solving challenges." class="svelte-1q0bxm1">`;
    });
    {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="loader-container svelte-1q0bxm1" role="status" aria-live="polite"><div class="loader-overlay svelte-1q0bxm1"></div> <div class="loader-content svelte-1q0bxm1"><img src="/logo192.png" alt="Pexos Logo" class="loader-logo floating svelte-1q0bxm1"> <p class="loader-text svelte-1q0bxm1">Initializing Pexos...</p></div></div>`;
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
