import * as server from '../entries/pages/gallery/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/gallery/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/gallery/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.BoD8fPHC.js","_app/immutable/chunks/fM_HHR7z.js","_app/immutable/chunks/Cw_GAJ-8.js","_app/immutable/chunks/Dcs68N15.js","_app/immutable/chunks/tsz7uQk5.js","_app/immutable/chunks/BsK15QRw.js","_app/immutable/chunks/DV9TUGiz.js","_app/immutable/chunks/BbjLjIkL.js","_app/immutable/chunks/JX9NnDbc.js","_app/immutable/chunks/C5uFXPOK.js","_app/immutable/chunks/5A2ZYZT-.js","_app/immutable/chunks/B3wL8fD2.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/DnUw-Gb1.js","_app/immutable/chunks/DaUur2Kz.js","_app/immutable/chunks/BYbTja4Y.js","_app/immutable/chunks/Dpaq57WD.js","_app/immutable/chunks/CI_hdHvm.js","_app/immutable/chunks/C1FmrZbK.js"];
export const stylesheets = ["_app/immutable/assets/6.BTWCdubD.css"];
export const fonts = [];
