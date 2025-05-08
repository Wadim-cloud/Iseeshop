import { l as copy_payload, m as assign_payload, k as bind_props, p as pop, a as push, e as ensure_array_like, d as attr_class, s as store_get, f as escape_html, b as attr, u as unsubscribe_stores, h as head } from "../../chunks/index.js";
import { s as supabase } from "../../chunks/supabase.js";
import "../../chunks/client.js";
import { d as derived, w as writable } from "../../chunks/exports.js";
/* empty css                                                   */
import { n as notificationStore } from "../../chunks/notifications.js";
import "clsx";
import "style-to-object";
function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
function NavBar($$payload, $$props) {
  push();
  var $$store_subs;
  let session = $$props["session"];
  let onAuthToggle = $$props["onAuthToggle"];
  const sessionStore = writable(session);
  const user = derived(sessionStore, ($session) => $session?.user || null);
  const avatarUrl = derived(user, ($user) => $user?.user_metadata?.avatar_url || "/default-avatar.png");
  derived(user, ($user) => $user?.user_metadata?.full_name || $user?.email?.split("@")[0] || "User");
  function createBlocks() {
    return Array(50).fill(null).map((_, i) => ({
      id: i,
      isBlack: false,
      isBlue: false,
      isRed: false,
      navigateTo: null
    }));
  }
  let blocks1 = createBlocks();
  let blocks2 = createBlocks();
  let blocks3 = createBlocks();
  sessionStore.set(session);
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    const each_array = ensure_array_like(blocks1);
    const each_array_1 = ensure_array_like(blocks2);
    const each_array_2 = ensure_array_like(blocks3);
    $$payload2.out += `<div class="navbar-row svelte-12fzeem"><div class="navbar svelte-12fzeem"><!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let block = each_array[$$index];
      $$payload2.out += `<div${attr_class("block svelte-12fzeem", void 0, {
        "black": block.isBlack,
        "blue": block.isBlue,
        "red": block.isRed
      })}></div>`;
    }
    $$payload2.out += `<!--]--></div> <div class="label-box svelte-12fzeem">Create</div> <div class="navbar svelte-12fzeem"><!--[-->`;
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let block = each_array_1[$$index_1];
      $$payload2.out += `<div${attr_class("block svelte-12fzeem", void 0, {
        "black": block.isBlack,
        "alt-blue": block.isBlue,
        "alt-red": block.isRed
      })}></div>`;
    }
    $$payload2.out += `<!--]--></div> <div class="label-box svelte-12fzeem">List</div> <div class="label-box svelte-12fzeem">Gallery</div> <div class="navbar svelte-12fzeem"><!--[-->`;
    for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
      let block = each_array_2[$$index_2];
      $$payload2.out += `<div${attr_class("block svelte-12fzeem", void 0, {
        "black": block.isBlack,
        "alt2-blue": block.isBlue,
        "alt2-red": block.isRed
      })}></div>`;
    }
    $$payload2.out += `<!--]--></div> <div class="menu-bar svelte-12fzeem">`;
    if (store_get($$store_subs ??= {}, "$user", user)) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="menu-block svelte-12fzeem" title="Notifications">🔔 `;
      if (store_get($$store_subs ??= {}, "$notificationStore", notificationStore).unreadCount > 0) {
        $$payload2.out += "<!--[-->";
        $$payload2.out += `<span class="badge svelte-12fzeem">${escape_html(store_get($$store_subs ??= {}, "$notificationStore", notificationStore).unreadCount)}</span>`;
      } else {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--></div> <div class="menu-block logout svelte-12fzeem" title="Logout"></div> <div class="menu-block avatar svelte-12fzeem" title="Profile"><div class="avatar-container svelte-12fzeem"><img${attr("src", store_get($$store_subs ??= {}, "$avatarUrl", avatarUrl))} alt="avatar" class="avatar-image svelte-12fzeem"></div></div>`;
    } else {
      $$payload2.out += "<!--[!-->";
      $$payload2.out += `<div class="menu-block login svelte-12fzeem" title="Login"></div> <div class="menu-block about svelte-12fzeem" title="About"></div>`;
    }
    $$payload2.out += `<!--]--></div></div> `;
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
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { session, onAuthToggle });
  pop();
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
  const derived2 = getter();
  if (setter) {
    return {
      [BoxSymbol]: true,
      [isWritableSymbol]: true,
      get current() {
        return derived2;
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
function _layout($$payload, $$props) {
  push();
  var $$store_subs;
  let { data, children } = $$props;
  const sessionStore = writable(data.session);
  const loading = writable(true);
  {
    loading.set(false);
  }
  async function handleAuthToggle() {
    if (store_get($$store_subs ??= {}, "$sessionStore", sessionStore)) {
      console.log("Initiating sign out");
      loading.set(true);
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        console.log("Signed out successfully");
      } catch (err) {
        console.error("Sign out failed:", err);
      } finally {
        loading.set(false);
      }
    }
  }
  head($$payload, ($$payload2) => {
    $$payload2.out += `<link rel="canonical" href="https://pexos.netlify.app"> <meta name="robots" content="index, follow"> <meta name="google-site-verification" content="fP4cuGw4wrszN9kcVbzYHTB8bKj4YSxHTyZDSGOvyPk"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta property="og:title" content="Pexos, collaborative creative platform"> <meta property="og:description" content="Log in and start creating."> <meta property="og:image" content="/logo192.png"> <meta property="og:url" content="https://pexos.netlify.app"> <meta property="og:type" content="website"> <meta name="twitter:card" content="summary_large_image"> <meta name="twitter:title" content="Pexos, collaborative creative platform"> <meta name="twitter:description" content="Log in and start creating."> <meta name="twitter:image" content="/logo192.png"> `;
    {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]-->`;
  });
  $$payload.out += `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TVHZWJGB" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript> `;
  Mode_watcher($$payload, {
    themeColors: { light: "#f0f0f0", dark: "#1a1a1a" }
  });
  $$payload.out += `<!----> `;
  if (store_get($$store_subs ??= {}, "$loading", loading)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div>Loading...</div>`;
  } else {
    $$payload.out += "<!--[!-->";
    NavBar($$payload, {
      session: store_get($$store_subs ??= {}, "$sessionStore", sessionStore),
      onAuthToggle: handleAuthToggle
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
