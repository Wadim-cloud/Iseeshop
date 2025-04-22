import { I as escape_html, E as ensure_array_like, F as attr, G as attr_class, V as stringify, J as bind_props, C as pop, z as push, N as store_get, P as unsubscribe_stores, S as fallback, M as head } from "../../../chunks/index.js";
import "../../../chunks/client.js";
import { c as cartStore, a as cartSize, l as likesStore } from "../../../chunks/stores.js";
import { s as supabase } from "../../../chunks/supabase.js";
import { w as writable } from "../../../chunks/exports.js";
function GalleryView($$payload, $$props) {
  push();
  var $$store_subs;
  let drawings = $$props["drawings"];
  let onLike = $$props["onLike"];
  let onPreview = $$props["onPreview"];
  let on3DPreview = $$props["on3DPreview"];
  let loading = $$props["loading"];
  let error = $$props["error"];
  let selectedDrawing = $$props["selectedDrawing"];
  let selected3DDrawing = $$props["selected3DDrawing"];
  let onClosePreview = $$props["onClosePreview"];
  let onClose3DPreview = $$props["onClose3DPreview"];
  const placeholder = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjgiIGZpbGw9IiNjY2MiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkxvYWRpbmc8L3RleHQ+PC9zdmc+";
  function isInCart(drawingId) {
    return store_get($$store_subs ??= {}, "$cartStore", cartStore).some((item) => item.drawingId === drawingId);
  }
  $$payload.out += `<div class="gallery-wrapper svelte-9n3om3">`;
  if (loading) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="loading svelte-9n3om3">Loading gallery...</div>`;
  } else if (error) {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<div class="error svelte-9n3om3">${escape_html(error)}</div>`;
  } else if (drawings.length === 0) {
    $$payload.out += "<!--[2-->";
    $$payload.out += `<div class="no-content svelte-9n3om3">No drawings available.</div>`;
  } else {
    $$payload.out += "<!--[!-->";
    const each_array = ensure_array_like(drawings);
    $$payload.out += `<div class="gallery-grid svelte-9n3om3"><!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let drawing = each_array[$$index];
      $$payload.out += `<div class="gallery-item svelte-9n3om3"><img${attr("src", placeholder)}${attr("data-src", drawing.image_data)}${attr("alt", `User drawing ${drawing.id}`)} class="gallery-image svelte-9n3om3" loading="lazy"> <div class="gallery-meta svelte-9n3om3"><div class="gallery-stats svelte-9n3om3"><button class="like-button svelte-9n3om3"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" class="svelte-9n3om3"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg> <span>${escape_html(drawing.likes || 0)}</span></button></div> <div class="button-group svelte-9n3om3"><button class="preview-button svelte-9n3om3"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Preview</button> <button class="preview-button preview-3d svelte-9n3om3"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M12 18a6 6 0 100-12 6 6 0 000 12z"></path><path d="M12 14a2 2 0 100-4 2 2 0 000 4z"></path></svg> 3D View</button> <button${attr_class(`cart-button ${stringify(isInCart(drawing.id) ? "in-cart" : "")}`, "svelte-9n3om3")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333">`;
      if (isInCart(drawing.id)) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<path d="M9 20a1 1 0 100-2 1 1 0 000 2z" fill="#4CAF50"></path><path d="M20 20a1 1 0 100-2 1 1 0 000 2z" fill="#4CAF50"></path><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" stroke="#4CAF50"></path>`;
      } else {
        $$payload.out += "<!--[!-->";
        $$payload.out += `<path d="M9 20a1 1 0 100-2 1 1 0 000 2z"></path><path d="M20 20a1 1 0 100-2 1 1 0 000 2z"></path><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"></path>`;
      }
      $$payload.out += `<!--]--></svg> ${escape_html(isInCart(drawing.id) ? "Remove" : "Add to Cart")}</button></div></div></div>`;
    }
    $$payload.out += `<!--]--></div>`;
  }
  $$payload.out += `<!--]--> `;
  if (selectedDrawing) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="modal svelte-9n3om3"><div class="modal-content svelte-9n3om3"><img${attr("src", selectedDrawing)} alt="Drawing preview" class="svelte-9n3om3"> <button class="close-button svelte-9n3om3">×</button></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (selected3DDrawing) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="modal svelte-9n3om3"><div class="modal-content modal-3d svelte-9n3om3"><div class="preview-3d-container svelte-9n3om3"><div class="preview-3d-placeholder svelte-9n3om3"><img${attr("src", selected3DDrawing)} alt="3D preview" class="preview-texture svelte-9n3om3"> <div class="preview-3d-object svelte-9n3om3"><span>3D Preview</span></div></div></div> <button class="close-button svelte-9n3om3">×</button></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    drawings,
    onLike,
    onPreview,
    on3DPreview,
    loading,
    error,
    selectedDrawing,
    selected3DDrawing,
    onClosePreview,
    onClose3DPreview
  });
  pop();
}
function Pagination($$payload, $$props) {
  push();
  let currentPage = fallback($$props["currentPage"], 1);
  let totalPages = fallback($$props["totalPages"], 1);
  $$payload.out += `<nav class="pagination svelte-rc3ooi"><button${attr("disabled", currentPage === 1, true)} aria-label="Previous Page" class="svelte-rc3ooi">◀ Prev</button> `;
  if (totalPages <= 7) {
    $$payload.out += "<!--[-->";
    const each_array = ensure_array_like(Array(totalPages));
    $$payload.out += `<!--[-->`;
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      each_array[i];
      $$payload.out += `<button${attr_class("svelte-rc3ooi", void 0, { "selected": i + 1 === currentPage })}>${escape_html(i + 1)}</button>`;
    }
    $$payload.out += `<!--]-->`;
  } else {
    $$payload.out += "<!--[!-->";
    const each_array_1 = ensure_array_like([
      1,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      totalPages
    ]);
    $$payload.out += `<!--[-->`;
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let page = each_array_1[$$index_1];
      if (page > 0 && page <= totalPages) {
        $$payload.out += "<!--[-->";
        if (page !== currentPage - 2 && page !== currentPage + 2) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<button${attr_class("svelte-rc3ooi", void 0, { "selected": page === currentPage })}>${escape_html(page)}</button>`;
        } else {
          $$payload.out += "<!--[!-->";
          $$payload.out += `<span class="svelte-rc3ooi">…</span>`;
        }
        $$payload.out += `<!--]-->`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]-->`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--> <button${attr("disabled", currentPage === totalPages, true)} aria-label="Next Page" class="svelte-rc3ooi">Next ▶</button></nav>`;
  bind_props($$props, { currentPage, totalPages });
  pop();
}
function GalleryControls($$payload, $$props) {
  push();
  let currentPage = $$props["currentPage"];
  let totalPages = $$props["totalPages"];
  let onPageChange = $$props["onPageChange"];
  if (totalPages > 1) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="gallery-controls svelte-19aqbvt">`;
    Pagination($$payload, { currentPage, totalPages });
    $$payload.out += `<!----></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { currentPage, totalPages, onPageChange });
  pop();
}
function ShoppingCart($$payload, $$props) {
  push();
  var $$store_subs;
  let showCart = fallback($$props["showCart"], false);
  $$payload.out += `<div class="cart-container svelte-13mh0ai"><button class="cart-button svelte-13mh0ai"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg> `;
  if (store_get($$store_subs ??= {}, "$cartSize", cartSize) > 0) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<span class="cart-badge svelte-13mh0ai">${escape_html(store_get($$store_subs ??= {}, "$cartSize", cartSize))}</span>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></button> `;
  if (showCart) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="cart-panel svelte-13mh0ai"><div class="cart-header svelte-13mh0ai"><h3 class="svelte-13mh0ai">Your Cart (${escape_html(store_get($$store_subs ??= {}, "$cartSize", cartSize))})</h3> <button class="close-button svelte-13mh0ai">×</button></div> `;
    if (store_get($$store_subs ??= {}, "$cartSize", cartSize) === 0) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="empty-cart svelte-13mh0ai"><p>Your cart is empty</p> <p class="empty-caption svelte-13mh0ai">Add drawings to create custom 3D objects</p></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$cartStore", cartStore));
      $$payload.out += `<div class="cart-items svelte-13mh0ai"><!--[-->`;
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let item = each_array[$$index];
        $$payload.out += `<div class="cart-item svelte-13mh0ai"><img${attr("src", item.imageData)} alt="Drawing preview" class="cart-thumbnail svelte-13mh0ai"> <button class="remove-button svelte-13mh0ai"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12"></path></svg></button></div>`;
      }
      $$payload.out += `<!--]--></div> <div class="cart-footer svelte-13mh0ai"><button class="clear-button svelte-13mh0ai">Clear All</button> <button class="checkout-button svelte-13mh0ai">Checkout (${escape_html(store_get($$store_subs ??= {}, "$cartSize", cartSize))}) <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M12 5l7 7-7 7"></path></svg></button></div>`;
    }
    $$payload.out += `<!--]--></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { showCart });
  pop();
}
function GalleryContainer($$payload, $$props) {
  push();
  var $$store_subs;
  const drawings = writable([]);
  const error = writable(null);
  const loading = writable(false);
  const selectedDrawing = writable(null);
  const selected3DDrawing = writable(null);
  const showCart = writable(false);
  const pagination = writable({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 40
  });
  async function fetchDrawings(page) {
    loading.set(true);
    error.set(null);
    const { currentPage, itemsPerPage } = store_get($$store_subs ??= {}, "$pagination", pagination);
    const offset = (page - 1) * itemsPerPage;
    try {
      const { data, count, error: fetchError } = await supabase.from("drawings").select("id, image_data, likes, created_at", { count: "exact" }).order("created_at", { ascending: false }).range(offset, offset + itemsPerPage - 1);
      if (fetchError) throw fetchError;
      drawings.set(data || []);
      pagination.update((p) => ({
        ...p,
        currentPage: page,
        totalPages: Math.ceil((count || 0) / itemsPerPage)
      }));
      likesStore.update((current) => {
        const newLikes = { ...current };
        data?.forEach((drawing) => newLikes[drawing.id] = drawing.likes);
        return newLikes;
      });
    } catch (err) {
      error.set(err instanceof Error ? err.message : "Failed to load drawings");
      console.error("Gallery error:", err);
    } finally {
      loading.set(false);
    }
  }
  async function handleLike(drawingId) {
    likesStore.update((current) => {
      const newLikes = { ...current };
      newLikes[drawingId] = (newLikes[drawingId] || 0) + 1;
      return newLikes;
    });
    try {
      await supabase.from("drawings").update({
        likes: store_get($$store_subs ??= {}, "$likesStore", likesStore)[drawingId]
      }).eq("id", drawingId);
    } catch (err) {
      console.error("Like update failed:", err);
      likesStore.update((current) => {
        const newLikes = { ...current };
        newLikes[drawingId] = (newLikes[drawingId] || 1) - 1;
        return newLikes;
      });
    }
  }
  fetchDrawings(1);
  $$payload.out += `<div class="gallery-container svelte-np1y62">`;
  GalleryView($$payload, {
    drawings: store_get($$store_subs ??= {}, "$drawings", drawings),
    loading: store_get($$store_subs ??= {}, "$loading", loading),
    error: store_get($$store_subs ??= {}, "$error", error),
    selectedDrawing: store_get($$store_subs ??= {}, "$selectedDrawing", selectedDrawing),
    selected3DDrawing: store_get($$store_subs ??= {}, "$selected3DDrawing", selected3DDrawing),
    onLike: handleLike,
    onPreview: (img) => selectedDrawing.set(img),
    on3DPreview: (img) => selected3DDrawing.set(img),
    onClosePreview: () => selectedDrawing.set(null),
    onClose3DPreview: () => selected3DDrawing.set(null)
  });
  $$payload.out += `<!----> `;
  GalleryControls($$payload, {
    currentPage: store_get($$store_subs ??= {}, "$pagination", pagination).currentPage,
    totalPages: store_get($$store_subs ??= {}, "$pagination", pagination).totalPages,
    onPageChange: fetchDrawings
  });
  $$payload.out += `<!----> `;
  ShoppingCart($$payload, {
    showCart: store_get($$store_subs ??= {}, "$showCart", showCart)
  });
  $$payload.out += `<!----></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function _page($$payload) {
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Gallery | Pexos</title>`;
    $$payload2.out += `<meta name="description" content="Browse community creations">`;
  });
  GalleryContainer($$payload);
}
export {
  _page as default
};
