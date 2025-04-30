import { S as spread_props, C as pop, z as push } from "../../../chunks/index.js";
import { F as Floating3DModel } from "../../../chunks/Floating3DModel.js";
import "../../../chunks/supabase.js";
import "../../../chunks/client.js";
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
