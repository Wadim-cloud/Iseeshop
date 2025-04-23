import { W as current_component } from "./index.js";
function onDestroy(fn) {
  var context = (
    /** @type {Component} */
    current_component
  );
  (context.d ??= []).push(fn);
}
export {
  onDestroy as o
};
