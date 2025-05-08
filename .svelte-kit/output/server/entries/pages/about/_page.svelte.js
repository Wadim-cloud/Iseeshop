import { j as fallback, f as escape_html, k as bind_props, p as pop, a as push, v as spread_props } from "../../../chunks/index.js";
import { o as onDestroy } from "../../../chunks/index-server.js";
import "../../../chunks/supabase.js";
import "../../../chunks/client.js";
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
function _page($$payload, $$props) {
  push();
  const modelConfig = {
    stlFile: "/models/tshirt.stl",
    defaultTextureImage: "/texture/boom.png",
    width: "100%",
    height: "400px",
    backgroundColor: "#f0f0f0",
    modelColor: "#cccccc",
    floating: true,
    rotationSpeedY: 0.5,
    // Only Y rotation (speed adjusted for OrbitControls)
    autoRotate: true,
    // Enable auto-rotation by default
    enableZoom: true
    // Enable zoom controls
  };
  $$payload.out += `<div class="page-wrapper svelte-5cpycs"><div class="model-container svelte-5cpycs">`;
  Floating3DModel($$payload, spread_props([modelConfig]));
  $$payload.out += `<!----></div> <div class="about-section svelte-5cpycs"><h2 class="svelte-5cpycs">About Pexos</h2> <p class="svelte-5cpycs">Wadim Seminsky and Bertin van Vliet, two passionate visionaries, crafted Pexos as a vibrant creative platform where artists can unleash their imaginations and bring drawings to life. This space is a celebration of art, innovation, and community.</p> <p class="svelte-5cpycs">Right now, we’re rallying support for a heartfelt cause—raising funds to help a dear friend get new teeth, restoring their confidence and smile. Every small gesture counts, and you can make a difference! Join us in this mission by grabbing a virtual coffee for the cause at <a href="https://buymeacoffee.com/wadiem" target="_blank" class="coffee-button svelte-5cpycs">buymeacoffee.com/wadiem</a>. Your support fuels both creativity and kindness!</p></div> <p class="quote svelte-5cpycs">"They hang me up to dry too many times" - Cold War Kids</p></div>`;
  pop();
}
export {
  _page as default
};
