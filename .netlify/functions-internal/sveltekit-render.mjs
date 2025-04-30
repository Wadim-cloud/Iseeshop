import { init } from '../serverless.js';

export const handler = init((() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","logo192.png","models/Dobbelsteen.stl","models/test.stl","models/tshirt.stl","texture/boom.png","_redirects"]),
	mimeTypes: {".png":"image/png",".stl":"model/stl"},
	_: {
		client: {start:"_app/immutable/entry/start.p6lkoguK.js",app:"_app/immutable/entry/app.C-xbMAly.js",imports:["_app/immutable/entry/start.p6lkoguK.js","_app/immutable/chunks/DoXARqE7.js","_app/immutable/chunks/BDHGhfTE.js","_app/immutable/chunks/DH2AK175.js","_app/immutable/entry/app.C-xbMAly.js","_app/immutable/chunks/C1FmrZbK.js","_app/immutable/chunks/BDHGhfTE.js","_app/immutable/chunks/CTjs_13Y.js","_app/immutable/chunks/CvTsB6m-.js","_app/immutable/chunks/DPmhzSt5.js","_app/immutable/chunks/1K336M6a.js","_app/immutable/chunks/RZ2m-Vl7.js","_app/immutable/chunks/ChMpMzq7.js","_app/immutable/chunks/DH2AK175.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('../server/nodes/0.js')),
			__memo(() => import('../server/nodes/1.js')),
			__memo(() => import('../server/nodes/2.js')),
			__memo(() => import('../server/nodes/3.js')),
			__memo(() => import('../server/nodes/4.js')),
			__memo(() => import('../server/nodes/5.js')),
			__memo(() => import('../server/nodes/6.js')),
			__memo(() => import('../server/nodes/7.js')),
			__memo(() => import('../server/nodes/8.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/about",
				pattern: /^\/about\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/auth/callback",
				pattern: /^\/auth\/callback\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/create",
				pattern: /^\/create\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/gallery",
				pattern: /^\/gallery\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/shaders-filters",
				pattern: /^\/shaders-filters\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/todo",
				pattern: /^\/todo\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})());
