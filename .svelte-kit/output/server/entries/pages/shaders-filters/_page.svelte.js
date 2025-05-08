import { f as escape_html, b as attr, p as pop, a as push, h as head } from "../../../chunks/index.js";
function Hope($$payload, $$props) {
  push();
  let imageWidth = 1, imageHeight = 1;
  let hopeThresholdLight = 0.75;
  let hopeThresholdMid = 0.5;
  let hopeThresholdDark = 0.25;
  $$payload.out += `<input type="file" accept="image/*" class="svelte-1r5mxlw"> <select class="svelte-1r5mxlw"><option value="hope">Hope Filter</option><option value="grayscale">Grayscale Filter</option></select> `;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="svelte-1r5mxlw"><label for="thresholdLight">Light Threshold: ${escape_html(hopeThresholdLight)}</label> <input type="range" id="thresholdLight" min="0" max="1" step="0.01"${attr("value", hopeThresholdLight)} class="svelte-1r5mxlw"></div> <div class="svelte-1r5mxlw"><label for="thresholdMid">Mid Threshold: ${escape_html(hopeThresholdMid)}</label> <input type="range" id="thresholdMid" min="0" max="1" step="0.01"${attr("value", hopeThresholdMid)} class="svelte-1r5mxlw"></div> <div class="svelte-1r5mxlw"><label for="thresholdDark">Dark Threshold: ${escape_html(hopeThresholdDark)}</label> <input type="range" id="thresholdDark" min="0" max="1" step="0.01"${attr("value", hopeThresholdDark)} class="svelte-1r5mxlw"></div>`;
  }
  $$payload.out += `<!--]--> <div class="svelte-1r5mxlw"><label for="aspectWidth">Width: ${escape_html(imageWidth)}</label> <input type="range" id="aspectWidth" min="1" max="2000" step="1"${attr("value", imageWidth)} class="svelte-1r5mxlw"></div> <div class="svelte-1r5mxlw"><label for="aspectHeight">Height: ${escape_html(imageHeight)}</label> <input type="range" id="aspectHeight" min="1" max="2000" step="1"${attr("value", imageHeight)} class="svelte-1r5mxlw"></div> <canvas class="svelte-1r5mxlw"></canvas>`;
  pop();
}
function _page($$payload, $$props) {
  push();
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Shaders &amp; Filters</title>`;
  });
  $$payload.out += `<main class="svelte-4wha66"><h1 class="svelte-4wha66">Hope Poster Filter</h1> <p class="svelte-4wha66">Upload an image and apply the "Hope" poster effect.</p> `;
  Hope($$payload);
  $$payload.out += `<!----></main>`;
  pop();
}
export {
  _page as default
};
