import { m as copy_payload, o as assign_payload, p as pop, a as push, h as head } from "../../chunks/index.js";
import "../../chunks/client.js";
import "../../chunks/supabase.js";
/* empty css                                                   */
import "../../chunks/auth.js";
function _page($$payload, $$props) {
  push();
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    head($$payload2, ($$payload3) => {
      $$payload3.title = `<title>Pexos - Creative Platform</title>`;
      $$payload3.out += `<meta name="description" content="A collaborative creative platform for drawing, plotting, selling, and solving challenges." class="svelte-i1vkni">`;
    });
    {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="loader-container svelte-i1vkni" role="status" aria-live="polite"><div class="loader-overlay svelte-i1vkni"></div> <div class="loader-content svelte-i1vkni"><img src="/logo192.png" alt="Pexos Logo" class="loader-logo floating svelte-i1vkni"> <p class="loader-text svelte-i1vkni">Initializing Pexos...</p></div></div>`;
    }
    $$payload2.out += `<!--]--> `;
    {
      $$payload2.out += "<!--[!-->";
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
