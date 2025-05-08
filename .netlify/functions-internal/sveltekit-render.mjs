import { init } from '../serverless.js';

export const handler = init((() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["_redirects","chimp.jpg","favicon.png","fonts/Inter_18pt-ExtraBold.ttf","fonts/Inter_18pt-ExtraLight.ttf","fonts/Inter_18pt-Light.ttf","fonts/Inter_18pt-Medium.ttf","fonts/Inter_18pt-Regular.ttf","fonts/Stanley.otf","frogger.jpg","logo192.png","models/Dobbelsteen.stl","models/test.stl","models/tshirt.stl","service-worker.js","texture/boom.png"]),
	mimeTypes: {".jpg":"image/jpeg",".png":"image/png",".ttf":"font/ttf",".otf":"font/otf",".stl":"model/stl",".js":"text/javascript"},
	_: {
		client: {start:"_app/immutable/entry/start.DPieiDmU.js",app:"_app/immutable/entry/app.D3mCZoQa.js",imports:["_app/immutable/entry/start.DPieiDmU.js","_app/immutable/chunks/DUphptMB.js","_app/immutable/chunks/CgpLTG9e.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/4hlrb4d8.js","_app/immutable/entry/app.D3mCZoQa.js","_app/immutable/chunks/C1FmrZbK.js","_app/immutable/chunks/CgpLTG9e.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/C_m-qMmZ.js","_app/immutable/chunks/CVxkZOGS.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/ClXQIVwo.js","_app/immutable/chunks/Bs1xm8oX.js","_app/immutable/chunks/Bxv1m9ax.js","_app/immutable/chunks/CN5En7F1.js","_app/immutable/chunks/4hlrb4d8.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
			__memo(() => import('../server/nodes/10.js')),
			__memo(() => import('../server/nodes/11.js')),
			__memo(() => import('../server/nodes/12.js')),
			__memo(() => import('../server/nodes/13.js')),
			__memo(() => import('../server/nodes/14.js'))
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
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/gallery/[id]",
				pattern: /^\/gallery\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/playground",
				pattern: /^\/playground\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/sales",
				pattern: /^\/sales\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/settings",
				pattern: /^\/settings\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/settings/admin",
				pattern: /^\/settings\/admin\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/shaders-filters",
				pattern: /^\/shaders-filters\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/todo",
				pattern: /^\/todo\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 14 },
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
