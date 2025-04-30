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
		client: {start:"_app/immutable/entry/start.DjESe4Sj.js",app:"_app/immutable/entry/app.uZNzDvfK.js",imports:["_app/immutable/entry/start.DjESe4Sj.js","_app/immutable/chunks/BimYdWYP.js","_app/immutable/chunks/BDHGhfTE.js","_app/immutable/chunks/DH2AK175.js","_app/immutable/entry/app.uZNzDvfK.js","_app/immutable/chunks/C1FmrZbK.js","_app/immutable/chunks/BDHGhfTE.js","_app/immutable/chunks/CTjs_13Y.js","_app/immutable/chunks/CvTsB6m-.js","_app/immutable/chunks/DPmhzSt5.js","_app/immutable/chunks/1K336M6a.js","_app/immutable/chunks/RZ2m-Vl7.js","_app/immutable/chunks/ChMpMzq7.js","_app/immutable/chunks/DH2AK175.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		routes: [
			
		],
		prerendered_routes: new Set(["/","/about","/auth/callback","/create","/create/__data.json","/gallery","/gallery/__data.json","/shaders-filters","/todo"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
