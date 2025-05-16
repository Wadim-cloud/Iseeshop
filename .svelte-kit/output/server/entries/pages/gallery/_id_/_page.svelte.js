import { j as getContext, s as store_get, h as head, u as unsubscribe_stores, p as pop, a as push, d as escape_html, b as attr, g as stringify } from "../../../../chunks/index.js";
import "../../../../chunks/supabase.js";
import "../../../../chunks/client.js";
import "../../../../chunks/auth.js";
/* empty css                                                         */
/* empty css                                                             */
const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let drawingId;
  drawingId = store_get($$store_subs ??= {}, "$page", page).params.id;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Pexos - Drawing #${escape_html(drawingId)}</title>`;
    $$payload2.out += `<meta name="description"${attr("content", `View drawing #${stringify(drawingId)} on Pexos, a collaborative creative platform.`)} class="svelte-w2ql0i">`;
  });
  $$payload.out += `<div class="gallery-container svelte-w2ql0i">`;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="loading svelte-w2ql0i" role="status" aria-live="polite"><div class="spinner svelte-w2ql0i"></div> <p class="svelte-w2ql0i">Loading drawing...</p></div>`;
  }
  $$payload.out += `<!--]--></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
