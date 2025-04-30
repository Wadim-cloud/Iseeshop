import * as server from '../entries/pages/create/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/create/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/create/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.DIvc0QWX.js","_app/immutable/chunks/DPmhzSt5.js","_app/immutable/chunks/BDHGhfTE.js","_app/immutable/chunks/CHpTJ84V.js","_app/immutable/chunks/CTjs_13Y.js","_app/immutable/chunks/CvTsB6m-.js","_app/immutable/chunks/1K336M6a.js","_app/immutable/chunks/ChMpMzq7.js","_app/immutable/chunks/DH2AK175.js","_app/immutable/chunks/BqOODIDs.js","_app/immutable/chunks/C1FmrZbK.js","_app/immutable/chunks/BimYdWYP.js","_app/immutable/chunks/5ddwAlOI.js","_app/immutable/chunks/RZ2m-Vl7.js","_app/immutable/chunks/CgxHyAce.js","_app/immutable/chunks/D02H29ki.js","_app/immutable/chunks/BvDJoXBx.js","_app/immutable/chunks/DR4qTk9g.js","_app/immutable/chunks/CNoJYvQC.js"];
export const stylesheets = ["_app/immutable/assets/CanvasShader.DGCYF2tG.css","_app/immutable/assets/5.BkyJDSXA.css"];
export const fonts = [];
