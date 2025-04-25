import { K as attr, P as escape_html, I as attr_class, J as store_get, T as stringify, M as unsubscribe_stores, F as bind_props, C as pop, z as push, S as attr_style, Q as fallback, D as copy_payload, E as assign_payload, G as ensure_array_like, N as head } from "../../../chunks/index.js";
import "../../../chunks/client.js";
import { c as cartStore, l as likesStore, a as cartSize } from "../../../chunks/GalleryContainer.svelte_svelte_type_style_lang.js";
import { o as onDestroy } from "../../../chunks/index-server.js";
import * as THREE from "three";
import { s as supabase } from "../../../chunks/supabase.js";
import { u as user } from "../../../chunks/auth.js";
/* empty css                                                      */
import { w as writable } from "../../../chunks/exports.js";
function GalleryView($$payload, $$props) {
  push();
  var $$store_subs;
  let drawing = $$props["drawing"];
  let onLike = $$props["onLike"];
  let onPreview = $$props["onPreview"];
  let on3DPreview = $$props["on3DPreview"];
  let onOpenComments = $$props["onOpenComments"];
  let likedStates = {};
  const placeholder = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjgiIGZpbGw9IiNjY2MiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkxvYWRpbmc8L3RleHQ+PC9zdmc+";
  function isInCart(drawingId) {
    return store_get($$store_subs ??= {}, "$cartStore", cartStore).some((item) => item.drawingId === drawingId);
  }
  $$payload.out += `<div class="gallery-item svelte-99e3yd"><img${attr("src", placeholder)}${attr("data-src", drawing.image_data)}${attr("alt", `User drawing ${drawing.drawing_id}`)} class="gallery-image svelte-99e3yd" loading="lazy"> <div class="gallery-meta svelte-99e3yd"><div class="gallery-stats svelte-99e3yd"><button class="like-button svelte-99e3yd"><svg width="20" height="20" viewBox="0 0 24 24"${attr("fill", likedStates[drawing.drawing_id] ? "#ff4757" : "none")} stroke="#333" class="svelte-99e3yd"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg> <span>${escape_html(store_get($$store_subs ??= {}, "$likesStore", likesStore)[drawing.drawing_id] || drawing.likes || 0)}</span></button></div> <div class="drawing-card svelte-99e3yd"><h3 class="svelte-99e3yd">${escape_html(drawing.drawing_id)}</h3> <p class="svelte-99e3yd">Created: ${escape_html(new Date(drawing.created_at).toLocaleDateString())}</p> <button class="svelte-99e3yd">View Comments (${escape_html((drawing.comments || []).length)})</button></div> <div class="button-group svelte-99e3yd"><button class="preview-button svelte-99e3yd"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Preview</button> <button class="preview-button preview-3d svelte-99e3yd"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M12 18a6 6 0 100-12 6 6 0 000 12z"></path><path d="M12 14a2 2 0 100-4 2 2 0 000 4z"></path></svg> 3D View</button> <button${attr_class(`cart-button ${stringify(isInCart(drawing.drawing_id) ? "in-cart" : "")}`, "svelte-99e3yd")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333">`;
  if (isInCart(drawing.drawing_id)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<path d="M9 20a1 1 0 100-2 1 1 0 000 2z" fill="#4CAF50"></path><path d="M20 20a1 1 0 100-2 1 1 0 000 2z" fill="#4CAF50"></path><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" stroke="#4CAF50"></path>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<path d="M9 20a1 1 0 100-2 1 1 0 000 2z"></path><path d="M20 20a1 1 0 100-2 1 1 0 000 2z"></path><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"></path>`;
  }
  $$payload.out += `<!--]--></svg> ${escape_html(isInCart(drawing.drawing_id) ? "Remove" : "Add to Cart")}</button> <button class="preview-button comments-button svelte-99e3yd"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path></svg> Comments (${escape_html(drawing.comments?.length || 0)})</button></div></div></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    drawing,
    onLike,
    onPreview,
    on3DPreview,
    onOpenComments
  });
  pop();
}
function PreviewModal($$payload, $$props) {
  push();
  let imageData = $$props["imageData"];
  let onClose = $$props["onClose"];
  let zoomLevel = 1;
  if (imageData) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="preview-modal svelte-1impoal" role="dialog" aria-modal="true" aria-label="Drawing preview"><div class="preview-content svelte-1impoal"><button class="close-button svelte-1impoal" aria-label="Close preview"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>  <div class="controls svelte-1impoal"><button aria-label="Zoom out" class="svelte-1impoal"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="7" y1="11" x2="15" y2="11"></line></svg></button> <button aria-label="Zoom in" class="svelte-1impoal"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="11" y1="7" x2="11" y2="15"></line><line x1="7" y1="11" x2="15" y2="11"></line></svg></button></div> <div class="image-container svelte-1impoal"><img${attr("src", imageData)} alt="Drawing preview"${attr_style(`transform: scale(${stringify(zoomLevel)});`)} class="svelte-1impoal"></div></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { imageData, onClose });
  pop();
}
function Tshirt($$payload, $$props) {
  push();
  let drawingData = $$props["drawingData"];
  let zoomLevel = fallback($$props["zoomLevel"], 1);
  let renderer;
  let model;
  let textureLoading = false;
  let textureError = false;
  onDestroy(() => {
  });
  if (drawingData && model) {
    textureLoading = true;
    const textureLoader = new THREE.TextureLoader();
    console.log("Reactive texture update for drawingData:", drawingData);
    textureLoader.load(
      drawingData,
      (texture) => {
        console.log("Texture updated successfully");
        texture.flipY = false;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        const material = new THREE.MeshPhongMaterial({
          map: texture,
          color: 16777215,
          specular: 1118481,
          shininess: 30
        });
        model.material = material;
        model.material.needsUpdate = true;
        textureLoading = false;
      },
      (progress) => {
        console.log("Texture update progress:", progress.loaded / progress.total);
      },
      (err) => {
        console.error("Texture update error:", err);
        textureError = true;
        textureLoading = false;
        model.material = new THREE.MeshPhongMaterial({ color: 16777215 });
        model.material.needsUpdate = true;
      }
    );
  }
  $$payload.out += `<div class="model-container svelte-1hfv2po">`;
  if (textureLoading) {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<p class="loading-message svelte-1hfv2po">Loading texture...</p>`;
  } else if (textureError) {
    $$payload.out += "<!--[2-->";
    $$payload.out += `<p class="error-message svelte-1hfv2po">Error loading texture.</p>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { drawingData, zoomLevel });
  pop();
}
function TshirtPreviewModal($$payload, $$props) {
  push();
  let imageData = $$props["imageData"];
  let onClose = $$props["onClose"];
  let zoomLevel = 1;
  if (imageData) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="preview-modal svelte-kvavg0" role="dialog" aria-modal="true" aria-label="3D T-shirt preview"><div class="preview-content svelte-kvavg0"><button class="close-button svelte-kvavg0" aria-label="Close preview"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button> <div class="controls svelte-kvavg0"><button aria-label="Zoom out" class="svelte-kvavg0"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="7" y1="11" x2="15" y2="11"></line></svg></button> <button aria-label="Zoom in" class="svelte-kvavg0"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="11" y1="7" x2="11" y2="15"></line><line x1="7" y1="11" x2="15" y2="11"></line></svg></button></div> <div class="model-container svelte-kvavg0">`;
    Tshirt($$payload, { drawingData: imageData, zoomLevel });
    $$payload.out += `<!----></div></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { imageData, onClose });
  pop();
}
function CommentsModal($$payload, $$props) {
  push();
  var $$store_subs;
  let id = $$props["id"];
  let drawing_id = $$props["drawing_id"];
  let onClose = $$props["onClose"];
  let comments = [];
  let newComment = "";
  let loading = false;
  let error = null;
  if (!id || !drawing_id) {
    error = "Invalid drawing ID or UUID";
    console.error("CommentsModal mounted with invalid props:", { id, drawing_id });
  } else {
    console.log("CommentsModal mounted with props:", {
      id,
      drawing_id,
      idLength: id?.length,
      userId: store_get($$store_subs ??= {}, "$user", user)?.id,
      userEmail: store_get($$store_subs ??= {}, "$user", user)?.email
    });
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<div class="modal-overlay svelte-10mb2nl"><div class="modal-content svelte-10mb2nl"><button class="close-button svelte-10mb2nl">×</button> <h2 class="svelte-10mb2nl">Comments for Drawing #${escape_html(drawing_id || "Unknown")}</h2> `;
    if (error) {
      $$payload2.out += "<!--[1-->";
      $$payload2.out += `<p class="error svelte-10mb2nl">${escape_html(error)}</p> <button class="retry-button svelte-10mb2nl">Retry</button>`;
    } else if (comments.length === 0) {
      $$payload2.out += "<!--[2-->";
      $$payload2.out += `<p>No comments yet. Be the first to comment!</p>`;
    } else {
      $$payload2.out += "<!--[!-->";
      const each_array = ensure_array_like(comments);
      $$payload2.out += `<div class="comments-list svelte-10mb2nl"><!--[-->`;
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let comment = each_array[$$index];
        $$payload2.out += `<div class="comment svelte-10mb2nl"><p class="svelte-10mb2nl"><strong class="username svelte-10mb2nl">${escape_html(comment.display_name || "User")}</strong>: ${escape_html(comment.content)}</p> <small class="svelte-10mb2nl">${escape_html(new Date(comment.created_at).toLocaleString())}</small></div>`;
      }
      $$payload2.out += `<!--]--></div>`;
    }
    $$payload2.out += `<!--]--> `;
    if (store_get($$store_subs ??= {}, "$user", user)) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="comment-form svelte-10mb2nl"><textarea placeholder="Add a comment..." rows="4"${attr("disabled", loading, true)} class="svelte-10mb2nl">`;
      const $$body = escape_html(newComment);
      if ($$body) {
        $$payload2.out += `${$$body}`;
      }
      $$payload2.out += `</textarea> <button class="comment-button svelte-10mb2nl"${attr("disabled", !newComment.trim(), true)}>Post Comment</button></div>`;
    } else {
      $$payload2.out += "<!--[!-->";
      $$payload2.out += `<p>Please <button class="link-button svelte-10mb2nl">log in</button> to post a comment.</p>`;
    }
    $$payload2.out += `<!--]--></div></div> `;
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
  bind_props($$props, { id, drawing_id, onClose });
  pop();
}
function GalleryGrid($$payload, $$props) {
  push();
  var $$store_subs;
  let drawings = $$props["drawings"];
  let loading = $$props["loading"];
  let error = $$props["error"];
  let onLike = $$props["onLike"];
  let onPageChange = $$props["onPageChange"];
  const selectedDrawing = writable(null);
  const selected3DDrawing = writable(null);
  let selectedDrawingId = null;
  let selectedDrawingPublicId = null;
  function handlePreview(img) {
    console.log("GalleryGrid handlePreview setting selectedDrawing:", img);
    selectedDrawing.set(img);
  }
  function handleClosePreview() {
    console.log("GalleryGrid handleClosePreview resetting selectedDrawing");
    selectedDrawing.set(null);
  }
  function handle3DPreview(img) {
    console.log("GalleryGrid handle3DPreview setting selected3DDrawing:", img);
    selected3DDrawing.set(img);
  }
  function handleClose3DPreview() {
    console.log("GalleryGrid handleClose3DPreview resetting selected3DDrawing");
    selected3DDrawing.set(null);
  }
  function handleOpenComments(drawingId, drawingUuid) {
    console.log("GalleryGrid handleOpenComments setting IDs:", { drawingId, drawingUuid });
    selectedDrawingId = drawingUuid;
    selectedDrawingPublicId = drawingId;
  }
  function handleCloseComments() {
    console.log("GalleryGrid handleCloseComments resetting IDs");
    selectedDrawingId = null;
    selectedDrawingPublicId = null;
  }
  $$payload.out += `<div class="gallery-wrapper svelte-9bc2at">`;
  if (loading) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="loading svelte-9bc2at">Loading gallery...</div>`;
  } else if (error) {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<div class="error svelte-9bc2at">${escape_html(error)}</div>`;
  } else if (drawings.length === 0) {
    $$payload.out += "<!--[2-->";
    $$payload.out += `<div class="no-content svelte-9bc2at">No drawings available.</div>`;
  } else {
    $$payload.out += "<!--[!-->";
    const each_array = ensure_array_like(drawings);
    $$payload.out += `<div class="gallery-grid svelte-9bc2at"><!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let drawing = each_array[$$index];
      GalleryView($$payload, {
        drawing,
        onLike,
        onPreview: handlePreview,
        on3DPreview: handle3DPreview,
        onOpenComments: handleOpenComments
      });
    }
    $$payload.out += `<!--]--></div>`;
  }
  $$payload.out += `<!--]--> `;
  if (store_get($$store_subs ??= {}, "$selectedDrawing", selectedDrawing)) {
    $$payload.out += "<!--[-->";
    PreviewModal($$payload, {
      imageData: store_get($$store_subs ??= {}, "$selectedDrawing", selectedDrawing),
      onClose: handleClosePreview
    });
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (store_get($$store_subs ??= {}, "$selected3DDrawing", selected3DDrawing)) {
    $$payload.out += "<!--[-->";
    TshirtPreviewModal($$payload, {
      imageData: store_get($$store_subs ??= {}, "$selected3DDrawing", selected3DDrawing),
      onClose: handleClose3DPreview
    });
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (selectedDrawingId && selectedDrawingPublicId) {
    $$payload.out += "<!--[-->";
    CommentsModal($$payload, {
      id: selectedDrawingId,
      drawing_id: selectedDrawingPublicId,
      onClose: handleCloseComments
    });
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    drawings,
    loading,
    error,
    onLike,
    onPageChange
  });
  pop();
}
function Pagination($$payload, $$props) {
  push();
  let pages;
  let currentPage = fallback($$props["currentPage"], 1);
  let totalPages = fallback($$props["totalPages"], 1);
  pages = (() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pageSet = /* @__PURE__ */ new Set();
    pageSet.add(1);
    pageSet.add(totalPages);
    if (currentPage > 1) pageSet.add(currentPage - 1);
    pageSet.add(currentPage);
    if (currentPage < totalPages) pageSet.add(currentPage + 1);
    return Array.from(pageSet).sort((a, b) => a - b);
  })();
  $$payload.out += `<nav class="pagination svelte-1hgqvg2"><button${attr("disabled", currentPage === 1, true)} aria-label="Previous Page" class="svelte-1hgqvg2">◀ Prev</button> `;
  if (totalPages <= 7) {
    $$payload.out += "<!--[-->";
    const each_array = ensure_array_like(Array(totalPages));
    $$payload.out += `<!--[-->`;
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      each_array[i];
      $$payload.out += `<button${attr_class("svelte-1hgqvg2", void 0, { "selected": i + 1 === currentPage })}>${escape_html(i + 1)}</button>`;
    }
    $$payload.out += `<!--]-->`;
  } else {
    $$payload.out += "<!--[!-->";
    const each_array_1 = ensure_array_like(pages);
    $$payload.out += `<!--[-->`;
    for (let index = 0, $$length = each_array_1.length; index < $$length; index++) {
      let page = each_array_1[index];
      if (index > 0 && page - pages[index - 1] > 1) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span class="svelte-1hgqvg2">…</span>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> <button${attr_class("svelte-1hgqvg2", void 0, { "selected": page === currentPage })}>${escape_html(page)}</button>`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--> <button${attr("disabled", currentPage === totalPages, true)} aria-label="Next Page" class="svelte-1hgqvg2">Next ▶</button></nav>`;
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
  const showCart = writable(false);
  const pagination = writable({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 42
  });
  async function fetchDrawings(page) {
    loading.set(true);
    error.set(null);
    const { itemsPerPage } = store_get($$store_subs ??= {}, "$pagination", pagination);
    const offset = (page - 1) * itemsPerPage;
    try {
      const { data, count, error: fetchError } = await supabase.from("drawings").select("id, drawing_id, image_data, likes, created_at, comments, user_id, user_email, blocked", { count: "exact" }).order("created_at", { ascending: false }).range(offset, offset + itemsPerPage - 1);
      if (fetchError) throw fetchError;
      const processedData = await Promise.all((data || []).map(async (drawing) => {
        console.log("Fetched drawing:", {
          id: drawing.id,
          drawing_id: drawing.drawing_id
        });
        if (drawing.image_data.startsWith("drawings/")) {
          const { data: signedData, error: signedError } = await supabase.storage.from("drawings").createSignedUrl(drawing.image_data, 3600);
          if (signedError) {
            console.error("Signed URL error:", signedError);
            return drawing;
          }
          return { ...drawing, image_data: signedData.signedUrl };
        }
        return drawing;
      }));
      drawings.set(processedData);
      pagination.update((p) => ({
        ...p,
        currentPage: page,
        totalPages: Math.ceil((count || 0) / itemsPerPage)
      }));
      likesStore.update((current) => {
        const newLikes = { ...current };
        processedData.forEach((drawing) => newLikes[drawing.drawing_id] = drawing.likes);
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
    console.log("GalleryContainer handleLike called with drawingId:", drawingId);
    const previousLikes = store_get($$store_subs ??= {}, "$likesStore", likesStore)[drawingId] || 0;
    likesStore.update((current) => ({ ...current, [drawingId]: previousLikes + 1 }));
    drawings.update((current) => current.map((d) => d.drawing_id === drawingId ? { ...d, likes: previousLikes + 1 } : d));
    try {
      await supabase.from("drawings").update({ likes: previousLikes + 1 }).eq("drawing_id", drawingId).throwOnError();
    } catch (err) {
      console.error("Like update failed:", err);
      likesStore.update((current) => ({ ...current, [drawingId]: previousLikes }));
      drawings.update((current) => current.map((d) => d.drawing_id === drawingId ? { ...d, likes: previousLikes } : d));
      error.set("Failed to update like. Please try again.");
    }
  }
  $$payload.out += `<div class="gallery-container svelte-np1y62">`;
  GalleryGrid($$payload, {
    drawings: store_get($$store_subs ??= {}, "$drawings", drawings),
    loading: store_get($$store_subs ??= {}, "$loading", loading),
    error: store_get($$store_subs ??= {}, "$error", error),
    onLike: handleLike,
    onPageChange: fetchDrawings
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
