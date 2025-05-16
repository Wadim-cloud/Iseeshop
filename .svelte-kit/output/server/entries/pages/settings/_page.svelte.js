import { q as fallback, f as attr_class, d as escape_html, t as bind_props, s as store_get, e as ensure_array_like, b as attr, u as unsubscribe_stores, p as pop, a as push } from "../../../chunks/index.js";
import { o as onDestroy } from "../../../chunks/index-server.js";
import { c as cleanupSubscriptions, n as notificationStore } from "../../../chunks/notifications.js";
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
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let notifications, role, loading, error, success, toast;
  onDestroy(() => {
    console.log("onDestroy: Cleaning up subscriptions");
    cleanupSubscriptions();
  });
  ({
    notifications,
    role,
    loading,
    error,
    success,
    toast
  } = store_get($$store_subs ??= {}, "$notificationStore", notificationStore));
  $$payload.out += `<main class="svelte-1ovrh0x"><div class="settings-card svelte-1ovrh0x"><h1 class="svelte-1ovrh0x">Notification Settings</h1> `;
  if (loading) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="loading svelte-1ovrh0x"><span class="spinner svelte-1ovrh0x"></span> <span>Loading...</span></div>`;
  } else if (error) {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<p class="alert alert-error svelte-1ovrh0x">${escape_html(error)}</p>`;
  } else if (success) {
    $$payload.out += "<!--[2-->";
    $$payload.out += `<p class="alert alert-success svelte-1ovrh0x">${escape_html(success)}</p>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (!loading && !error) {
    $$payload.out += "<!--[-->";
    const each_array = ensure_array_like(Object.entries(notifications));
    $$payload.out += `<form class="svelte-1ovrh0x"><!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let [type, enabled] = each_array[$$index];
      $$payload.out += `<div class="toggle-group svelte-1ovrh0x"><span class="toggle-label svelte-1ovrh0x">Notify me about ${escape_html(type.replace("_", " "))}</span> <label class="toggle-switch svelte-1ovrh0x"${attr("for", type)}><input type="checkbox"${attr("id", type)}${attr("checked", notifications[type], true)}${attr("aria-label", `Toggle notifications for ${type.replace("_", " ")}`)} class="svelte-1ovrh0x"> <span class="slider svelte-1ovrh0x"><span class="toggle-text svelte-1ovrh0x">${escape_html(notifications[type] ? "On" : "Off")}</span></span></label></div>`;
    }
    $$payload.out += `<!--]--> `;
    if (Object.values(notifications).every((enabled) => !enabled)) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<p class="warning svelte-1ovrh0x">Disabling all notifications will stop push notifications.</p>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <p class="role svelte-1ovrh0x">Role: <span class="svelte-1ovrh0x">${escape_html(role || "Not set")}</span></p> <button type="submit"${attr("disabled", loading, true)} class="svelte-1ovrh0x">${escape_html(loading ? "Saving..." : "Save Settings")}</button></form>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div></main> `;
  Toast($$payload, {
    message: toast.message,
    show: toast.show,
    type: toast.type
  });
  $$payload.out += `<!---->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
