import { J as store_get, N as head, G as ensure_array_like, K as attr, I as attr_class, P as escape_html, T as stringify, S as attr_style, M as unsubscribe_stores, C as pop, z as push } from "../../../../chunks/index.js";
import { c as cartStore } from "../../../../chunks/GalleryContainer.svelte_svelte_type_style_lang.js";
import "../../../../chunks/supabase.js";
import { w as writable } from "../../../../chunks/exports.js";
import "../../../../chunks/client.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let isEmpty, totalAmount;
  const objects3D = [
    {
      id: "mug",
      name: "Coffee Mug",
      price: 19.99,
      image: "/images/objects/mug.jpg"
    },
    {
      id: "tshirt",
      name: "T-Shirt",
      price: 24.99,
      image: "/images/objects/tshirt.jpg"
    },
    {
      id: "poster",
      name: "Poster",
      price: 14.99,
      image: "/images/objects/poster.jpg"
    },
    {
      id: "phonecase",
      name: "Phone Case",
      price: 29.99,
      image: "/images/objects/phonecase.jpg"
    },
    {
      id: "pillow",
      name: "Throw Pillow",
      price: 34.99,
      image: "/images/objects/pillow.jpg"
    }
  ];
  const selectedObjects = writable({});
  function calculateTotal() {
    let total = 0;
    store_get($$store_subs ??= {}, "$cartStore", cartStore).forEach((item) => {
      const objectId = item.selected3DObject;
      const object = objects3D.find((obj) => obj.id === objectId);
      if (object) {
        total += object.price;
      } else {
        console.warn(`No object found for drawing ${item.drawingId}, objectId: ${objectId}`);
      }
    });
    console.log("Calculated total:", total);
    return total;
  }
  isEmpty = store_get($$store_subs ??= {}, "$cartStore", cartStore).length === 0;
  totalAmount = calculateTotal();
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Checkout | Pexos</title>`;
    $$payload2.out += `<meta name="description" content="Complete your order">`;
  });
  $$payload.out += `<div class="checkout-container svelte-umoqr3"><h1 class="svelte-umoqr3">`;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `Your Custom 3D Order`;
  }
  $$payload.out += `<!--]--></h1> `;
  if (isEmpty) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="empty-checkout svelte-umoqr3"><p>Your cart is empty.</p> <button class="back-button svelte-umoqr3">Return to Gallery</button></div>`;
  } else {
    $$payload.out += "<!--[1-->";
    const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$cartStore", cartStore));
    const each_array_2 = ensure_array_like(store_get($$store_subs ??= {}, "$cartStore", cartStore));
    $$payload.out += `<div class="checkout-content svelte-umoqr3"><div class="checkout-items svelte-umoqr3"><!--[-->`;
    for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
      let item = each_array[$$index_1];
      const each_array_1 = ensure_array_like(objects3D);
      $$payload.out += `<div class="checkout-item svelte-umoqr3"><div class="item-image svelte-umoqr3"><img${attr("src", item.imageData)} alt="Drawing preview" class="svelte-umoqr3"> <button class="remove-button svelte-umoqr3" aria-label="Remove item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12"></path></svg></button></div> <div class="item-options svelte-umoqr3"><h3>Select 3D Object</h3> <div class="objects-grid svelte-umoqr3"><!--[-->`;
      for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
        let object = each_array_1[$$index];
        $$payload.out += `<div${attr_class(`object-option ${stringify(store_get($$store_subs ??= {}, "$selectedObjects", selectedObjects)[item.drawingId] === object.id ? "selected" : "")}`, "svelte-umoqr3")} role="button" tabindex="0"${attr("aria-label", `Select ${object.name}`)}><div class="object-image svelte-umoqr3"><div class="object-placeholder svelte-umoqr3"><span>${escape_html(object.name)}</span></div></div> <div class="object-info svelte-umoqr3"><span class="object-name svelte-umoqr3">${escape_html(object.name)}</span> <span class="object-price svelte-umoqr3">$${escape_html(object.price.toFixed(2))}</span></div></div>`;
      }
      $$payload.out += `<!--]--></div> <div class="preview-section svelte-umoqr3"><h4>Preview</h4> <div class="preview-3d svelte-umoqr3"><div class="preview-placeholder svelte-umoqr3">`;
      if (store_get($$store_subs ??= {}, "$selectedObjects", selectedObjects)[item.drawingId]) {
        $$payload.out += "<!--[-->";
        const selectedObject = objects3D.find((obj) => obj.id === store_get($$store_subs ??= {}, "$selectedObjects", selectedObjects)[item.drawingId]);
        $$payload.out += `<div class="mock-3d-object svelte-umoqr3"><span>${escape_html(selectedObject?.name || "Object")}</span> <div class="texture-overlay svelte-umoqr3"${attr_style(`background-image: url(${stringify(item.imageData)})`)}></div></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div></div></div></div></div>`;
    }
    $$payload.out += `<!--]--></div> <div class="checkout-summary svelte-umoqr3"><h2 class="svelte-umoqr3">Order Summary</h2> <div class="summary-items svelte-umoqr3"><!--[-->`;
    for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
      let item = each_array_2[$$index_2];
      const selectedObject = objects3D.find((obj) => obj.id === store_get($$store_subs ??= {}, "$selectedObjects", selectedObjects)[item.drawingId]);
      $$payload.out += `<div class="summary-item svelte-umoqr3"><span>${escape_html(selectedObject?.name || "Custom Object")}</span> <span>$${escape_html(selectedObject?.price.toFixed(2) || "0.00")}</span></div>`;
    }
    $$payload.out += `<!--]--></div> <div class="summary-total svelte-umoqr3"><span>Total</span> <span>$${escape_html(totalAmount.toFixed(2))}</span></div> <div class="checkout-actions svelte-umoqr3"><button class="back-button svelte-umoqr3">Continue Shopping</button> <button class="update-totals-button svelte-umoqr3">Update Totals</button> <button class="checkout-button svelte-umoqr3">Continue to Shipping</button></div></div></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
