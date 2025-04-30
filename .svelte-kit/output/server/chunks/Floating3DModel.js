import { T as fallback, I as escape_html, J as bind_props, C as pop, z as push } from "./index.js";
import { o as onDestroy } from "./index-server.js";
function Floating3DModel($$payload, $$props) {
  push();
  let stlFile = fallback($$props["stlFile"], "/models/tshirt.stl");
  let defaultTextureImage = fallback($$props["defaultTextureImage"], "/texture/boom.png");
  let width = fallback($$props["width"], "100%");
  let height = fallback($$props["height"], "300px");
  let backgroundColor = fallback($$props["backgroundColor"], 0);
  let modelColor = fallback($$props["modelColor"], 8421504);
  let floating = fallback($$props["floating"], false);
  let rotationSpeedY = fallback($$props["rotationSpeedY"], 0.01);
  let autoRotate = fallback($$props["autoRotate"], true);
  let enableZoom = fallback($$props["enableZoom"], true);
  let initialZoom = fallback($$props["initialZoom"], 8);
  let drawingData = fallback($$props["drawingData"], null);
  onDestroy(() => {
    window.removeEventListener("resize", onResize);
  });
  function onResize() {
    return;
  }
  $$payload.out += `<div class="floating-model-container svelte-htrp2t">`;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="controls svelte-htrp2t"><button class="svelte-htrp2t">${escape_html("Start Rotation")}</button> <button class="svelte-htrp2t">Reset View</button></div></div> `;
  if (!drawingData) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="upload-container svelte-htrp2t"><input type="file" accept="image/*" class="svelte-htrp2t"> <p>Upload your own picture to texture the model.</p></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, {
    stlFile,
    defaultTextureImage,
    width,
    height,
    backgroundColor,
    modelColor,
    floating,
    rotationSpeedY,
    autoRotate,
    enableZoom,
    initialZoom,
    drawingData
  });
  pop();
}
export {
  Floating3DModel as F
};
