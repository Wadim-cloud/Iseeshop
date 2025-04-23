import * as server from '../entries/pages/create/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/create/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/create/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.Dw2Xw8TS.js","_app/immutable/chunks/DxolCNix.js","_app/immutable/chunks/B668RH8u.js","_app/immutable/chunks/Ci8d3Fat.js","_app/immutable/chunks/DhXqswRN.js","_app/immutable/chunks/CoxfEDN7.js","_app/immutable/chunks/CHu_v1B0.js","_app/immutable/chunks/BfDDsPvW.js","_app/immutable/chunks/BHuW5wU9.js","_app/immutable/chunks/CxeLWBhm.js","_app/immutable/chunks/AJiKPocd.js","_app/immutable/chunks/C1FmrZbK.js","_app/immutable/chunks/ZC7F_AQJ.js","_app/immutable/chunks/BavnsP6q.js","_app/immutable/chunks/DF75DhTM.js","_app/immutable/chunks/Dxuc275j.js","_app/immutable/chunks/DGKrTPFL.js","_app/immutable/chunks/kt7n16z5.js","_app/immutable/chunks/AOsgo3jW.js","_app/immutable/chunks/Cisl1x4j.js","_app/immutable/chunks/CfWLuewf.js"];
export const stylesheets = ["_app/immutable/assets/CanvasShader.DGCYF2tG.css","_app/immutable/assets/5.Bu43vxGX.css"];
export const fonts = [];
