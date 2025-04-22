import { D as getContext, E as ensure_array_like, F as attr, G as attr_class, I as escape_html, J as bind_props, C as pop, z as push, K as store_set, M as head, N as store_get, O as slot, P as unsubscribe_stores } from "../../chunks/index.js";
import { s as supabase } from "../../chunks/supabase.js";
import { g as goto } from "../../chunks/client.js";
import { i as get, w as writable } from "../../chunks/exports.js";
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
function NavBar($$payload, $$props) {
  push();
  let user, avatarUrl, displayName, isCreatePage;
  let session = $$props["session"];
  let onAuthToggle = $$props["onAuthToggle"];
  const navItems = [
    {
      name: "Todo",
      href: "/todo",
      authRequired: true
    },
    {
      name: "Gallery",
      href: "/gallery",
      authRequired: true
    },
    {
      name: "Create",
      href: "/create",
      authRequired: true
    },
    { name: "About", href: "/about" }
  ];
  let forceDot = false;
  user = session?.user;
  avatarUrl = user?.user_metadata?.avatar_url || "/default-avatar.png";
  displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  isCreatePage = get(page).url.pathname === "/create";
  if ((isCreatePage || forceDot) && user) {
    $$payload.out += "<!--[-->";
    {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="nav-dot svelte-gh5nfs"><span class="dot-tooltip svelte-gh5nfs">Menu</span></div>`;
    }
    $$payload.out += `<!--]-->`;
  } else {
    $$payload.out += "<!--[!-->";
    const each_array_1 = ensure_array_like(navItems);
    $$payload.out += `<nav class="navbar svelte-gh5nfs"><div class="nav-container svelte-gh5nfs"><a href="/" class="brand svelte-gh5nfs"><img src="/logo192.png" alt="Pexos Logo" class="logo svelte-gh5nfs"> <span class="brand-name svelte-gh5nfs">Pexos</span></a> <div class="nav-links svelte-gh5nfs"><!--[-->`;
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let item = each_array_1[$$index_1];
      if (!item.authRequired || item.authRequired && session) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<a${attr("href", item.href)}${attr_class("nav-link svelte-gh5nfs", void 0, {
          "active": get(page).url.pathname === item.href
        })}>${escape_html(item.name)}</a>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]-->`;
    }
    $$payload.out += `<!--]--></div> <div class="auth-section svelte-gh5nfs">`;
    if (user) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="user-profile svelte-gh5nfs"><img${attr("src", avatarUrl)} alt="User Avatar" class="avatar svelte-gh5nfs"> <span class="username svelte-gh5nfs">${escape_html(displayName)}</span></div> <button class="auth-button sign-out svelte-gh5nfs">Sign Out</button>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div></div></nav>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { session, onAuthToggle });
  pop();
}
function _layout($$payload, $$props) {
  push();
  var $$store_subs;
  let data = $$props["data"];
  const sessionStore = writable(data.session);
  const loading = writable(true);
  supabase.auth.getSession().then(async ({ data: { session: clientSession }, error }) => {
    console.log("Client session loaded at:", (/* @__PURE__ */ new Date()).toISOString());
    if (error) {
      console.error("Session load error:", error.message);
    }
    store_set(sessionStore, clientSession || data.session);
    store_set(loading, false);
  }).catch((err) => {
    console.error("Session load error:", err);
    store_set(sessionStore, null);
    store_set(loading, false);
  });
  supabase.auth.onAuthStateChange((event, newSession) => {
    console.log("Layout auth state changed:", event, newSession?.user?.email);
    store_set(sessionStore, newSession);
    if (event === "SIGNED_OUT") {
      console.log("User signed out, redirecting to /");
      goto("/", {});
    }
  });
  async function handleAuthToggle() {
    if (store_get($$store_subs ??= {}, "$sessionStore", sessionStore)) {
      console.log("Initiating sign out");
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error("Sign out error:", error.message);
          throw error;
        }
        console.log("Signed out successfully");
        store_set(sessionStore, null);
        goto("/", { replaceState: true });
      } catch (err) {
        console.error("Sign out failed:", err);
      }
    }
  }
  head($$payload, ($$payload2) => {
    $$payload2.out += `<meta name="google-site-verification" content="fP4cuGw4wrszN9kcVbzYHTB8bKj4YSxHTyZDSGOvyPk"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta property="og:title" content="Pexos, collaborative creative platform"> <meta property="og:description" content="Log in and start creating."> <meta property="og:image" content="https://pexos.netlify.app/logo192.png"> <meta property="og:url" content="https://pexos.netlify.app"> <meta property="og:type" content="website"> <meta name="twitter:card" content="summary_large_image"> <meta name="twitter:title" content="Pexos, collaborative creative platform"> <meta name="twitter:description" content="Log in and start creating."> <meta name="twitter:image" content="https://pexos.netlify.app/logo192.png"> `;
    {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]-->`;
  });
  $$payload.out += `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TVHZWJGB" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript> `;
  if (store_get($$store_subs ??= {}, "$loading", loading)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div>Loading...</div>`;
  } else {
    $$payload.out += "<!--[!-->";
    NavBar($$payload, {
      session: store_get($$store_subs ??= {}, "$sessionStore", sessionStore),
      onAuthToggle: handleAuthToggle
    });
    $$payload.out += `<!----> <!---->`;
    slot($$payload, $$props, "default", {});
    $$payload.out += `<!---->`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { data });
  pop();
}
export {
  _layout as default
};
