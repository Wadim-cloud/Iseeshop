import { w as writable } from "./exports.js";
const likesStore = writable({});
const cartStore = writable([]);
const cartSize = writable(0);
cartStore.subscribe((items) => {
  cartSize.set(items.length);
});
export {
  cartSize as a,
  cartStore as c,
  likesStore as l
};
