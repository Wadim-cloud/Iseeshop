import { E as ensure_array_like, F as attr, I as escape_html, N as store_get, P as unsubscribe_stores, J as bind_props, C as pop, z as push, T as fallback, S as spread_props, G as attr_class, M as head } from "../../../chunks/index.js";
import "../../../chunks/client.js";
import { w as writable } from "../../../chunks/exports.js";
import { F as Floating3DModel } from "../../../chunks/Floating3DModel.js";
import { s as supabase } from "../../../chunks/supabase.js";
const likesStore = writable({});
function GalleryGrid($$payload, $$props) {
  push();
  var $$store_subs;
  let drawings = $$props["drawings"];
  let onLike = $$props["onLike"];
  let onPreview = $$props["onPreview"];
  let on3DPreview = $$props["on3DPreview"];
  const placeholder = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjgiIGZpbGw9IiNjY2MiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkxvYWRpbmc8L3RleHQ+PC9zdmc+";
  const each_array = ensure_array_like(drawings);
  $$payload.out += `<div class="gallery-grid svelte-ttdz5z"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let drawing = each_array[$$index];
    $$payload.out += `<div class="gallery-item svelte-ttdz5z"><img${attr("src", placeholder)}${attr("data-src", drawing.image_data)}${attr("alt", `User drawing ${drawing.id}`)} class="gallery-image svelte-ttdz5z" loading="lazy"> <div class="gallery-meta svelte-ttdz5z"><div class="gallery-stats svelte-ttdz5z"><button class="like-button svelte-ttdz5z"><svg width="20" height="20" viewBox="0 0 24 24"${attr("fill", store_get($$store_subs ??= {}, "$likesStore", likesStore)[drawing.id] ? "#ff4757" : "none")} stroke="#333" class="svelte-ttdz5z"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg> <span>${escape_html(store_get($$store_subs ??= {}, "$likesStore", likesStore)[drawing.id] || drawing.likes)}</span></button></div> <div class="button-group svelte-ttdz5z"><button class="preview-button svelte-ttdz5z"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Preview</button> <button class="preview-button preview-3d svelte-ttdz5z"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M12 18a6 6 0 100-12 6 6 0 000 12z"></path><path d="M12 14a2 2 0 100-4 2 2 0 000 4z"></path></svg> 3D View</button></div></div></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { drawings, onLike, onPreview, on3DPreview });
  pop();
}
function TshirtPreviewModal($$payload, $$props) {
  push();
  let imageData = fallback($$props["imageData"], null);
  const modelConfig = {
    stlFile: "/models/tshirt.stl",
    defaultTextureImage: imageData || "/texture/boom.png",
    width: "100%",
    height: "400px",
    backgroundColor: "#f0f0f0",
    modelColor: "#cccccc",
    floating: true,
    rotationSpeedY: 0.5,
    autoRotate: true,
    enableZoom: true,
    initialZoom: 8,
    drawingData: imageData
    // This passes the gallery image to texture the model
  };
  $$payload.out += `<div class="modal-backdrop svelte-394hdl" tabindex="-1"><div class="modal-content svelte-394hdl"><button class="close-button svelte-394hdl" aria-label="Close preview"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button> <div class="model-container svelte-394hdl"><h2 class="svelte-394hdl">3D Preview</h2> `;
  if (imageData) {
    $$payload.out += "<!--[-->";
    Floating3DModel($$payload, spread_props([modelConfig]));
    $$payload.out += `<!----> <p class="tip svelte-394hdl">Tip: Use mouse wheel to zoom, click and drag to rotate</p>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<p class="error svelte-394hdl">Image data not available for preview</p>`;
  }
  $$payload.out += `<!--]--></div></div></div>`;
  bind_props($$props, { imageData });
  pop();
}
function GalleryView($$payload, $$props) {
  push();
  let drawings = $$props["drawings"];
  let loading = $$props["loading"];
  let error = $$props["error"];
  let selectedDrawing = $$props["selectedDrawing"];
  let selected3DDrawing = $$props["selected3DDrawing"];
  let onLike = $$props["onLike"];
  let onPreview = $$props["onPreview"];
  let on3DPreview = $$props["on3DPreview"];
  let onClosePreview = $$props["onClosePreview"];
  let onClose3DPreview = $$props["onClose3DPreview"];
  $$payload.out += `<div class="gallery-view svelte-1rpzm0c">`;
  if (loading) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="gallery-loading svelte-1rpzm0c"><div class="loading-spinner svelte-1rpzm0c"></div> <p class="svelte-1rpzm0c">Loading gallery items...</p></div>`;
  } else if (error) {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<div class="gallery-error svelte-1rpzm0c"><p class="svelte-1rpzm0c">Error: ${escape_html(error)}</p> <button class="svelte-1rpzm0c">Retry</button></div>`;
  } else if (drawings.length === 0) {
    $$payload.out += "<!--[2-->";
    $$payload.out += `<div class="gallery-empty svelte-1rpzm0c"><p class="svelte-1rpzm0c">No drawings found. Be the first to create one!</p></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    GalleryGrid($$payload, { drawings, onLike, onPreview, on3DPreview });
  }
  $$payload.out += `<!--]--> `;
  if (selectedDrawing) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="preview-modal svelte-1rpzm0c"><div class="preview-modal-content svelte-1rpzm0c"><button class="close-button svelte-1rpzm0c">×</button> <img${attr("src", selectedDrawing)} alt="Drawing preview" class="svelte-1rpzm0c"></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (selected3DDrawing) {
    $$payload.out += "<!--[-->";
    TshirtPreviewModal($$payload, { imageData: selected3DDrawing });
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, {
    drawings,
    loading,
    error,
    selectedDrawing,
    selected3DDrawing,
    onLike,
    onPreview,
    on3DPreview,
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
function GalleryContainer($$payload, $$props) {
  push();
  var $$store_subs;
  const drawings = writable([]);
  const error = writable(null);
  const loading = writable(false);
  const selectedDrawing = writable(null);
  const selected3DDrawing = writable(null);
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
  $$payload.out += `<div class="gallery-container svelte-1q9azse">`;
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
