import * as universal from '../entries/pages/_layout.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.BpGnYAz1.js","_app/immutable/chunks/DPmhzSt5.js","_app/immutable/chunks/BDHGhfTE.js","_app/immutable/chunks/CHpTJ84V.js","_app/immutable/chunks/CvTsB6m-.js","_app/immutable/chunks/1K336M6a.js","_app/immutable/chunks/ChMpMzq7.js","_app/immutable/chunks/DH2AK175.js","_app/immutable/chunks/BqOODIDs.js","_app/immutable/chunks/C1FmrZbK.js","_app/immutable/chunks/BimYdWYP.js","_app/immutable/chunks/CTjs_13Y.js","_app/immutable/chunks/CgxHyAce.js","_app/immutable/chunks/D02H29ki.js","_app/immutable/chunks/5ddwAlOI.js","_app/immutable/chunks/CNoJYvQC.js","_app/immutable/chunks/CsGhAA03.js"];
export const stylesheets = ["_app/immutable/assets/0.MI5BRfEF.css"];
export const fonts = [];
