import * as server from '../entries/pages/gallery/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/gallery/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/gallery/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.ByFjuxn8.js","_app/immutable/chunks/DPmhzSt5.js","_app/immutable/chunks/BDHGhfTE.js","_app/immutable/chunks/CHpTJ84V.js","_app/immutable/chunks/CvTsB6m-.js","_app/immutable/chunks/BimYdWYP.js","_app/immutable/chunks/DH2AK175.js","_app/immutable/chunks/ChMpMzq7.js","_app/immutable/chunks/CTjs_13Y.js","_app/immutable/chunks/1K336M6a.js","_app/immutable/chunks/D02H29ki.js","_app/immutable/chunks/CgxHyAce.js","_app/immutable/chunks/RZ2m-Vl7.js","_app/immutable/chunks/BznP9nFT.js","_app/immutable/chunks/B2jQ_eJN.js","_app/immutable/chunks/5ddwAlOI.js","_app/immutable/chunks/BqOODIDs.js","_app/immutable/chunks/C1FmrZbK.js"];
export const stylesheets = ["_app/immutable/assets/Floating3DModel.BnJRNIkG.css","_app/immutable/assets/6.BuaVk01n.css"];
export const fonts = [];
