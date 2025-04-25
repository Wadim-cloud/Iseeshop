import{t as A,a as z}from"../chunks/B2hSDNwb.js";import{i as se}from"../chunks/BkJq1j4_.js";import{p as ve,o as de,aw as le,ak as $,am as i,al as t,x as e,a as he,I as p,A as s,az as xe,an as l,aA as ye}from"../chunks/Bxdg7ccW.js";import{e as u,s as b,h as be}from"../chunks/6og0jn-Y.js";import{i as oe}from"../chunks/Bqnn9XxY.js";import{r as C}from"../chunks/CcUbZ0dA.js";import{b as F}from"../chunks/cLJjU_P4.js";import{b as Ce}from"../chunks/DQEqFSD1.js";import{b as Fe}from"../chunks/C7mBFiPQ.js";import{W as He,g as Me,O as Le,m as ke,n as We,o as De,a as Ie,j as Re,k as Se,p as ne}from"../chunks/Db2sCihH.js";var Te=A('<div class="svelte-1r5mxlw"><label for="thresholdLight"> </label> <input type="range" id="thresholdLight" min="0" max="1" step="0.01" class="svelte-1r5mxlw"></div> <div class="svelte-1r5mxlw"><label for="thresholdMid"> </label> <input type="range" id="thresholdMid" min="0" max="1" step="0.01" class="svelte-1r5mxlw"></div> <div class="svelte-1r5mxlw"><label for="thresholdDark"> </label> <input type="range" id="thresholdDark" min="0" max="1" step="0.01" class="svelte-1r5mxlw"></div>',1),$e=A('<div class="svelte-1r5mxlw"><label for="grayscaleIntensity"> </label> <input type="range" id="grayscaleIntensity" min="0" max="1" step="0.01" class="svelte-1r5mxlw"></div>'),ze=A('<input type="file" accept="image/*" class="svelte-1r5mxlw"> <select class="svelte-1r5mxlw"><option>Hope Filter</option><option>Grayscale Filter</option></select> <!> <div class="svelte-1r5mxlw"><label for="aspectWidth"> </label> <input type="range" id="aspectWidth" min="1" max="2000" step="1" class="svelte-1r5mxlw"></div> <div class="svelte-1r5mxlw"><label for="aspectHeight"> </label> <input type="range" id="aspectHeight" min="1" max="2000" step="1" class="svelte-1r5mxlw"></div> <canvas class="svelte-1r5mxlw"></canvas>',1);function Ae(P,j){ve(j,!1);let g=p(),H,r,x,v,T,h=p(1),c=p(1),y=1,f=p("hope"),M=p(.75),L=p(.5),k=p(.25),W=p(1);const X={hope:`
        uniform vec2 iResolution;
        uniform sampler2D iChannel0;
        uniform float thresholdLight;
        uniform float thresholdMid;
        uniform float thresholdDark;
  
        void mainImage(out vec4 fragColor, in vec2 fragCoord) {
            vec2 uv = fragCoord / iResolution.xy;
            vec3 col = texture(iChannel0, uv).rgb;
            
            // Convert to grayscale
            float gray = dot(col, vec3(0.3, 0.59, 0.11));
            
            // Apply color thresholding for the "Hope" effect
            if (gray > thresholdLight) col = vec3(1.0, 0.9, 0.6); // Lightest (cream)
            else if (gray > thresholdMid) col = vec3(0.9, 0.2, 0.2); // Red
            else if (gray > thresholdDark) col = vec3(0.0, 0.3, 0.6); // Blue
            else col = vec3(0.1, 0.1, 0.2); // Dark Blue
  
            fragColor = vec4(col, 1.0);
        }
  
        void main() {
            mainImage(gl_FragColor, gl_FragCoord.xy);
        }
      `,grayscale:`
        uniform vec2 iResolution;
        uniform sampler2D iChannel0;
        uniform float intensity;
  
        void mainImage(out vec4 fragColor, in vec2 fragCoord) {
            vec2 uv = fragCoord / iResolution.xy;
            vec3 col = texture(iChannel0, uv).rgb;
            
            // Convert to grayscale
            float gray = dot(col, vec3(0.3, 0.59, 0.11));
            fragColor = vec4(mix(col, vec3(gray), intensity), 1.0);
        }
  
        void main() {
            mainImage(gl_FragColor, gl_FragCoord.xy);
        }
      `};function ce(a){const d=a.target.files[0];if(!d)return;const n=new Image;n.onload=()=>{s(h,n.width),s(c,n.height),y=e(h)/e(c),new Se().load(n.src,w=>{T=w,T.minFilter=ne,T.magFilter=ne,v.uniforms.iChannel0.value=T;let o=Math.min(window.innerWidth/e(h),window.innerHeight/e(c));r.left=-o*y,r.right=o*y,r.top=o,r.bottom=-o,r.updateProjectionMatrix(),x.setSize(window.innerWidth,window.innerHeight)})},n.src=URL.createObjectURL(d)}function D(){v.fragmentShader=X[e(f)],v.uniforms.thresholdLight={value:e(M)},v.uniforms.thresholdMid={value:e(L)},v.uniforms.thresholdDark={value:e(k)},v.uniforms.intensity={value:e(W)},v.needsUpdate=!0}function Y(){y=e(h)/e(c);let a=Math.min(window.innerWidth/e(h),window.innerHeight/e(c));r.left=-a*y,r.right=a*y,r.top=a,r.bottom=-a,r.updateProjectionMatrix(),x.setSize(window.innerWidth,window.innerHeight)}function me(){x=new He({canvas:e(g)}),x.setSize(window.innerWidth,window.innerHeight),x.setClearColor(15658734,1),H=new Me,r=new Le(-1,1,1,-1,.1,10),r.position.z=1;const a=new ke(2,2);v=new We({uniforms:{iResolution:{value:new Ie(window.innerWidth,window.innerHeight)},iChannel0:{value:new De},thresholdLight:{value:e(M)},thresholdMid:{value:e(L)},thresholdDark:{value:e(k)},intensity:{value:e(W)}},vertexShader:"void main() { gl_Position = vec4(position, 1.0); }",fragmentShader:X[e(f)]});const d=new Re(a,v);H.add(d)}function Z(){requestAnimationFrame(Z),x.render(H,r)}de(()=>{me(),Z()}),se();var ee=ze(),ae=le(ee),I=t(ae,2);$(()=>{e(f),xe(()=>{})});var G=i(I);G.value=G.__value="hope";var te=t(G);te.value=te.__value="grayscale",l(I);var re=t(I,2);{var pe=a=>{var d=Te(),n=le(d),m=i(n),w=i(m);l(m);var o=t(m,2);C(o),l(n);var R=t(n,2),_=i(R),J=i(_);l(_);var K=t(_,2);C(K),l(R);var ie=t(R,2),N=i(ie),_e=i(N);l(N);var Q=t(N,2);C(Q),l(ie),$(()=>{b(w,`Light Threshold: ${e(M)??""}`),b(J,`Mid Threshold: ${e(L)??""}`),b(_e,`Dark Threshold: ${e(k)??""}`)}),F(o,()=>e(M),S=>s(M,S)),u("input",o,D),F(K,()=>e(L),S=>s(L,S)),u("input",K,D),F(Q,()=>e(k),S=>s(k,S)),u("input",Q,D),z(a,d)},ue=(a,d)=>{{var n=m=>{var w=$e(),o=i(w),R=i(o);l(o);var _=t(o,2);C(_),l(w),$(()=>b(R,`Grayscale Intensity: ${e(W)??""}`)),F(_,()=>e(W),J=>s(W,J)),u("input",_,D),z(m,w)};oe(a,m=>{e(f)==="grayscale"&&m(n)},d)}};oe(re,a=>{e(f)==="hope"?a(pe):a(ue,!1)})}var U=t(re,2),O=i(U),ge=i(O);l(O);var B=t(O,2);C(B),l(U);var q=t(U,2),V=i(q),fe=i(V);l(V);var E=t(V,2);C(E),l(q);var we=t(q,2);Fe(we,a=>s(g,a),()=>e(g)),$(()=>{b(ge,`Width: ${e(h)??""}`),b(fe,`Height: ${e(c)??""}`)}),u("change",ae,ce),Ce(I,()=>e(f),a=>s(f,a)),u("change",I,D),F(B,()=>e(h),a=>s(h,a)),u("input",B,Y),F(E,()=>e(c),a=>s(c,a)),u("input",E,Y),z(P,ee),he()}var Pe=A('<main class="svelte-4wha66"><h1 class="svelte-4wha66">Hope Poster Filter</h1> <p class="svelte-4wha66">Upload an image and apply the "Hope" poster effect.</p> <!></main>');function Ne(P,j){ve(j,!1),de(()=>{document.title="Shaders & Filters"}),se();var g=Pe();be(r=>{ye.title="Shaders & Filters"});var H=t(i(g),4);Ae(H,{}),l(g),z(P,g),he()}export{Ne as component};
