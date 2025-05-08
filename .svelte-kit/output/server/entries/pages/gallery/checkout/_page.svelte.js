import { s as store_get, h as head, e as ensure_array_like, b as attr, d as attr_class, f as escape_html, g as stringify, i as attr_style, u as unsubscribe_stores, p as pop, a as push } from "../../../../chunks/index.js";
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
  const countryConfigs = {
    US: {
      currency: "USD",
      zipPattern: "^\\d{5}(-\\d{4})?$",
      zipTitle: "Enter a valid US ZIP code (e.g. 12345 or 12345-6789)",
      states: [
        "AL",
        "AK",
        "AZ",
        "AR",
        "CA",
        "CO",
        "CT",
        "DE",
        "FL",
        "GA",
        "HI",
        "ID",
        "IL",
        "IN",
        "IA",
        "KS",
        "KY",
        "LA",
        "ME",
        "MD",
        "MA",
        "MI",
        "MN",
        "MS",
        "MO",
        "MT",
        "NE",
        "NV",
        "NH",
        "NJ",
        "NM",
        "NY",
        "NC",
        "ND",
        "OH",
        "OK",
        "OR",
        "PA",
        "RI",
        "SC",
        "SD",
        "TN",
        "TX",
        "UT",
        "VT",
        "VA",
        "WA",
        "WV",
        "WI",
        "WY"
      ]
    },
    NL: {
      currency: "EUR",
      zipPattern: "^[1-9][0-9]{3}\\s?[A-Z]{2}$",
      zipTitle: "Enter a valid Dutch postal code (e.g. 1234 AB)",
      states: []
    },
    UK: {
      currency: "GBP",
      zipPattern: "^[A-Z]{1,2}[0-9][A-Z0-9]?\\s?[0-9][A-Z]{2}$",
      zipTitle: "Enter a valid UK postcode (e.g. SW1A 1AA)",
      states: []
    },
    DE: {
      currency: "EUR",
      zipPattern: "^\\d{5}$",
      zipTitle: "Enter a valid German postal code (5 digits)",
      states: []
    }
  };
  const DEFAULT_COUNTRY = "NL";
  const selectedObjects = writable({});
  let checkoutStep = "product-selection";
  let buyerInfo = {
    country: DEFAULT_COUNTRY
  };
  let currentCountryConfig = countryConfigs[DEFAULT_COUNTRY];
  function formatCurrency(amount) {
    return new Intl.NumberFormat(void 0, {
      style: "currency",
      currency: currentCountryConfig.currency
    }).format(amount);
  }
  function calculateTotal() {
    return store_get($$store_subs ??= {}, "$cartStore", cartStore).reduce(
      (total, item) => {
        const object = objects3D.find((obj) => obj.id === item.selected3DObject);
        return total + (object?.price || 0);
      },
      0
    );
  }
  isEmpty = store_get($$store_subs ??= {}, "$cartStore", cartStore).length === 0;
  totalAmount = calculateTotal();
  {
    if (countryConfigs[buyerInfo.country]) {
      currentCountryConfig = countryConfigs[buyerInfo.country];
    }
  }
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Checkout | Pexos</title>`;
    $$payload2.out += `<meta name="description" content="Complete your order">`;
  });
  $$payload.out += `<div class="checkout-container svelte-kg1xyt"><h1 class="svelte-kg1xyt">`;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `Your Custom 3D Order`;
  }
  $$payload.out += `<!--]--></h1> `;
  if (isEmpty && checkoutStep !== "success") {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="empty-checkout svelte-kg1xyt"><p>Your cart is empty.</p> <button class="back-button svelte-kg1xyt">Return to Gallery</button></div>`;
  } else {
    $$payload.out += "<!--[1-->";
    const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$cartStore", cartStore));
    const each_array_2 = ensure_array_like(store_get($$store_subs ??= {}, "$cartStore", cartStore));
    $$payload.out += `<div class="checkout-content svelte-kg1xyt"><div class="checkout-items svelte-kg1xyt"><!--[-->`;
    for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
      let item = each_array[$$index_1];
      const each_array_1 = ensure_array_like(objects3D);
      $$payload.out += `<div class="checkout-item svelte-kg1xyt"><div class="item-image svelte-kg1xyt"><img${attr("src", item.imageData)} alt="Drawing preview" class="svelte-kg1xyt"> <button class="remove-button svelte-kg1xyt" aria-label="Remove item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6L6 18M6 6l12 12"></path></svg></button></div> <div class="item-options svelte-kg1xyt"><h3>Select 3D Object</h3> <div class="objects-grid svelte-kg1xyt"><!--[-->`;
      for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
        let object = each_array_1[$$index];
        $$payload.out += `<div${attr_class(`object-option ${stringify(store_get($$store_subs ??= {}, "$selectedObjects", selectedObjects)[item.drawingId] === object.id ? "selected" : "")}`, "svelte-kg1xyt")} role="button" tabindex="0"${attr("aria-label", "Select " + object.name)}><div class="object-image svelte-kg1xyt"><div class="object-placeholder svelte-kg1xyt"><span>${escape_html(object.name)}</span></div></div> <div class="object-info svelte-kg1xyt"><span class="object-name svelte-kg1xyt">${escape_html(object.name)}</span> <span class="object-price svelte-kg1xyt">${escape_html(formatCurrency(object.price))}</span></div></div>`;
      }
      $$payload.out += `<!--]--></div> <div class="preview-section svelte-kg1xyt"><h4>Preview</h4> <div class="preview-3d svelte-kg1xyt"><div class="preview-placeholder svelte-kg1xyt">`;
      if (store_get($$store_subs ??= {}, "$selectedObjects", selectedObjects)[item.drawingId]) {
        $$payload.out += "<!--[-->";
        const selectedObject = objects3D.find((obj) => obj.id === store_get($$store_subs ??= {}, "$selectedObjects", selectedObjects)[item.drawingId]);
        $$payload.out += `<div class="mock-3d-object svelte-kg1xyt"><span>${escape_html(selectedObject?.name || "Object")}</span> <div class="texture-overlay svelte-kg1xyt"${attr_style(`background-image: url(${stringify(item.imageData)})`)}></div></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div></div></div></div></div>`;
    }
    $$payload.out += `<!--]--></div> <div class="checkout-summary svelte-kg1xyt"><h2 class="svelte-kg1xyt">Order Summary</h2> <div class="summary-items svelte-kg1xyt"><!--[-->`;
    for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
      let item = each_array_2[$$index_2];
      const selectedObject = objects3D.find((obj) => obj.id === store_get($$store_subs ??= {}, "$selectedObjects", selectedObjects)[item.drawingId]);
      $$payload.out += `<div class="summary-item svelte-kg1xyt"><span>${escape_html(selectedObject?.name || "Custom Object")}</span> <span>${escape_html(formatCurrency(selectedObject?.price || 0))}</span></div>`;
    }
    $$payload.out += `<!--]--></div> <div class="summary-total svelte-kg1xyt"><span>Total</span> <span>${escape_html(formatCurrency(totalAmount))}</span></div> <div class="checkout-actions svelte-kg1xyt"><button class="back-button svelte-kg1xyt">Continue Shopping</button> <button class="checkout-button svelte-kg1xyt">Continue to Shipping</button></div></div></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
