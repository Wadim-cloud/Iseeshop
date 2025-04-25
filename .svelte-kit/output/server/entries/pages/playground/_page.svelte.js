import { G as ensure_array_like, I as attr_class, K as attr, P as escape_html, C as pop, z as push } from "../../../chunks/index.js";
function _page($$payload, $$props) {
  push();
  let models = [
    {
      id: 1,
      name: "Model 1",
      file: null,
      object: null,
      color: "#ff0000",
      texture: null,
      position: [0, 0, 0],
      visible: true,
      path: "/models/Dobbelsteen.stl"
    },
    {
      id: 2,
      name: "Model 2",
      file: null,
      object: null,
      color: "#00ff00",
      texture: null,
      position: [3, 0, 0],
      visible: true,
      path: "/models/test.stl"
    },
    {
      id: 3,
      name: "Model 3",
      file: null,
      object: null,
      color: "#0000ff",
      texture: null,
      position: [-3, 0, 0],
      visible: true,
      path: "/models/tshirt.stl"
    }
  ];
  let selectedModel = models[0];
  let zoomLevel = 50;
  const each_array = ensure_array_like(models);
  $$payload.out += `<main><div class="app-container svelte-1xiknbp"><div class="sidebar svelte-1xiknbp"><h2 class="svelte-1xiknbp">STL Viewer</h2> <div class="models-section svelte-1xiknbp"><h3 class="svelte-1xiknbp">Models</h3> <!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let model = each_array[$$index];
    $$payload.out += `<div${attr_class("model-item svelte-1xiknbp", void 0, { "selected": selectedModel.id === model.id })}><div class="model-header svelte-1xiknbp"><input type="checkbox"${attr("checked", model.visible, true)}> <span class="svelte-1xiknbp">${escape_html(model.name)}</span></div> <div class="model-controls svelte-1xiknbp"><div class="file-upload svelte-1xiknbp"><label${attr("for", `file-${model.id}`)} class="svelte-1xiknbp">Upload STL</label> <input type="file"${attr("id", `file-${model.id}`)} accept=".stl" class="svelte-1xiknbp"></div> <div class="file-upload svelte-1xiknbp"><label${attr("for", `texture-${model.id}`)} class="svelte-1xiknbp">Upload Texture</label> <input type="file"${attr("id", `texture-${model.id}`)} accept="image/*" class="svelte-1xiknbp"></div> <div class="color-picker svelte-1xiknbp"><span>Color:</span> <input type="color"${attr("value", model.color)}></div></div></div>`;
  }
  $$payload.out += `<!--]--></div> <div class="scene-controls svelte-1xiknbp"><h3 class="svelte-1xiknbp">Controls</h3> <div class="control-group svelte-1xiknbp"><label for="zoom-level">Zoom Level</label> <input type="range" id="zoom-level" min="0" max="100" step="1"${attr("value", zoomLevel)} class="svelte-1xiknbp"> <span>${escape_html(Math.round(zoomLevel))}</span></div> <button class="svelte-1xiknbp">Reset Camera</button> <button class="svelte-1xiknbp">Export as PNG</button></div></div> <div class="canvas-container svelte-1xiknbp"><canvas class="svelte-1xiknbp"></canvas></div></div></main>`;
  pop();
}
export {
  _page as default
};
