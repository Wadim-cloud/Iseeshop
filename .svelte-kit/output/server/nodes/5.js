import * as server from '../entries/pages/create/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/create/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/create/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.ifp53Xhi.js","_app/immutable/chunks/B2hSDNwb.js","_app/immutable/chunks/Bxdg7ccW.js","_app/immutable/chunks/BkJq1j4_.js","_app/immutable/chunks/6og0jn-Y.js","_app/immutable/chunks/Bqnn9XxY.js","_app/immutable/chunks/Czyh_-as.js","_app/immutable/chunks/CP6E_JcI.js","_app/immutable/chunks/Cq64pHAR.js","_app/immutable/chunks/wkM8Wptt.js","_app/immutable/chunks/C1FmrZbK.js","_app/immutable/chunks/IbqXbPHK.js","_app/immutable/chunks/UMIFvBL3.js","_app/immutable/chunks/C7mBFiPQ.js","_app/immutable/chunks/ucczKhfM.js","_app/immutable/chunks/CcUbZ0dA.js","_app/immutable/chunks/ChDf3tN1.js","_app/immutable/chunks/cLJjU_P4.js","_app/immutable/chunks/dNzaCE8p.js","_app/immutable/chunks/CVktCSDB.js"];
export const stylesheets = ["_app/immutable/assets/CanvasShader.DGCYF2tG.css","_app/immutable/assets/5.oKwh0OyX.css"];
export const fonts = [];
