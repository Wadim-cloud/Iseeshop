export const manifest = (() => {
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
		client: {start:"_app/immutable/entry/start.BnSNLLdF.js",app:"_app/immutable/entry/app.CYyRtI0j.js",imports:["_app/immutable/entry/start.BnSNLLdF.js","_app/immutable/chunks/BsK15QRw.js","_app/immutable/chunks/Cw_GAJ-8.js","_app/immutable/chunks/DV9TUGiz.js","_app/immutable/entry/app.CYyRtI0j.js","_app/immutable/chunks/C1FmrZbK.js","_app/immutable/chunks/Cw_GAJ-8.js","_app/immutable/chunks/tsz7uQk5.js","_app/immutable/chunks/fM_HHR7z.js","_app/immutable/chunks/JX9NnDbc.js","_app/immutable/chunks/C3V-GO8h.js","_app/immutable/chunks/DaUur2Kz.js","_app/immutable/chunks/BbjLjIkL.js","_app/immutable/chunks/DV9TUGiz.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js'))
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
				id: "/gallery/checkout",
				pattern: /^\/gallery\/checkout\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/shaders-filters",
				pattern: /^\/shaders-filters\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/todo",
				pattern: /^\/todo\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
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
})();
