import * as server from '../entries/pages/create/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/create/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/create/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.DSHG__le.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/69_IOA4Y.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CgpLTG9e.js","_app/immutable/chunks/C_m-qMmZ.js","_app/immutable/chunks/CVxkZOGS.js","_app/immutable/chunks/ClXQIVwo.js","_app/immutable/chunks/CKI-jMsq.js","_app/immutable/chunks/Bxv1m9ax.js","_app/immutable/chunks/CN5En7F1.js","_app/immutable/chunks/4hlrb4d8.js","_app/immutable/chunks/BX0sDDBR.js","_app/immutable/chunks/C1FmrZbK.js","_app/immutable/chunks/DVI0icdo.js","_app/immutable/chunks/CZQXRoan.js","_app/immutable/chunks/Bs1xm8oX.js","_app/immutable/chunks/B6FZq7_G.js","_app/immutable/chunks/CvOifuop.js","_app/immutable/chunks/B9RedXCH.js","_app/immutable/chunks/Dzbni-AY.js","_app/immutable/chunks/D7okP_CL.js","_app/immutable/chunks/Ct8AHqA9.js","_app/immutable/chunks/sPbp32sz.js"];
export const stylesheets = ["_app/immutable/assets/CanvasShader.DGCYF2tG.css","_app/immutable/assets/Toast.DxPHdEw2.css","_app/immutable/assets/5.DvRJGneV.css"];
export const fonts = [];
