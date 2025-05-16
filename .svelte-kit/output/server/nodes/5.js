import * as server from '../entries/pages/create/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/create/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/create/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.B-52-aWn.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/69_IOA4Y.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/9BOlcS-b.js","_app/immutable/chunks/BsZz1DC-.js","_app/immutable/chunks/Bnw62dMu.js","_app/immutable/chunks/WEOj8Vpi.js","_app/immutable/chunks/DhNq3B23.js","_app/immutable/chunks/CTf98LKf.js","_app/immutable/chunks/9x1-h8O0.js","_app/immutable/chunks/BaLMMi1F.js","_app/immutable/chunks/trMeve9e.js","_app/immutable/chunks/xvq0-Hdq.js","_app/immutable/chunks/BeMxMaC5.js","_app/immutable/chunks/C1FmrZbK.js","_app/immutable/chunks/zThV1SCZ.js","_app/immutable/chunks/C6Q-HWxe.js"];
export const stylesheets = ["_app/immutable/assets/5.Cko2KCAY.css"];
export const fonts = [];
