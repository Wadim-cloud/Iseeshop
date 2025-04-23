import { init } from '../serverless.js';

export const handler = init((() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["chimp.jpg","favicon.png","fonts/Inter_18pt-ExtraBold.ttf","fonts/Inter_18pt-ExtraLight.ttf","fonts/Inter_18pt-Light.ttf","fonts/Inter_18pt-Medium.ttf","fonts/Inter_18pt-Regular.ttf","fonts/Stanley.otf","frogger.jpg","logo192.png","models/Dobbelsteen.stl","models/test.stl","models/tshirt.stl","texture/boom.png","_redirects"]),
	mimeTypes: {".jpg":"image/jpeg",".png":"image/png",".ttf":"font/ttf",".otf":"font/otf",".stl":"model/stl"},
	_: {
		client: {start:"_app/immutable/entry/start.BdQf0EKZ.js",app:"_app/immutable/entry/app.BOPKXE-W.js",imports:["_app/immutable/entry/start.BdQf0EKZ.js","_app/immutable/chunks/ZC7F_AQJ.js","_app/immutable/chunks/B668RH8u.js","_app/immutable/chunks/CxeLWBhm.js","_app/immutable/entry/app.BOPKXE-W.js","_app/immutable/chunks/C1FmrZbK.js","_app/immutable/chunks/B668RH8u.js","_app/immutable/chunks/DhXqswRN.js","_app/immutable/chunks/DxolCNix.js","_app/immutable/chunks/CoxfEDN7.js","_app/immutable/chunks/DF75DhTM.js","_app/immutable/chunks/BfDDsPvW.js","_app/immutable/chunks/BHuW5wU9.js","_app/immutable/chunks/CxeLWBhm.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('../server/nodes/0.js')),
			__memo(() => import('../server/nodes/1.js')),
			__memo(() => import('../server/nodes/2.js')),
			__memo(() => import('../server/nodes/3.js')),
			__memo(() => import('../server/nodes/4.js')),
			__memo(() => import('../server/nodes/5.js')),
			__memo(() => import('../server/nodes/6.js')),
			__memo(() => import('../server/nodes/7.js')),
			__memo(() => import('../server/nodes/8.js')),
			__memo(() => import('../server/nodes/9.js')),
			__memo(() => import('../server/nodes/10.js'))
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
				id: "/playground",
				pattern: /^\/playground\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/shaders-filters",
				pattern: /^\/shaders-filters\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/todo",
				pattern: /^\/todo\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
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
