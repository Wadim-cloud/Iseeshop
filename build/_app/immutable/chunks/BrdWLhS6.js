import{_ as Tt}from"./C1FmrZbK.js";import{w as Dt}from"./4hlrb4d8.js";import{a as se,s as D,d as Le}from"./BX0sDDBR.js";const Ct=()=>{};var we={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fe=function(e){const t=[];let n=0;for(let r=0;r<e.length;r++){let o=e.charCodeAt(r);o<128?t[n++]=o:o<2048?(t[n++]=o>>6|192,t[n++]=o&63|128):(o&64512)===55296&&r+1<e.length&&(e.charCodeAt(r+1)&64512)===56320?(o=65536+((o&1023)<<10)+(e.charCodeAt(++r)&1023),t[n++]=o>>18|240,t[n++]=o>>12&63|128,t[n++]=o>>6&63|128,t[n++]=o&63|128):(t[n++]=o>>12|224,t[n++]=o>>6&63|128,t[n++]=o&63|128)}return t},kt=function(e){const t=[];let n=0,r=0;for(;n<e.length;){const o=e[n++];if(o<128)t[r++]=String.fromCharCode(o);else if(o>191&&o<224){const i=e[n++];t[r++]=String.fromCharCode((o&31)<<6|i&63)}else if(o>239&&o<365){const i=e[n++],s=e[n++],a=e[n++],c=((o&7)<<18|(i&63)<<12|(s&63)<<6|a&63)-65536;t[r++]=String.fromCharCode(55296+(c>>10)),t[r++]=String.fromCharCode(56320+(c&1023))}else{const i=e[n++],s=e[n++];t[r++]=String.fromCharCode((o&15)<<12|(i&63)<<6|s&63)}}return t.join("")},je={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let o=0;o<e.length;o+=3){const i=e[o],s=o+1<e.length,a=s?e[o+1]:0,c=o+2<e.length,d=c?e[o+2]:0,u=i>>2,k=(i&3)<<4|a>>4;let B=(a&15)<<2|d>>6,P=d&63;c||(P=64,s||(B=64)),r.push(n[u],n[k],n[B],n[P])}return r.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(Fe(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):kt(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();const n=t?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let o=0;o<e.length;){const i=n[e.charAt(o++)],a=o<e.length?n[e.charAt(o)]:0;++o;const d=o<e.length?n[e.charAt(o)]:64;++o;const k=o<e.length?n[e.charAt(o)]:64;if(++o,i==null||a==null||d==null||k==null)throw new Ot;const B=i<<2|a>>4;if(r.push(B),d!==64){const P=a<<4&240|d>>2;if(r.push(P),k!==64){const At=d<<6&192|k;r.push(At)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};class Ot extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Nt=function(e){const t=Fe(e);return je.encodeByteArray(t,!0)},Ve=function(e){return Nt(e).replace(/\./g,"")},Mt=function(e){try{return je.decodeString(e,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bt(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pt=()=>Bt().__FIREBASE_DEFAULTS__,Rt=()=>{if(typeof process>"u"||typeof we>"u")return;const e=we.__FIREBASE_DEFAULTS__;if(e)return JSON.parse(e)},$t=()=>{if(typeof document>"u")return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const t=e&&Mt(e[1]);return t&&JSON.parse(t)},Lt=()=>{try{return Ct()||Pt()||Rt()||$t()}catch(e){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);return}},He=()=>{var e;return(e=Lt())===null||e===void 0?void 0:e.config};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ft{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,n)=>{this.resolve=t,this.reject=n})}wrapCallback(t){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(n):t(n,r))}}}function Ue(){try{return typeof indexedDB=="object"}catch{return!1}}function xe(){return new Promise((e,t)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",o=self.indexedDB.open(r);o.onsuccess=()=>{o.result.close(),n||self.indexedDB.deleteDatabase(r),e(!0)},o.onupgradeneeded=()=>{n=!1},o.onerror=()=>{var i;t(((i=o.error)===null||i===void 0?void 0:i.message)||"")}}catch(n){t(n)}})}function jt(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vt="FirebaseError";class C extends Error{constructor(t,n,r){super(n),this.code=t,this.customData=r,this.name=Vt,Object.setPrototypeOf(this,C.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,F.prototype.create)}}class F{constructor(t,n,r){this.service=t,this.serviceName=n,this.errors=r}create(t,...n){const r=n[0]||{},o=`${this.service}/${t}`,i=this.errors[t],s=i?Ht(i,r):"Error",a=`${this.serviceName}: ${s} (${o}).`;return new C(o,a,r)}}function Ht(e,t){return e.replace(Ut,(n,r)=>{const o=t[r];return o!=null?String(o):`<${r}?>`})}const Ut=/\{\$([^}]+)}/g;function Q(e,t){if(e===t)return!0;const n=Object.keys(e),r=Object.keys(t);for(const o of n){if(!r.includes(o))return!1;const i=e[o],s=t[o];if(ye(i)&&ye(s)){if(!Q(i,s))return!1}else if(i!==s)return!1}for(const o of r)if(!n.includes(o))return!1;return!0}function ye(e){return e!==null&&typeof e=="object"}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ae(e){return e&&e._delegate?e._delegate:e}class _{constructor(t,n,r){this.name=t,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const I="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xt{constructor(t,n){this.name=t,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){const n=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(n)){const r=new Ft;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const o=this.getOrInitializeService({instanceIdentifier:n});o&&r.resolve(o)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(t){var n;const r=this.normalizeInstanceIdentifier(t==null?void 0:t.identifier),o=(n=t==null?void 0:t.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(i){if(o)return null;throw i}else{if(o)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if(zt(t))try{this.getOrInitializeService({instanceIdentifier:I})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(n);try{const i=this.getOrInitializeService({instanceIdentifier:o});r.resolve(i)}catch{}}}}clearInstance(t=I){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){const t=Array.from(this.instances.values());await Promise.all([...t.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...t.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=I){return this.instances.has(t)}getOptions(t=I){return this.instancesOptions.get(t)||{}}initialize(t={}){const{options:n={}}=t,r=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const o=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[i,s]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(i);r===a&&s.resolve(o)}return o}onInit(t,n){var r;const o=this.normalizeInstanceIdentifier(n),i=(r=this.onInitCallbacks.get(o))!==null&&r!==void 0?r:new Set;i.add(t),this.onInitCallbacks.set(o,i);const s=this.instances.get(o);return s&&t(s,o),()=>{i.delete(t)}}invokeOnInitCallbacks(t,n){const r=this.onInitCallbacks.get(n);if(r)for(const o of r)try{o(t,n)}catch{}}getOrInitializeService({instanceIdentifier:t,options:n={}}){let r=this.instances.get(t);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Kt(t),options:n}),this.instances.set(t,r),this.instancesOptions.set(t,n),this.invokeOnInitCallbacks(r,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,r)}catch{}return r||null}normalizeInstanceIdentifier(t=I){return this.component?this.component.multipleInstances?t:I:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Kt(e){return e===I?void 0:e}function zt(e){return e.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wt{constructor(t){this.name=t,this.providers=new Map}addComponent(t){const n=this.getProvider(t.name);if(n.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);n.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);const n=new xt(t,this);return this.providers.set(t,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var l;(function(e){e[e.DEBUG=0]="DEBUG",e[e.VERBOSE=1]="VERBOSE",e[e.INFO=2]="INFO",e[e.WARN=3]="WARN",e[e.ERROR=4]="ERROR",e[e.SILENT=5]="SILENT"})(l||(l={}));const qt={debug:l.DEBUG,verbose:l.VERBOSE,info:l.INFO,warn:l.WARN,error:l.ERROR,silent:l.SILENT},Gt=l.INFO,Jt={[l.DEBUG]:"log",[l.VERBOSE]:"log",[l.INFO]:"info",[l.WARN]:"warn",[l.ERROR]:"error"},Yt=(e,t,...n)=>{if(t<e.logLevel)return;const r=new Date().toISOString(),o=Jt[t];if(o)console[o](`[${r}]  ${e.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class Xt{constructor(t){this.name=t,this._logLevel=Gt,this._logHandler=Yt,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in l))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?qt[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,l.DEBUG,...t),this._logHandler(this,l.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,l.VERBOSE,...t),this._logHandler(this,l.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,l.INFO,...t),this._logHandler(this,l.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,l.WARN,...t),this._logHandler(this,l.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,l.ERROR,...t),this._logHandler(this,l.ERROR,...t)}}const Zt=(e,t)=>t.some(n=>e instanceof n);let _e,Ie;function Qt(){return _e||(_e=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function en(){return Ie||(Ie=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Ke=new WeakMap,ee=new WeakMap,ze=new WeakMap,x=new WeakMap,ce=new WeakMap;function tn(e){const t=new Promise((n,r)=>{const o=()=>{e.removeEventListener("success",i),e.removeEventListener("error",s)},i=()=>{n(m(e.result)),o()},s=()=>{r(e.error),o()};e.addEventListener("success",i),e.addEventListener("error",s)});return t.then(n=>{n instanceof IDBCursor&&Ke.set(n,e)}).catch(()=>{}),ce.set(t,e),t}function nn(e){if(ee.has(e))return;const t=new Promise((n,r)=>{const o=()=>{e.removeEventListener("complete",i),e.removeEventListener("error",s),e.removeEventListener("abort",s)},i=()=>{n(),o()},s=()=>{r(e.error||new DOMException("AbortError","AbortError")),o()};e.addEventListener("complete",i),e.addEventListener("error",s),e.addEventListener("abort",s)});ee.set(e,t)}let te={get(e,t,n){if(e instanceof IDBTransaction){if(t==="done")return ee.get(e);if(t==="objectStoreNames")return e.objectStoreNames||ze.get(e);if(t==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return m(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function rn(e){te=e(te)}function on(e){return e===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...n){const r=e.call(K(this),t,...n);return ze.set(r,t.sort?t.sort():[t]),m(r)}:en().includes(e)?function(...t){return e.apply(K(this),t),m(Ke.get(this))}:function(...t){return m(e.apply(K(this),t))}}function sn(e){return typeof e=="function"?on(e):(e instanceof IDBTransaction&&nn(e),Zt(e,Qt())?new Proxy(e,te):e)}function m(e){if(e instanceof IDBRequest)return tn(e);if(x.has(e))return x.get(e);const t=sn(e);return t!==e&&(x.set(e,t),ce.set(t,e)),t}const K=e=>ce.get(e);function j(e,t,{blocked:n,upgrade:r,blocking:o,terminated:i}={}){const s=indexedDB.open(e,t),a=m(s);return r&&s.addEventListener("upgradeneeded",c=>{r(m(s.result),c.oldVersion,c.newVersion,m(s.transaction),c)}),n&&s.addEventListener("blocked",c=>n(c.oldVersion,c.newVersion,c)),a.then(c=>{i&&c.addEventListener("close",()=>i()),o&&c.addEventListener("versionchange",d=>o(d.oldVersion,d.newVersion,d))}).catch(()=>{}),a}function z(e,{blocked:t}={}){const n=indexedDB.deleteDatabase(e);return t&&n.addEventListener("blocked",r=>t(r.oldVersion,r)),m(n).then(()=>{})}const an=["get","getKey","getAll","getAllKeys","count"],cn=["put","add","delete","clear"],W=new Map;function Ee(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(W.get(t))return W.get(t);const n=t.replace(/FromIndex$/,""),r=t!==n,o=cn.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(o||an.includes(n)))return;const i=async function(s,...a){const c=this.transaction(s,o?"readwrite":"readonly");let d=c.store;return r&&(d=d.index(a.shift())),(await Promise.all([d[n](...a),o&&c.done]))[0]};return W.set(t,i),i}rn(e=>({...e,get:(t,n,r)=>Ee(t,n)||e.get(t,n,r),has:(t,n)=>!!Ee(t,n)||e.has(t,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class un{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(dn(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function dn(e){const t=e.getComponent();return(t==null?void 0:t.type)==="VERSION"}const ne="@firebase/app",Se="0.11.5";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const b=new Xt("@firebase/app"),ln="@firebase/app-compat",fn="@firebase/analytics-compat",hn="@firebase/analytics",pn="@firebase/app-check-compat",gn="@firebase/app-check",mn="@firebase/auth",bn="@firebase/auth-compat",wn="@firebase/database",yn="@firebase/data-connect",_n="@firebase/database-compat",In="@firebase/functions",En="@firebase/functions-compat",Sn="@firebase/installations",vn="@firebase/installations-compat",An="@firebase/messaging",Tn="@firebase/messaging-compat",Dn="@firebase/performance",Cn="@firebase/performance-compat",kn="@firebase/remote-config",On="@firebase/remote-config-compat",Nn="@firebase/storage",Mn="@firebase/storage-compat",Bn="@firebase/firestore",Pn="@firebase/vertexai",Rn="@firebase/firestore-compat",$n="firebase";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const re="[DEFAULT]",Ln={[ne]:"fire-core",[ln]:"fire-core-compat",[hn]:"fire-analytics",[fn]:"fire-analytics-compat",[gn]:"fire-app-check",[pn]:"fire-app-check-compat",[mn]:"fire-auth",[bn]:"fire-auth-compat",[wn]:"fire-rtdb",[yn]:"fire-data-connect",[_n]:"fire-rtdb-compat",[In]:"fire-fn",[En]:"fire-fn-compat",[Sn]:"fire-iid",[vn]:"fire-iid-compat",[An]:"fire-fcm",[Tn]:"fire-fcm-compat",[Dn]:"fire-perf",[Cn]:"fire-perf-compat",[kn]:"fire-rc",[On]:"fire-rc-compat",[Nn]:"fire-gcs",[Mn]:"fire-gcs-compat",[Bn]:"fire-fst",[Rn]:"fire-fst-compat",[Pn]:"fire-vertex","fire-js":"fire-js",[$n]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $=new Map,Fn=new Map,oe=new Map;function ve(e,t){try{e.container.addComponent(t)}catch(n){b.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function S(e){const t=e.name;if(oe.has(t))return b.debug(`There were multiple attempts to register component ${t}.`),!1;oe.set(t,e);for(const n of $.values())ve(n,e);for(const n of Fn.values())ve(n,e);return!0}function ue(e,t){const n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jn={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},w=new F("app","Firebase",jn);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vn{constructor(t,n,r){this._isDeleted=!1,this._options=Object.assign({},t),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new _("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw w.create("app-deleted",{appName:this._name})}}function We(e,t={}){let n=e;typeof t!="object"&&(t={name:t});const r=Object.assign({name:re,automaticDataCollectionEnabled:!1},t),o=r.name;if(typeof o!="string"||!o)throw w.create("bad-app-name",{appName:String(o)});if(n||(n=He()),!n)throw w.create("no-options");const i=$.get(o);if(i){if(Q(n,i.options)&&Q(r,i.config))return i;throw w.create("duplicate-app",{appName:o})}const s=new Wt(o);for(const c of oe.values())s.addComponent(c);const a=new Vn(n,r,s);return $.set(o,a),a}function Hn(e=re){const t=$.get(e);if(!t&&e===re&&He())return We();if(!t)throw w.create("no-app",{appName:e});return t}function y(e,t,n){var r;let o=(r=Ln[e])!==null&&r!==void 0?r:e;n&&(o+=`-${n}`);const i=o.match(/\s|\//),s=t.match(/\s|\//);if(i||s){const a=[`Unable to register library "${o}" with version "${t}":`];i&&a.push(`library name "${o}" contains illegal characters (whitespace or "/")`),i&&s&&a.push("and"),s&&a.push(`version name "${t}" contains illegal characters (whitespace or "/")`),b.warn(a.join(" "));return}S(new _(`${o}-version`,()=>({library:o,version:t}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Un="firebase-heartbeat-database",xn=1,O="firebase-heartbeat-store";let q=null;function qe(){return q||(q=j(Un,xn,{upgrade:(e,t)=>{switch(t){case 0:try{e.createObjectStore(O)}catch(n){console.warn(n)}}}}).catch(e=>{throw w.create("idb-open",{originalErrorMessage:e.message})})),q}async function Kn(e){try{const n=(await qe()).transaction(O),r=await n.objectStore(O).get(Ge(e));return await n.done,r}catch(t){if(t instanceof C)b.warn(t.message);else{const n=w.create("idb-get",{originalErrorMessage:t==null?void 0:t.message});b.warn(n.message)}}}async function Ae(e,t){try{const r=(await qe()).transaction(O,"readwrite");await r.objectStore(O).put(t,Ge(e)),await r.done}catch(n){if(n instanceof C)b.warn(n.message);else{const r=w.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});b.warn(r.message)}}}function Ge(e){return`${e.name}!${e.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zn=1024,Wn=30;class qn{constructor(t){this.container=t,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new Jn(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var t,n;try{const o=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=Te();if(((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(s=>s.date===i))return;if(this._heartbeatsCache.heartbeats.push({date:i,agent:o}),this._heartbeatsCache.heartbeats.length>Wn){const s=Yn(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(s,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){b.warn(r)}}async getHeartbeatsHeader(){var t;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Te(),{heartbeatsToSend:r,unsentEntries:o}=Gn(this._heartbeatsCache.heartbeats),i=Ve(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,o.length>0?(this._heartbeatsCache.heartbeats=o,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(n){return b.warn(n),""}}}function Te(){return new Date().toISOString().substring(0,10)}function Gn(e,t=zn){const n=[];let r=e.slice();for(const o of e){const i=n.find(s=>s.agent===o.agent);if(i){if(i.dates.push(o.date),De(n)>t){i.dates.pop();break}}else if(n.push({agent:o.agent,dates:[o.date]}),De(n)>t){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class Jn{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Ue()?xe().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Kn(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){var n;if(await this._canUseIndexedDBPromise){const o=await this.read();return Ae(this.app,{lastSentHeartbeatDate:(n=t.lastSentHeartbeatDate)!==null&&n!==void 0?n:o.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){var n;if(await this._canUseIndexedDBPromise){const o=await this.read();return Ae(this.app,{lastSentHeartbeatDate:(n=t.lastSentHeartbeatDate)!==null&&n!==void 0?n:o.lastSentHeartbeatDate,heartbeats:[...o.heartbeats,...t.heartbeats]})}else return}}function De(e){return Ve(JSON.stringify({version:2,heartbeats:e})).length}function Yn(e){if(e.length===0)return-1;let t=0,n=e[0].date;for(let r=1;r<e.length;r++)e[r].date<n&&(n=e[r].date,t=r);return t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xn(e){S(new _("platform-logger",t=>new un(t),"PRIVATE")),S(new _("heartbeat",t=>new qn(t),"PRIVATE")),y(ne,Se,e),y(ne,Se,"esm2017"),y("fire-js","")}Xn("");var Zn="firebase",Qn="11.6.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */y(Zn,Qn,"app");const Je="@firebase/installations",de="0.6.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ye=1e4,Xe=`w:${de}`,Ze="FIS_v2",er="https://firebaseinstallations.googleapis.com/v1",tr=60*60*1e3,nr="installations",rr="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const or={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},v=new F(nr,rr,or);function Qe(e){return e instanceof C&&e.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function et({projectId:e}){return`${er}/projects/${e}/installations`}function tt(e){return{token:e.token,requestStatus:2,expiresIn:sr(e.expiresIn),creationTime:Date.now()}}async function nt(e,t){const r=(await t.json()).error;return v.create("request-failed",{requestName:e,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function rt({apiKey:e}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e})}function ir(e,{refreshToken:t}){const n=rt(e);return n.append("Authorization",ar(t)),n}async function ot(e){const t=await e();return t.status>=500&&t.status<600?e():t}function sr(e){return Number(e.replace("s","000"))}function ar(e){return`${Ze} ${e}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function cr({appConfig:e,heartbeatServiceProvider:t},{fid:n}){const r=et(e),o=rt(e),i=t.getImmediate({optional:!0});if(i){const d=await i.getHeartbeatsHeader();d&&o.append("x-firebase-client",d)}const s={fid:n,authVersion:Ze,appId:e.appId,sdkVersion:Xe},a={method:"POST",headers:o,body:JSON.stringify(s)},c=await ot(()=>fetch(r,a));if(c.ok){const d=await c.json();return{fid:d.fid||n,registrationStatus:2,refreshToken:d.refreshToken,authToken:tt(d.authToken)}}else throw await nt("Create Installation",c)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function it(e){return new Promise(t=>{setTimeout(t,e)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ur(e){return btoa(String.fromCharCode(...e)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dr=/^[cdef][\w-]{21}$/,ie="";function lr(){try{const e=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(e),e[0]=112+e[0]%16;const n=fr(e);return dr.test(n)?n:ie}catch{return ie}}function fr(e){return ur(e).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function V(e){return`${e.appName}!${e.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const st=new Map;function at(e,t){const n=V(e);ct(n,t),hr(n,t)}function ct(e,t){const n=st.get(e);if(n)for(const r of n)r(t)}function hr(e,t){const n=pr();n&&n.postMessage({key:e,fid:t}),gr()}let E=null;function pr(){return!E&&"BroadcastChannel"in self&&(E=new BroadcastChannel("[Firebase] FID Change"),E.onmessage=e=>{ct(e.data.key,e.data.fid)}),E}function gr(){st.size===0&&E&&(E.close(),E=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mr="firebase-installations-database",br=1,A="firebase-installations-store";let G=null;function le(){return G||(G=j(mr,br,{upgrade:(e,t)=>{switch(t){case 0:e.createObjectStore(A)}}})),G}async function L(e,t){const n=V(e),o=(await le()).transaction(A,"readwrite"),i=o.objectStore(A),s=await i.get(n);return await i.put(t,n),await o.done,(!s||s.fid!==t.fid)&&at(e,t.fid),t}async function ut(e){const t=V(e),r=(await le()).transaction(A,"readwrite");await r.objectStore(A).delete(t),await r.done}async function H(e,t){const n=V(e),o=(await le()).transaction(A,"readwrite"),i=o.objectStore(A),s=await i.get(n),a=t(s);return a===void 0?await i.delete(n):await i.put(a,n),await o.done,a&&(!s||s.fid!==a.fid)&&at(e,a.fid),a}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function fe(e){let t;const n=await H(e.appConfig,r=>{const o=wr(r),i=yr(e,o);return t=i.registrationPromise,i.installationEntry});return n.fid===ie?{installationEntry:await t}:{installationEntry:n,registrationPromise:t}}function wr(e){const t=e||{fid:lr(),registrationStatus:0};return dt(t)}function yr(e,t){if(t.registrationStatus===0){if(!navigator.onLine){const o=Promise.reject(v.create("app-offline"));return{installationEntry:t,registrationPromise:o}}const n={fid:t.fid,registrationStatus:1,registrationTime:Date.now()},r=_r(e,n);return{installationEntry:n,registrationPromise:r}}else return t.registrationStatus===1?{installationEntry:t,registrationPromise:Ir(e)}:{installationEntry:t}}async function _r(e,t){try{const n=await cr(e,t);return L(e.appConfig,n)}catch(n){throw Qe(n)&&n.customData.serverCode===409?await ut(e.appConfig):await L(e.appConfig,{fid:t.fid,registrationStatus:0}),n}}async function Ir(e){let t=await Ce(e.appConfig);for(;t.registrationStatus===1;)await it(100),t=await Ce(e.appConfig);if(t.registrationStatus===0){const{installationEntry:n,registrationPromise:r}=await fe(e);return r||n}return t}function Ce(e){return H(e,t=>{if(!t)throw v.create("installation-not-found");return dt(t)})}function dt(e){return Er(e)?{fid:e.fid,registrationStatus:0}:e}function Er(e){return e.registrationStatus===1&&e.registrationTime+Ye<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Sr({appConfig:e,heartbeatServiceProvider:t},n){const r=vr(e,n),o=ir(e,n),i=t.getImmediate({optional:!0});if(i){const d=await i.getHeartbeatsHeader();d&&o.append("x-firebase-client",d)}const s={installation:{sdkVersion:Xe,appId:e.appId}},a={method:"POST",headers:o,body:JSON.stringify(s)},c=await ot(()=>fetch(r,a));if(c.ok){const d=await c.json();return tt(d)}else throw await nt("Generate Auth Token",c)}function vr(e,{fid:t}){return`${et(e)}/${t}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function he(e,t=!1){let n;const r=await H(e.appConfig,i=>{if(!lt(i))throw v.create("not-registered");const s=i.authToken;if(!t&&Dr(s))return i;if(s.requestStatus===1)return n=Ar(e,t),i;{if(!navigator.onLine)throw v.create("app-offline");const a=kr(i);return n=Tr(e,a),a}});return n?await n:r.authToken}async function Ar(e,t){let n=await ke(e.appConfig);for(;n.authToken.requestStatus===1;)await it(100),n=await ke(e.appConfig);const r=n.authToken;return r.requestStatus===0?he(e,t):r}function ke(e){return H(e,t=>{if(!lt(t))throw v.create("not-registered");const n=t.authToken;return Or(n)?Object.assign(Object.assign({},t),{authToken:{requestStatus:0}}):t})}async function Tr(e,t){try{const n=await Sr(e,t),r=Object.assign(Object.assign({},t),{authToken:n});return await L(e.appConfig,r),n}catch(n){if(Qe(n)&&(n.customData.serverCode===401||n.customData.serverCode===404))await ut(e.appConfig);else{const r=Object.assign(Object.assign({},t),{authToken:{requestStatus:0}});await L(e.appConfig,r)}throw n}}function lt(e){return e!==void 0&&e.registrationStatus===2}function Dr(e){return e.requestStatus===2&&!Cr(e)}function Cr(e){const t=Date.now();return t<e.creationTime||e.creationTime+e.expiresIn<t+tr}function kr(e){const t={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},e),{authToken:t})}function Or(e){return e.requestStatus===1&&e.requestTime+Ye<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Nr(e){const t=e,{installationEntry:n,registrationPromise:r}=await fe(t);return r?r.catch(console.error):he(t).catch(console.error),n.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Mr(e,t=!1){const n=e;return await Br(n),(await he(n,t)).token}async function Br(e){const{registrationPromise:t}=await fe(e);t&&await t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pr(e){if(!e||!e.options)throw J("App Configuration");if(!e.name)throw J("App Name");const t=["projectId","apiKey","appId"];for(const n of t)if(!e.options[n])throw J(n);return{appName:e.name,projectId:e.options.projectId,apiKey:e.options.apiKey,appId:e.options.appId}}function J(e){return v.create("missing-app-config-values",{valueName:e})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ft="installations",Rr="installations-internal",$r=e=>{const t=e.getProvider("app").getImmediate(),n=Pr(t),r=ue(t,"heartbeat");return{app:t,appConfig:n,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},Lr=e=>{const t=e.getProvider("app").getImmediate(),n=ue(t,ft).getImmediate();return{getId:()=>Nr(n),getToken:o=>Mr(n,o)}};function Fr(){S(new _(ft,$r,"PUBLIC")),S(new _(Rr,Lr,"PRIVATE"))}Fr();y(Je,de);y(Je,de,"esm2017");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jr="/firebase-messaging-sw.js",Vr="/firebase-cloud-messaging-push-scope",ht="BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",Hr="https://fcmregistrations.googleapis.com/v1",pt="google.c.a.c_id",Ur="google.c.a.c_l",xr="google.c.a.ts",Kr="google.c.a.e",Oe=1e4;var Ne;(function(e){e[e.DATA_MESSAGE=1]="DATA_MESSAGE",e[e.DISPLAY_NOTIFICATION=3]="DISPLAY_NOTIFICATION"})(Ne||(Ne={}));/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */var N;(function(e){e.PUSH_RECEIVED="push-received",e.NOTIFICATION_CLICKED="notification-clicked"})(N||(N={}));/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function g(e){const t=new Uint8Array(e);return btoa(String.fromCharCode(...t)).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function zr(e){const t="=".repeat((4-e.length%4)%4),n=(e+t).replace(/\-/g,"+").replace(/_/g,"/"),r=atob(n),o=new Uint8Array(r.length);for(let i=0;i<r.length;++i)o[i]=r.charCodeAt(i);return o}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Y="fcm_token_details_db",Wr=5,Me="fcm_token_object_Store";async function qr(e){if("databases"in indexedDB&&!(await indexedDB.databases()).map(i=>i.name).includes(Y))return null;let t=null;return(await j(Y,Wr,{upgrade:async(r,o,i,s)=>{var a;if(o<2||!r.objectStoreNames.contains(Me))return;const c=s.objectStore(Me),d=await c.index("fcmSenderId").get(e);if(await c.clear(),!!d){if(o===2){const u=d;if(!u.auth||!u.p256dh||!u.endpoint)return;t={token:u.fcmToken,createTime:(a=u.createTime)!==null&&a!==void 0?a:Date.now(),subscriptionOptions:{auth:u.auth,p256dh:u.p256dh,endpoint:u.endpoint,swScope:u.swScope,vapidKey:typeof u.vapidKey=="string"?u.vapidKey:g(u.vapidKey)}}}else if(o===3){const u=d;t={token:u.fcmToken,createTime:u.createTime,subscriptionOptions:{auth:g(u.auth),p256dh:g(u.p256dh),endpoint:u.endpoint,swScope:u.swScope,vapidKey:g(u.vapidKey)}}}else if(o===4){const u=d;t={token:u.fcmToken,createTime:u.createTime,subscriptionOptions:{auth:g(u.auth),p256dh:g(u.p256dh),endpoint:u.endpoint,swScope:u.swScope,vapidKey:g(u.vapidKey)}}}}}})).close(),await z(Y),await z("fcm_vapid_details_db"),await z("undefined"),Gr(t)?t:null}function Gr(e){if(!e||!e.subscriptionOptions)return!1;const{subscriptionOptions:t}=e;return typeof e.createTime=="number"&&e.createTime>0&&typeof e.token=="string"&&e.token.length>0&&typeof t.auth=="string"&&t.auth.length>0&&typeof t.p256dh=="string"&&t.p256dh.length>0&&typeof t.endpoint=="string"&&t.endpoint.length>0&&typeof t.swScope=="string"&&t.swScope.length>0&&typeof t.vapidKey=="string"&&t.vapidKey.length>0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jr="firebase-messaging-database",Yr=1,M="firebase-messaging-store";let X=null;function gt(){return X||(X=j(Jr,Yr,{upgrade:(e,t)=>{switch(t){case 0:e.createObjectStore(M)}}})),X}async function Xr(e){const t=mt(e),r=await(await gt()).transaction(M).objectStore(M).get(t);if(r)return r;{const o=await qr(e.appConfig.senderId);if(o)return await pe(e,o),o}}async function pe(e,t){const n=mt(e),o=(await gt()).transaction(M,"readwrite");return await o.objectStore(M).put(t,n),await o.done,t}function mt({appConfig:e}){return e.appId}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zr={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"only-available-in-window":"This method is available in a Window context.","only-available-in-sw":"This method is available in a service worker context.","permission-default":"The notification permission was not granted and dismissed instead.","permission-blocked":"The notification permission was not granted and blocked instead.","unsupported-browser":"This browser doesn't support the API's required to use the Firebase SDK.","indexed-db-unsupported":"This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)","failed-service-worker-registration":"We are unable to register the default service worker. {$browserErrorMessage}","token-subscribe-failed":"A problem occurred while subscribing the user to FCM: {$errorInfo}","token-subscribe-no-token":"FCM returned no token when subscribing the user to push.","token-unsubscribe-failed":"A problem occurred while unsubscribing the user from FCM: {$errorInfo}","token-update-failed":"A problem occurred while updating the user from FCM: {$errorInfo}","token-update-no-token":"FCM returned no token when updating the user to push.","use-sw-after-get-token":"The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.","invalid-sw-registration":"The input to useServiceWorker() must be a ServiceWorkerRegistration.","invalid-bg-handler":"The input to setBackgroundMessageHandler() must be a function.","invalid-vapid-key":"The public VAPID key must be a string.","use-vapid-key-after-get-token":"The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used."},f=new F("messaging","Messaging",Zr);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Qr(e,t){const n=await me(e),r=bt(t),o={method:"POST",headers:n,body:JSON.stringify(r)};let i;try{i=await(await fetch(ge(e.appConfig),o)).json()}catch(s){throw f.create("token-subscribe-failed",{errorInfo:s==null?void 0:s.toString()})}if(i.error){const s=i.error.message;throw f.create("token-subscribe-failed",{errorInfo:s})}if(!i.token)throw f.create("token-subscribe-no-token");return i.token}async function eo(e,t){const n=await me(e),r=bt(t.subscriptionOptions),o={method:"PATCH",headers:n,body:JSON.stringify(r)};let i;try{i=await(await fetch(`${ge(e.appConfig)}/${t.token}`,o)).json()}catch(s){throw f.create("token-update-failed",{errorInfo:s==null?void 0:s.toString()})}if(i.error){const s=i.error.message;throw f.create("token-update-failed",{errorInfo:s})}if(!i.token)throw f.create("token-update-no-token");return i.token}async function to(e,t){const r={method:"DELETE",headers:await me(e)};try{const i=await(await fetch(`${ge(e.appConfig)}/${t}`,r)).json();if(i.error){const s=i.error.message;throw f.create("token-unsubscribe-failed",{errorInfo:s})}}catch(o){throw f.create("token-unsubscribe-failed",{errorInfo:o==null?void 0:o.toString()})}}function ge({projectId:e}){return`${Hr}/projects/${e}/registrations`}async function me({appConfig:e,installations:t}){const n=await t.getToken();return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e.apiKey,"x-goog-firebase-installations-auth":`FIS ${n}`})}function bt({p256dh:e,auth:t,endpoint:n,vapidKey:r}){const o={web:{endpoint:n,auth:t,p256dh:e}};return r!==ht&&(o.web.applicationPubKey=r),o}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const no=7*24*60*60*1e3;async function ro(e){const t=await io(e.swRegistration,e.vapidKey),n={vapidKey:e.vapidKey,swScope:e.swRegistration.scope,endpoint:t.endpoint,auth:g(t.getKey("auth")),p256dh:g(t.getKey("p256dh"))},r=await Xr(e.firebaseDependencies);if(r){if(so(r.subscriptionOptions,n))return Date.now()>=r.createTime+no?oo(e,{token:r.token,createTime:Date.now(),subscriptionOptions:n}):r.token;try{await to(e.firebaseDependencies,r.token)}catch(o){console.warn(o)}return Be(e.firebaseDependencies,n)}else return Be(e.firebaseDependencies,n)}async function oo(e,t){try{const n=await eo(e.firebaseDependencies,t),r=Object.assign(Object.assign({},t),{token:n,createTime:Date.now()});return await pe(e.firebaseDependencies,r),n}catch(n){throw n}}async function Be(e,t){const r={token:await Qr(e,t),createTime:Date.now(),subscriptionOptions:t};return await pe(e,r),r.token}async function io(e,t){const n=await e.pushManager.getSubscription();return n||e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:zr(t)})}function so(e,t){const n=t.vapidKey===e.vapidKey,r=t.endpoint===e.endpoint,o=t.auth===e.auth,i=t.p256dh===e.p256dh;return n&&r&&o&&i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pe(e){const t={from:e.from,collapseKey:e.collapse_key,messageId:e.fcmMessageId};return ao(t,e),co(t,e),uo(t,e),t}function ao(e,t){if(!t.notification)return;e.notification={};const n=t.notification.title;n&&(e.notification.title=n);const r=t.notification.body;r&&(e.notification.body=r);const o=t.notification.image;o&&(e.notification.image=o);const i=t.notification.icon;i&&(e.notification.icon=i)}function co(e,t){t.data&&(e.data=t.data)}function uo(e,t){var n,r,o,i,s;if(!t.fcmOptions&&!(!((n=t.notification)===null||n===void 0)&&n.click_action))return;e.fcmOptions={};const a=(o=(r=t.fcmOptions)===null||r===void 0?void 0:r.link)!==null&&o!==void 0?o:(i=t.notification)===null||i===void 0?void 0:i.click_action;a&&(e.fcmOptions.link=a);const c=(s=t.fcmOptions)===null||s===void 0?void 0:s.analytics_label;c&&(e.fcmOptions.analyticsLabel=c)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lo(e){return typeof e=="object"&&!!e&&pt in e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fo(e){if(!e||!e.options)throw Z("App Configuration Object");if(!e.name)throw Z("App Name");const t=["projectId","apiKey","appId","messagingSenderId"],{options:n}=e;for(const r of t)if(!n[r])throw Z(r);return{appName:e.name,projectId:n.projectId,apiKey:n.apiKey,appId:n.appId,senderId:n.messagingSenderId}}function Z(e){return f.create("missing-app-config-values",{valueName:e})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ho{constructor(t,n,r){this.deliveryMetricsExportedToBigQueryEnabled=!1,this.onBackgroundMessageHandler=null,this.onMessageHandler=null,this.logEvents=[],this.isLogServiceStarted=!1;const o=fo(t);this.firebaseDependencies={app:t,appConfig:o,installations:n,analyticsProvider:r}}_delete(){return Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function po(e){try{e.swRegistration=await navigator.serviceWorker.register(jr,{scope:Vr}),e.swRegistration.update().catch(()=>{}),await go(e.swRegistration)}catch(t){throw f.create("failed-service-worker-registration",{browserErrorMessage:t==null?void 0:t.message})}}async function go(e){return new Promise((t,n)=>{const r=setTimeout(()=>n(new Error(`Service worker not registered after ${Oe} ms`)),Oe),o=e.installing||e.waiting;e.active?(clearTimeout(r),t()):o?o.onstatechange=i=>{var s;((s=i.target)===null||s===void 0?void 0:s.state)==="activated"&&(o.onstatechange=null,clearTimeout(r),t())}:(clearTimeout(r),n(new Error("No incoming service worker found.")))})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function mo(e,t){if(!t&&!e.swRegistration&&await po(e),!(!t&&e.swRegistration)){if(!(t instanceof ServiceWorkerRegistration))throw f.create("invalid-sw-registration");e.swRegistration=t}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bo(e,t){t?e.vapidKey=t:e.vapidKey||(e.vapidKey=ht)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function wt(e,t){if(!navigator)throw f.create("only-available-in-window");if(Notification.permission==="default"&&await Notification.requestPermission(),Notification.permission!=="granted")throw f.create("permission-blocked");return await bo(e,t==null?void 0:t.vapidKey),await mo(e,t==null?void 0:t.serviceWorkerRegistration),ro(e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function wo(e,t,n){const r=yo(t);(await e.firebaseDependencies.analyticsProvider.get()).logEvent(r,{message_id:n[pt],message_name:n[Ur],message_time:n[xr],message_device_time:Math.floor(Date.now()/1e3)})}function yo(e){switch(e){case N.NOTIFICATION_CLICKED:return"notification_open";case N.PUSH_RECEIVED:return"notification_foreground";default:throw new Error}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _o(e,t){const n=t.data;if(!n.isFirebaseMessaging)return;e.onMessageHandler&&n.messageType===N.PUSH_RECEIVED&&(typeof e.onMessageHandler=="function"?e.onMessageHandler(Pe(n)):e.onMessageHandler.next(Pe(n)));const r=n.data;lo(r)&&r[Kr]==="1"&&await wo(e,n.messageType,r)}const Re="@firebase/messaging",$e="0.12.17";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Io=e=>{const t=new ho(e.getProvider("app").getImmediate(),e.getProvider("installations-internal").getImmediate(),e.getProvider("analytics-internal"));return navigator.serviceWorker.addEventListener("message",n=>_o(t,n)),t},Eo=e=>{const t=e.getProvider("messaging").getImmediate();return{getToken:r=>wt(t,r)}};function So(){S(new _("messaging",Io,"PUBLIC")),S(new _("messaging-internal",Eo,"PRIVATE")),y(Re,$e),y(Re,$e,"esm2017")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yt(){try{await xe()}catch{return!1}return typeof window<"u"&&Ue()&&jt()&&"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window&&"fetch"in window&&ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification")&&PushSubscription.prototype.hasOwnProperty("getKey")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vo(e,t){if(!navigator)throw f.create("only-available-in-window");return e.onMessageHandler=t,()=>{e.onMessageHandler=null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _t(e=Hn()){return yt().then(t=>{if(!t)throw f.create("unsupported-browser")},t=>{throw f.create("indexed-db-unsupported")}),ue(ae(e),"messaging").getImmediate()}async function Ao(e,t){return e=ae(e),wt(e,t)}function It(e,t){return e=ae(e),vo(e,t)}So();const To=Object.freeze(Object.defineProperty({__proto__:null,getMessaging:_t,getToken:Ao,isSupported:yt,onMessage:It},Symbol.toStringTag,{value:"Module"})),Do={BASE_URL:"./",DEV:!1,MODE:"production",PROD:!0,SSR:!1,VITE_PUBLIC_FIREBASE_API_KEY:"AIzaSyAAfD9sA_JRIR7aMmc9Dpd0Vtnff-7JJ28",VITE_PUBLIC_FIREBASE_APP_ID:"1:501065720855:web:b28637c7cf2a4f92be2852",VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:"501065720855",VITE_PUBLIC_SUPABASE_ANON_KEY:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhYXB6dnNucnpzdWh0b3dtaWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyNjM0ODMsImV4cCI6MjA0ODgzOTQ4M30.pOozDGMkZ3dZUwTUh35fvny5bfE16QVWlC146dZgUI0",VITE_PUBLIC_SUPABASE_API_KEY:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhYXB6dnNucnpzdWh0b3dtaWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyNjM0ODMsImV4cCI6MjA0ODgzOTQ4M30.pOozDGMkZ3dZUwTUh35fvny5bfE16QVWlC146dZgUI0",VITE_PUBLIC_SUPABASE_URL:"https://paapzvsnrzsuhtowmihz.supabase.co",VITE_PUBLIC_VAPID_KEY:"BELklaUjBuMlZTLleQ8YIbcs0FrMIccru9Usr5LG2ly7unLOknEOw0LvOg4TSN0DKH77TdCOVEdXb3paVlN8Gic",VITE_SUPABASE_JWT_SECRET:"HkLLvIxzi2MZg6NgEyHRly+y1hG/k/UGaLXj5ErviJjXp0Mni++l5JTRNitxpuivWztP8RIlFgIzZ/w5Xue+nQ=="},Co=["VITE_PUBLIC_FIREBASE_API_KEY","VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID","VITE_PUBLIC_FIREBASE_APP_ID","VITE_PUBLIC_VAPID_KEY"];for(const e of Co)if(!Do[e])throw new Error(`Missing environment variable: ${e}`);const ko={apiKey:"AIzaSyAAfD9sA_JRIR7aMmc9Dpd0Vtnff-7JJ28",authDomain:"draw-26a0c.firebaseapp.com",projectId:"draw-26a0c",storageBucket:"draw-26a0c.appspot.com",messagingSenderId:"501065720855",appId:"1:501065720855:web:b28637c7cf2a4f92be2852"};let T=null;{const e=We(ko);T=_t(e)}function be(e,t){const n=e instanceof Error?e.message:t;return console.error(t,e),n}const Oo={notifications:{new_user:!1,comment:!1,order:!1,drawing:!1},role:null,loading:!1,error:null,success:null,toast:{message:"",type:"success",show:!1},unreadCount:0},h=Dt(Oo),p=new Map;function Et(){let e;return h.subscribe(t=>e=t)(),e}async function Po(){console.log("loadProfile: Starting profile load"),h.update(e=>({...e,loading:!0,error:null}));try{const e=await se();if(!e)throw console.error("loadProfile: No authenticated user"),new Error("User not authenticated");const{data:t,error:n}=await D.from("profiles").select("user_id, role, notify_new_users, notify_comments, notify_orders, notify_drawings").eq("user_id",e.id).single();if(n)throw console.error("loadProfile: Supabase error:",n),n;t&&(h.update(r=>({...r,notifications:{new_user:t.notify_new_users??!1,comment:t.notify_comments??!1,order:t.notify_orders??!1,drawing:t.notify_drawings??!1},role:t.role})),await U(e.id))}catch(e){const t=be(e,"Failed to load profile");h.update(n=>({...n,error:t})),console.error("loadProfile: Error:",t)}finally{h.update(e=>({...e,loading:!1}))}}async function Ro(){console.log("updateSettings: Starting settings update"),h.update(e=>({...e,loading:!0,error:null,success:null}));try{const e=await se();if(!e)throw new Error("User not authenticated");const{notifications:t}=Et(),{error:n}=await D.from("profiles").update({notify_new_users:t.new_user,notify_comments:t.comment,notify_orders:t.order,notify_drawings:t.drawing}).eq("user_id",e.id);if(n)throw n;Object.values(t).some(Boolean)?(await St(e.id),await vt(e.id)):await R(e.id),h.update(o=>({...o,success:"Settings updated successfully",toast:{message:"Settings saved successfully",type:"success",show:!0}}))}catch(e){const t=be(e,"Failed to update settings");h.update(n=>({...n,error:t,toast:{message:t,type:"error",show:!0}})),console.error("updateSettings: Error:",t)}finally{h.update(e=>({...e,loading:!1}))}}async function U(e){try{const{count:t,error:n}=await D.from("notifications").select("*",{count:"exact",head:!0}).eq("user_id",e).eq("sent",!1);if(n)throw n;h.update(r=>({...r,unreadCount:t??0}))}catch(t){console.error("loadUnreadCount: Error:",t)}}async function $o(e,t){if(t.length){console.log("markNotificationsAsRead: Marking as read:",t);try{const{error:n}=await D.from("notifications").update({sent:!0}).eq("user_id",e).in("id",t);if(n)throw n;await U(e),console.log("markNotificationsAsRead: Completed")}catch(n){console.error("markNotificationsAsRead: Error:",n)}}}async function St(e){if(console.log("setupPushSubscription: Starting for user:",e),!!T){if(Notification.permission==="denied"){const t="Notifications are blocked. Please enable them.";h.update(n=>({...n,error:t,toast:{message:t,type:"error",show:!0}}));return}if(!(Notification.permission==="default"&&await Notification.requestPermission()!=="granted"))try{const t=await navigator.serviceWorker.register("/service-worker.js"),n="BELklaUjBuMlZTLleQ8YIbcs0FrMIccru9Usr5LG2ly7unLOknEOw0LvOg4TSN0DKH77TdCOVEdXb3paVlN8Gic";if(await t.pushManager.getSubscription())return;const o=await Tt(async()=>{const{getToken:u}=await Promise.resolve().then(()=>To);return{getToken:u}},void 0,import.meta.url).then(({getToken:u})=>u(T,{vapidKey:n,serviceWorkerRegistration:t})),i=await t.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:n}),{p256dh:s,auth:a}=i.toJSON().keys??{};if(!s||!a)throw new Error("Invalid subscription keys");const c={endpoint:o,keys:{p256dh:s,auth:a},expirationTime:null},{error:d}=await D.from("push_subscriptions").upsert({user_id:e,subscription:c},{onConflict:"user_id"});if(d)throw d}catch(t){const n=be(t,"Failed to setup push notifications");h.update(r=>({...r,error:n,toast:{message:n,type:"error",show:!0}})),console.error("setupPushSubscription error:",n)}}}async function R(e){if(console.log("removePushSubscription: Removing push subscription"),!!T)try{const t=await navigator.serviceWorker.getRegistration("/service-worker.js"),n=await(t==null?void 0:t.pushManager.getSubscription());n&&await n.unsubscribe();const{error:r}=await D.from("push_subscriptions").delete().eq("user_id",e);if(r)throw r}catch(t){console.error("removePushSubscription: Error:",t)}}async function vt(e){console.log("setupRealtimeSubscriptions: Setting up for user:",e);const t=`notifications_${e}`;p.has(t)&&(p.get(t)(),p.delete(t));const{notifications:n}=Et(),r=Object.keys(n).filter(s=>n[s]);if(!r.length)return;const o=`user_id=eq.${e},type=in.(${r.join(",")})`,i=Le("notifications",s=>{const a=s.new;r.includes(a.type)&&(h.update(c=>({...c,toast:{message:a.message,type:"success",show:!0}})),U(e))},o);p.set(t,i)}async function Lo(){if(!T)return;const e=await se();if(!e)return;const{data:t,error:n}=await D.from("profiles").select("notify_new_users, notify_comments, notify_orders, notify_drawings, role").eq("user_id",e.id).single();if(n){await R(e.id);return}if((t==null?void 0:t.role)!=="sales_monitor"&&(t==null?void 0:t.role)!=="admin"){await R(e.id);return}Object.values(t).some(s=>typeof s=="boolean"&&s)?(await St(e.id),await vt(e.id)):await R(e.id);const o=`count_${e.id}`;p.has(o)&&(p.get(o)(),p.delete(o));const i=Le("notifications",()=>{U(e.id)},`user_id=eq.${e.id}`);p.set(o,i)}function Fo(){p.forEach(e=>{try{e()}catch(t){console.error("cleanupSubscriptions: Error:",t)}}),p.clear()}T&&It(T,e=>{const{title:t,body:n}=e.notification||{};t&&n&&navigator.serviceWorker.ready.then(r=>{r.showNotification(t,{body:n})})});export{Fo as c,Po as l,$o as m,h as n,Lo as s,Ro as u};
