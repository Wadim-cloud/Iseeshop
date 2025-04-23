import { D as getContext, E as attr_class, F as stringify, G as attr, C as pop, z as push, I as head, J as ensure_array_like, K as escape_html, M as store_set, N as store_get, O as unsubscribe_stores } from "../../chunks/index.js";
import { s as supabase } from "../../chunks/supabase.js";
import { g as goto } from "../../chunks/client.js";
import { i as get, w as writable } from "../../chunks/exports.js";
import "clsx";
import "style-to-object";
function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
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
function Button($$payload) {
  $$payload.out += `<div${attr_class(`toggle-container ${stringify("light-mode")}`, "svelte-1owz5qj")}><button class="toggle-switch svelte-1owz5qj" aria-label="Toggle theme"><div class="toggle-slider svelte-1owz5qj">`;
  {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>`;
  }
  $$payload.out += `<!--]--></div></button></div>`;
}
function isFunction(value) {
  return typeof value === "function";
}
function isObject(value) {
  return value !== null && typeof value === "object";
}
const BoxSymbol = Symbol("box");
const isWritableSymbol = Symbol("is-writable");
function isBox(value) {
  return isObject(value) && BoxSymbol in value;
}
function isWritableBox(value) {
  return box.isBox(value) && isWritableSymbol in value;
}
function box(initialValue) {
  let current = initialValue;
  return {
    [BoxSymbol]: true,
    [isWritableSymbol]: true,
    get current() {
      return current;
    },
    set current(v) {
      current = v;
    }
  };
}
function boxWith(getter, setter) {
  const derived = getter();
  if (setter) {
    return {
      [BoxSymbol]: true,
      [isWritableSymbol]: true,
      get current() {
        return derived;
      },
      set current(v) {
        setter(v);
      }
    };
  }
  return {
    [BoxSymbol]: true,
    get current() {
      return getter();
    }
  };
}
function boxFrom(value) {
  if (box.isBox(value)) return value;
  if (isFunction(value)) return box.with(value);
  return box(value);
}
function boxFlatten(boxes) {
  return Object.entries(boxes).reduce(
    (acc, [key, b]) => {
      if (!box.isBox(b)) {
        return Object.assign(acc, { [key]: b });
      }
      if (box.isWritableBox(b)) {
        Object.defineProperty(acc, key, {
          get() {
            return b.current;
          },
          set(v) {
            b.current = v;
          }
        });
      } else {
        Object.defineProperty(acc, key, {
          get() {
            return b.current;
          }
        });
      }
      return acc;
    },
    {}
  );
}
function toReadonlyBox(b) {
  if (!box.isWritableBox(b)) return b;
  return {
    [BoxSymbol]: true,
    get current() {
      return b.current;
    }
  };
}
box.from = boxFrom;
box.with = boxWith;
box.flatten = boxFlatten;
box.readonly = toReadonlyBox;
box.isBox = isBox;
box.isWritableBox = isWritableBox;
function createParser(matcher, replacer) {
  const regex = RegExp(matcher, "g");
  return (str) => {
    if (typeof str !== "string") {
      throw new TypeError(`expected an argument of type string, but got ${typeof str}`);
    }
    if (!str.match(regex))
      return str;
    return str.replace(regex, replacer);
  };
}
const camelToKebab = createParser(/[A-Z]/, (match) => `-${match.toLowerCase()}`);
function styleToCSS(styleObj) {
  if (!styleObj || typeof styleObj !== "object" || Array.isArray(styleObj)) {
    throw new TypeError(`expected an argument of type object, but got ${typeof styleObj}`);
  }
  return Object.keys(styleObj).map((property) => `${camelToKebab(property)}: ${styleObj[property]};`).join("\n");
}
function styleToString(style = {}) {
  return styleToCSS(style).replace("\n", " ");
}
const srOnlyStyles = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: "0",
  transform: "translateX(-100%)"
};
styleToString(srOnlyStyles);
const defaultWindow$1 = void 0;
function getActiveElement$1(document2) {
  let activeElement = document2.activeElement;
  while (activeElement?.shadowRoot) {
    const node = activeElement.shadowRoot.activeElement;
    if (node === activeElement)
      break;
    else
      activeElement = node;
  }
  return activeElement;
}
class MediaQuery {
  current;
  /**
   * @param {string} query
   * @param {boolean} [matches]
   */
  constructor(query, matches = false) {
    this.current = matches;
  }
}
function createSubscriber(_) {
  return () => {
  };
}
let ActiveElement$1 = class ActiveElement {
  #document;
  #subscribe;
  constructor(options = {}) {
    const {
      window: window2 = defaultWindow$1,
      document: document2 = window2?.document
    } = options;
    if (window2 === void 0) return;
    this.#document = document2;
    this.#subscribe = createSubscriber();
  }
  get current() {
    this.#subscribe?.();
    if (!this.#document) return null;
    return getActiveElement$1(this.#document);
  }
};
new ActiveElement$1();
function sanitizeClassNames(classNames) {
  return classNames.filter((className) => className.length > 0);
}
const noopStorage = {
  getItem: (_key) => null,
  setItem: (_key, _value) => {
  }
};
const isBrowser = typeof document !== "undefined";
const modes = ["dark", "light", "system"];
function isValidMode(value) {
  if (typeof value !== "string")
    return false;
  return modes.includes(value);
}
const defaultWindow = void 0;
function getActiveElement(document2) {
  let activeElement = document2.activeElement;
  while (activeElement?.shadowRoot) {
    const node = activeElement.shadowRoot.activeElement;
    if (node === activeElement)
      break;
    else
      activeElement = node;
  }
  return activeElement;
}
class ActiveElement2 {
  #document;
  #subscribe;
  constructor(options = {}) {
    const {
      window: window2 = defaultWindow,
      document: document2 = window2?.document
    } = options;
    if (window2 === void 0) return;
    this.#document = document2;
    this.#subscribe = createSubscriber();
  }
  get current() {
    this.#subscribe?.();
    if (!this.#document) return null;
    return getActiveElement(this.#document);
  }
}
new ActiveElement2();
function getStorage(storageType, window2) {
  switch (storageType) {
    case "local":
      return window2.localStorage;
    case "session":
      return window2.sessionStorage;
  }
}
class PersistedState {
  #current;
  #key;
  #serializer;
  #storage;
  #subscribe;
  #version = 0;
  constructor(key, initialValue, options = {}) {
    const {
      storage: storageType = "local",
      serializer = {
        serialize: JSON.stringify,
        deserialize: JSON.parse
      },
      syncTabs = true,
      window: window2 = defaultWindow
    } = options;
    this.#current = initialValue;
    this.#key = key;
    this.#serializer = serializer;
    if (window2 === void 0) return;
    const storage = getStorage(storageType, window2);
    this.#storage = storage;
    const existingValue = storage.getItem(key);
    if (existingValue !== null) {
      this.#current = this.#deserialize(existingValue);
    } else {
      this.#serialize(initialValue);
    }
    if (syncTabs && storageType === "local") {
      this.#subscribe = createSubscriber();
    }
  }
  get current() {
    this.#subscribe?.();
    this.#version;
    const root = this.#deserialize(this.#storage?.getItem(this.#key)) ?? this.#current;
    const proxies = /* @__PURE__ */ new WeakMap();
    const proxy = (value) => {
      if (value === null || value?.constructor.name === "Date" || typeof value !== "object") {
        return value;
      }
      let p = proxies.get(value);
      if (!p) {
        p = new Proxy(value, {
          get: (target, property) => {
            this.#version;
            return proxy(Reflect.get(target, property));
          },
          set: (target, property, value2) => {
            this.#version += 1;
            Reflect.set(target, property, value2);
            this.#serialize(root);
            return true;
          }
        });
        proxies.set(value, p);
      }
      return p;
    };
    return proxy(root);
  }
  set current(newValue) {
    this.#serialize(newValue);
    this.#version += 1;
  }
  #handleStorageEvent = (event) => {
    if (event.key !== this.#key || event.newValue === null) return;
    this.#current = this.#deserialize(event.newValue);
    this.#version += 1;
  };
  #deserialize(value) {
    try {
      return this.#serializer.deserialize(value);
    } catch (error) {
      console.error(`Error when parsing "${value}" from persisted store "${this.#key}"`, error);
      return;
    }
  }
  #serialize(value) {
    try {
      if (value != void 0) {
        this.#storage?.setItem(this.#key, this.#serializer.serialize(value));
      }
    } catch (error) {
      console.error(`Error when writing value from persisted store "${this.#key}" to ${this.#storage}`, error);
    }
  }
}
let timeoutAction;
let timeoutEnable;
function withoutTransition(action) {
  if (typeof document === "undefined")
    return;
  clearTimeout(timeoutAction);
  clearTimeout(timeoutEnable);
  const style = document.createElement("style");
  const css = document.createTextNode(`* {
     -webkit-transition: none !important;
     -moz-transition: none !important;
     -o-transition: none !important;
     -ms-transition: none !important;
     transition: none !important;
  }`);
  style.appendChild(css);
  const disable = () => document.head.appendChild(style);
  const enable = () => document.head.removeChild(style);
  if (typeof window.getComputedStyle !== "undefined") {
    disable();
    action();
    window.getComputedStyle(style).opacity;
    enable();
    return;
  }
  if (typeof window.requestAnimationFrame !== "undefined") {
    disable();
    action();
    window.requestAnimationFrame(enable);
    return;
  }
  disable();
  timeoutAction = window.setTimeout(() => {
    action();
    timeoutEnable = window.setTimeout(enable, 120);
  }, 120);
}
const modeStorageKey = box("mode-watcher-mode");
const themeStorageKey = box("mode-watcher-theme");
const userPrefersMode = createUserPrefersMode();
const systemPrefersMode = createSystemMode();
const themeColors = box(void 0);
const customTheme = createCustomTheme();
const disableTransitions = box(true);
const darkClassNames = box([]);
const lightClassNames = box([]);
function createUserPrefersMode() {
  const defaultValue = "system";
  const storage = isBrowser ? localStorage : noopStorage;
  const initialValue = storage.getItem(modeStorageKey.current);
  const value = isValidMode(initialValue) ? initialValue : defaultValue;
  return new PersistedState(modeStorageKey.current, value, {
    serializer: {
      serialize: (v) => v,
      deserialize: (v) => {
        if (isValidMode(v)) return v;
        return defaultValue;
      }
    }
  });
}
function createCustomTheme() {
  const storage = isBrowser ? localStorage : noopStorage;
  const initialValue = storage.getItem(themeStorageKey.current);
  const value = initialValue === null || initialValue === void 0 ? "" : initialValue;
  return new PersistedState(themeStorageKey.current, value, {
    serializer: {
      serialize: (v) => {
        if (typeof v !== "string") return "";
        return v;
      },
      deserialize: (v) => v
    }
  });
}
function createSystemMode() {
  const defaultValue = void 0;
  let current = defaultValue;
  function query() {
    if (!isBrowser) return;
    current = mediaQueryState.current ? "light" : "dark";
  }
  function tracking(active) {
  }
  const mediaQueryState = typeof window !== "undefined" && "matchMedia" in window ? new MediaQuery("prefers-color-scheme: light") : { current: false };
  return {
    get current() {
      return current;
    },
    query,
    tracking
  };
}
function createDerivedMode() {
  const current = (() => {
    if (!isBrowser) return void 0;
    const derivedMode = userPrefersMode.current === "system" ? systemPrefersMode.current : userPrefersMode.current;
    const sanitizedDarkClassNames = sanitizeClassNames(darkClassNames.current);
    const sanitizedLightClassNames = sanitizeClassNames(lightClassNames.current);
    function update() {
      const htmlEl = document.documentElement;
      const themeColorEl = document.querySelector('meta[name="theme-color"]');
      if (derivedMode === "light") {
        if (sanitizedDarkClassNames.length) htmlEl.classList.remove(...sanitizedDarkClassNames);
        if (sanitizedLightClassNames.length) htmlEl.classList.add(...sanitizedLightClassNames);
        htmlEl.style.colorScheme = "light";
        if (themeColorEl && themeColors.current) {
          themeColorEl.setAttribute("content", themeColors.current.light);
        }
      } else {
        if (sanitizedLightClassNames.length) htmlEl.classList.remove(...sanitizedLightClassNames);
        if (sanitizedDarkClassNames.length) htmlEl.classList.add(...sanitizedDarkClassNames);
        htmlEl.style.colorScheme = "dark";
        if (themeColorEl && themeColors.current) {
          themeColorEl.setAttribute("content", themeColors.current.dark);
        }
      }
    }
    if (disableTransitions.current) {
      withoutTransition(update);
    } else {
      update();
    }
    return derivedMode;
  })();
  return {
    get current() {
      return current;
    }
  };
}
function createDerivedTheme() {
  const current = (() => {
    customTheme.current;
    if (!isBrowser) return void 0;
    function update() {
      const htmlEl = document.documentElement;
      htmlEl.setAttribute("data-theme", customTheme.current);
    }
    if (disableTransitions.current) {
      withoutTransition(update);
    } else {
      update();
    }
    return customTheme.current;
  })();
  return {
    get current() {
      return current;
    }
  };
}
createDerivedMode();
createDerivedTheme();
function defineConfig(config) {
  return config;
}
function setInitialMode({ defaultMode = "system", themeColors: themeColors2, darkClassNames: darkClassNames2 = ["dark"], lightClassNames: lightClassNames2 = [], defaultTheme = "", modeStorageKey: modeStorageKey2 = "mode-watcher-mode", themeStorageKey: themeStorageKey2 = "mode-watcher-theme" }) {
  const rootEl = document.documentElement;
  const mode = localStorage.getItem(modeStorageKey2) ?? defaultMode;
  const theme = localStorage.getItem(themeStorageKey2) ?? defaultTheme;
  const light = mode === "light" || mode === "system" && window.matchMedia("(prefers-color-scheme: light)").matches;
  if (light) {
    if (darkClassNames2.length)
      rootEl.classList.remove(...darkClassNames2);
    if (lightClassNames2.length)
      rootEl.classList.add(...lightClassNames2);
  } else {
    if (lightClassNames2.length)
      rootEl.classList.remove(...lightClassNames2);
    if (darkClassNames2.length)
      rootEl.classList.add(...darkClassNames2);
  }
  rootEl.style.colorScheme = light ? "light" : "dark";
  if (themeColors2) {
    const themeMetaEl = document.querySelector('meta[name="theme-color"]');
    if (themeMetaEl) {
      themeMetaEl.setAttribute("content", mode === "light" ? themeColors2.light : themeColors2.dark);
    }
  }
  if (theme) {
    rootEl.setAttribute("data-theme", theme);
    localStorage.setItem(themeStorageKey2, theme);
  }
  localStorage.setItem(modeStorageKey2, mode);
}
function Mode_watcher_lite($$payload, $$props) {
  push();
  let { themeColors: themeColors2 } = $$props;
  if (themeColors2) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<meta name="theme-color"${attr("content", themeColors2.dark)}>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  pop();
}
function Mode_watcher_full($$payload, $$props) {
  push();
  let { trueNonce = "", initConfig, themeColors: themeColors2 } = $$props;
  head($$payload, ($$payload2) => {
    if (themeColors2) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<meta name="theme-color"${attr("content", themeColors2.dark)}>`;
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--> ${html(`<script${trueNonce ? ` nonce=${trueNonce}` : ""}>(` + setInitialMode.toString() + `)(` + JSON.stringify(initConfig) + `);<\/script>`)}`;
  });
  pop();
}
function Mode_watcher($$payload, $$props) {
  push();
  let {
    defaultMode = "system",
    themeColors: themeColorsProp,
    darkClassNames: darkClassNamesProp = ["dark"],
    lightClassNames: lightClassNamesProp = [],
    defaultTheme = "",
    nonce = "",
    themeStorageKey: themeStorageKeyProp = "mode-watcher-theme",
    modeStorageKey: modeStorageKeyProp = "mode-watcher-mode",
    disableHeadScriptInjection = false
  } = $$props;
  const initConfig = defineConfig({
    defaultMode,
    themeColors: themeColorsProp,
    darkClassNames: darkClassNamesProp,
    lightClassNames: lightClassNamesProp,
    defaultTheme,
    modeStorageKey: modeStorageKeyProp,
    themeStorageKey: themeStorageKeyProp
  });
  const trueNonce = typeof window === "undefined" ? nonce : "";
  if (disableHeadScriptInjection) {
    $$payload.out += "<!--[-->";
    Mode_watcher_lite($$payload, { themeColors: themeColors.current });
  } else {
    $$payload.out += "<!--[!-->";
    Mode_watcher_full($$payload, {
      trueNonce,
      initConfig,
      themeColors: themeColors.current
    });
  }
  $$payload.out += `<!--]-->`;
  pop();
}
function NavBar($$payload, $$props) {
  push();
  let { session } = $$props;
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
    {
      name: "About",
      href: "/about",
      authRequired: true
    }
  ];
  let user = session?.user;
  let avatarUrl = user?.user_metadata?.avatar_url || "/default-avatar.png";
  let displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  let isCreatePage = get(page).url.pathname === "/create";
  let forceDot = false;
  if ((isCreatePage || forceDot) && user) {
    $$payload.out += "<!--[-->";
    {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="nav-dot svelte-172c0m4"><span class="dot-tooltip svelte-172c0m4">Menu</span></div>`;
    }
    $$payload.out += `<!--]-->`;
  } else {
    $$payload.out += "<!--[!-->";
    const each_array_1 = ensure_array_like(navItems);
    $$payload.out += `<nav class="navbar svelte-172c0m4"><div class="nav-container svelte-172c0m4"><a href="/" class="brand svelte-172c0m4"><img src="/logo192.png" alt="Pexos Logo" class="logo svelte-172c0m4"> <span class="brand-name svelte-172c0m4">Pexos</span></a> <div class="nav-links svelte-172c0m4"><!--[-->`;
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let item = each_array_1[$$index_1];
      if (!item.authRequired || item.authRequired && session) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<a${attr("href", item.href)}${attr_class("nav-link svelte-172c0m4", void 0, {
          "active": get(page).url.pathname === item.href
        })}>${escape_html(item.name)}</a>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]-->`;
    }
    $$payload.out += `<!--]--></div> <div class="auth-section svelte-172c0m4">`;
    if (user) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="user-profile svelte-172c0m4"><img${attr("src", avatarUrl)} alt="User Avatar" class="avatar svelte-172c0m4"> <span class="username svelte-172c0m4">${escape_html(displayName)}</span></div> `;
      Button($$payload);
      $$payload.out += `<!----> <button class="auth-button sign-out svelte-172c0m4">Sign Out</button>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div></div></nav>`;
  }
  $$payload.out += `<!--]-->`;
  pop();
}
function _layout($$payload, $$props) {
  push();
  var $$store_subs;
  let { data, children } = $$props;
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
  head($$payload, ($$payload2) => {
    $$payload2.out += `<meta name="google-site-verification" content="fP4cuGw4wrszN9kcVbzYHTB8bKj4YSxHTyZDSGOvyPk"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta property="og:title" content="Pexos, collaborative creative platform"> <meta property="og:description" content="Log in and start creating."> <meta property="og:image" content="https://pexos.netlify.app/logo192.png"> <meta property="og:url" content="https://pexos.netlify.app"> <meta property="og:type" content="website"> <meta name="twitter:card" content="summary_large_image"> <meta name="twitter:title" content="Pexos, collaborative creative platform"> <meta name="twitter:description" content="Log in and start creating."> <meta name="twitter:image" content="https://pexos.netlify.app/logo192.png"> `;
    {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]-->`;
  });
  $$payload.out += `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TVHZWJGB" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript> `;
  Mode_watcher($$payload, {});
  $$payload.out += `<!----> `;
  if (store_get($$store_subs ??= {}, "$loading", loading)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div>Loading...</div>`;
  } else {
    $$payload.out += "<!--[!-->";
    NavBar($$payload, {
      session: store_get($$store_subs ??= {}, "$sessionStore", sessionStore)
    });
    $$payload.out += `<!----> `;
    children($$payload);
    $$payload.out += `<!---->`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _layout as default
};
