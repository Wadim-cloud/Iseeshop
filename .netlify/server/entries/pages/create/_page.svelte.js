import { p as pop, a as push, j as fallback, d as attr_class, k as bind_props, e as ensure_array_like, i as attr_style, b as attr, g as stringify, f as escape_html, s as store_get, u as unsubscribe_stores, w as store_set, x as store_mutate } from "../../../chunks/index.js";
import { w as writable } from "../../../chunks/exports.js";
import { s as supabase } from "../../../chunks/supabase.js";
import "clsx";
import { o as onDestroy } from "../../../chunks/index-server.js";
/* empty css                                                         */
import { T as Toast } from "../../../chunks/Toast.js";
function CanvasShader($$payload, $$props) {
  push();
  let animationFrame;
  onDestroy(() => {
    cancelAnimationFrame(animationFrame);
  });
  $$payload.out += `<canvas class="shader svelte-kwfl0c"></canvas>`;
  pop();
}
function DrawingCanvas2($$payload, $$props) {
  push();
  let color = $$props["color"];
  let size = $$props["size"];
  let canvasStore = $$props["canvasStore"];
  let disabled = fallback($$props["disabled"], false);
  $$payload.out += `<canvas${attr_class("svelte-nqephp", void 0, { "disabled": disabled })}></canvas>`;
  bind_props($$props, { color, size, canvasStore, disabled });
  pop();
}
function DrawingControls($$payload, $$props) {
  push();
  let onSave = $$props["onSave"];
  let onMenuToggle = $$props["onMenuToggle"];
  let canvasStore = $$props["canvasStore"];
  let canvas = null;
  canvasStore.subscribe((state) => {
    canvas = state.canvas;
    console.log("Canvas updated in DrawingControls:", !!canvas);
  });
  $$payload.out += `<div class="controls svelte-yxtyn0"><button class="control-button svelte-yxtyn0" aria-label="Toggle menu"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-yxtyn0"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg></button> <button class="control-button svelte-yxtyn0" aria-label="Save drawing"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-yxtyn0"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg></button> <button class="control-button svelte-yxtyn0" aria-label="Go back"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-yxtyn0"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button></div>`;
  bind_props($$props, { onSave, onMenuToggle, canvasStore });
  pop();
}
function DrawingMenu($$payload, $$props) {
  push();
  let colors = $$props["colors"];
  let selected = $$props["selected"];
  let size = $$props["size"];
  let onColorChange = $$props["onColorChange"];
  let onSizeChange = $$props["onSizeChange"];
  const each_array = ensure_array_like(colors);
  $$payload.out += `<div class="menu svelte-lhy0b3"><div class="section svelte-lhy0b3"><h3 class="section-title svelte-lhy0b3">Colors</h3> <div class="color-grid svelte-lhy0b3"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let color = each_array[$$index];
    $$payload.out += `<button${attr_class("color-button svelte-lhy0b3", void 0, { "selected": selected === color })}${attr_style(`background-color: ${stringify(color)}`)}${attr("aria-label", color)}></button>`;
  }
  $$payload.out += `<!--]--></div></div> <div class="section svelte-lhy0b3"><h3 class="section-title svelte-lhy0b3">Brush Size</h3> <div class="slider-container svelte-lhy0b3"><input type="range" min="1" max="50"${attr("value", size)}${attr_style(`--thumb-color: ${stringify(selected)}`)} class="size-slider svelte-lhy0b3"> <span class="size-value svelte-lhy0b3"${attr_style(`color: ${stringify(selected)}`)}>${escape_html(size)}px</span></div></div> <div class="section svelte-lhy0b3"><button class="advanced-toggle svelte-lhy0b3">${escape_html("Show Advanced")}</button> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div></div>`;
  bind_props($$props, {
    colors,
    selected,
    size,
    onColorChange,
    onSizeChange
  });
  pop();
}
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let data = $$props["data"];
  const sessionStore = writable(data.session);
  const loading = writable(true);
  const error = writable(null);
  const canvasStore = writable({ canvas: null });
  const toastState = writable({ message: "", visible: false, type: "success" });
  const COLORS = ["red", "green", "blue", "black", "white"];
  const INITIAL_COLOR = "black";
  const INITIAL_SIZE = 10;
  const TOAST_DURATION = 3e3;
  let color = INITIAL_COLOR;
  let size = INITIAL_SIZE;
  let showMenu = false;
  let selected = INITIAL_COLOR;
  let toastTimeout;
  const getEmailPrefix = (email) => email.split("@")[0] || "user";
  async function getDrawingCount(userId) {
    try {
      const { count, error: error2 } = await supabase.from("drawings").select("*", { count: "exact", head: true }).eq("user_id", userId);
      if (error2) throw error2;
      return count || 0;
    } catch (err) {
      store_set(error, "Failed to fetch drawing count");
      return 0;
    }
  }
  async function generateDrawingId(email, userId) {
    const prefix = getEmailPrefix(email);
    const count = await getDrawingCount(userId) + 1;
    return `${prefix}-${count}`;
  }
  async function saveDrawing(canvas) {
    if (!canvas) return showToast("No canvas found", "error");
    if (!store_get($$store_subs ??= {}, "$sessionStore", sessionStore)?.user) return showToast("Please log in to save drawings", "error");
    store_set(loading, true);
    try {
      await verifyRateLimits();
      const drawingId = await persistDrawing(canvas);
      await triggerNotification(drawingId);
      showToast("Drawing saved successfully!", "success");
    } catch (err) {
      handlePersistError(err);
    } finally {
      store_set(loading, false);
    }
  }
  async function verifyRateLimits() {
    const response = await fetch("/api/check-rate-limit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: store_get($$store_subs ??= {}, "$sessionStore", sessionStore)?.user.id
      })
    });
    if (!response.ok) throw new Error("Rate limit service unavailable");
    const result = await response.json();
    if (result.blocked) throw new Error(result.message || "You are temporarily banned");
    if (result.limited) showToast(result.message || "Approaching submission limit", "warning");
  }
  async function persistDrawing(canvas) {
    const imageData = canvas.toDataURL("image/png");
    const createdAt = (/* @__PURE__ */ new Date()).toISOString();
    const drawingId = await generateDrawingId(store_get($$store_subs ??= {}, "$sessionStore", sessionStore).user.email, store_get($$store_subs ??= {}, "$sessionStore", sessionStore).user.id);
    const { error: error2 } = await supabase.from("drawings").insert({
      id: crypto.randomUUID(),
      drawing_id: drawingId,
      title: "Untitled",
      image_data: imageData,
      user_id: store_get($$store_subs ??= {}, "$sessionStore", sessionStore).user.id,
      user_email: store_get($$store_subs ??= {}, "$sessionStore", sessionStore).user.email,
      created_at: createdAt,
      blocked: false,
      likes: 0,
      comments: {}
    });
    if (error2) throw new Error("Failed to persist drawing");
    return drawingId;
  }
  async function triggerNotification(drawingId) {
    try {
      const serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhYXB6dnNucnpzdWh0b3dtaWh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzI2MzQ4MywiZXhwIjoyMDQ4ODM5NDgzfQ.ucVyxw_m53i9H12zFVIe6tbX5a-qWp1Fbr8u2HFrli8";
      if (!serviceKey) ;
      const response = await fetch("https://paapzvsnrzsuhtowmihz.supabase.co/functions/v1/send-push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${serviceKey}`
        },
        body: JSON.stringify({
          title: "New Drawing Added!",
          body: `Your drawing '${drawingId}' was saved!`,
          record: {
            id: drawingId,
            user_id: store_get($$store_subs ??= {}, "$sessionStore", sessionStore).user.id,
            user_email: store_get($$store_subs ??= {}, "$sessionStore", sessionStore).user.email
          }
        })
      });
      if (!response.ok) {
        const result = await response.json();
        console.error("Notification failed:", result);
      } else {
        console.log("Notification sent successfully.");
      }
    } catch (err) {
      console.error("Error triggering notification:", err);
    }
  }
  function handlePersistError(error2) {
    const message = error2 instanceof Error ? error2.message : "Failed to save drawing";
    showToast(message, "error");
  }
  function showToast(message, type) {
    clearTimeout(toastTimeout);
    store_set(toastState, { message, visible: true, type });
    toastTimeout = setTimeout(
      () => {
        store_mutate($$store_subs ??= {}, "$toastState", toastState, store_get($$store_subs ??= {}, "$toastState", toastState).visible = false);
      },
      TOAST_DURATION
    );
  }
  function updateColor(newColor) {
    selected = color = newColor;
  }
  function updateSize(newSize) {
    size = Math.max(1, Math.min(50, newSize));
  }
  function toggleMenu() {
    showMenu = !showMenu;
  }
  if (store_get($$store_subs ??= {}, "$loading", loading)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p>Loading...</p>`;
  } else if (store_get($$store_subs ??= {}, "$error", error)) {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<p>Error: ${escape_html(store_get($$store_subs ??= {}, "$error", error))}</p>`;
  } else if (store_get($$store_subs ??= {}, "$sessionStore", sessionStore)) {
    $$payload.out += "<!--[2-->";
    DrawingCanvas2($$payload, { color, size, canvasStore });
    $$payload.out += `<!----> `;
    DrawingControls($$payload, {
      canvasStore,
      onSave: saveDrawing,
      onMenuToggle: toggleMenu
    });
    $$payload.out += `<!----> `;
    if (showMenu) {
      $$payload.out += "<!--[-->";
      DrawingMenu($$payload, {
        colors: COLORS,
        selected,
        size,
        onColorChange: updateColor,
        onSizeChange: updateSize
      });
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  } else {
    $$payload.out += "<!--[!-->";
    CanvasShader($$payload);
  }
  $$payload.out += `<!--]--> `;
  Toast($$payload, {
    message: store_get($$store_subs ??= {}, "$toastState", toastState).message,
    show: store_get($$store_subs ??= {}, "$toastState", toastState).visible,
    type: store_get($$store_subs ??= {}, "$toastState", toastState).type
  });
  $$payload.out += `<!---->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
