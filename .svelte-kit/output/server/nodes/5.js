import * as server from '../entries/pages/create/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/create/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/create/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.B0CEyXdZ.js","_app/immutable/chunks/fM_HHR7z.js","_app/immutable/chunks/Cw_GAJ-8.js","_app/immutable/chunks/Dcs68N15.js","_app/immutable/chunks/tsz7uQk5.js","_app/immutable/chunks/JX9NnDbc.js","_app/immutable/chunks/DaUur2Kz.js","_app/immutable/chunks/BbjLjIkL.js","_app/immutable/chunks/DV9TUGiz.js","_app/immutable/chunks/DTVZafTn.js","_app/immutable/chunks/C1FmrZbK.js","_app/immutable/chunks/E_7-NnNK.js","_app/immutable/chunks/B3wL8fD2.js","_app/immutable/chunks/C3V-GO8h.js","_app/immutable/chunks/C5uFXPOK.js","_app/immutable/chunks/5A2ZYZT-.js","_app/immutable/chunks/DrJ5GnEB.js","_app/immutable/chunks/BlA1OJav.js","_app/immutable/chunks/D3vPkYQk.js","_app/immutable/chunks/Dpaq57WD.js"];
export const stylesheets = ["_app/immutable/assets/CanvasShader.DGCYF2tG.css","_app/immutable/assets/5.BkyJDSXA.css"];
export const fonts = [];
