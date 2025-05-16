import"../chunks/CWj6FrbW.js";import"../chunks/69_IOA4Y.js";import{p as se,o as ve,an as le,ao as $,ar as i,ap as t,x as e,a as de,A as s,G as p,aB as xe,as as l,aq as ye}from"../chunks/9BOlcS-b.js";import{e as u,s as b,h as be}from"../chunks/BsZz1DC-.js";import{t as P,a as G}from"../chunks/Bnw62dMu.js";import{i as he}from"../chunks/xvq0-Hdq.js";import{i as oe}from"../chunks/WEOj8Vpi.js";import{r as C}from"../chunks/CTf98LKf.js";import{b as F}from"../chunks/9x1-h8O0.js";import{b as Ce}from"../chunks/BaLMMi1F.js";import{b as Fe}from"../chunks/trMeve9e.js";import{W as He,g as Me,O as Le,m as We,n as ke,o as De,a as Re,j as Se,k as Ie,p as ne}from"../chunks/Db2sCihH.js";var Te=P('<div class="svelte-1r5mxlw"><label for="thresholdLight"> </label> <input type="range" id="thresholdLight" min="0" max="1" step="0.01" class="svelte-1r5mxlw"></div> <div class="svelte-1r5mxlw"><label for="thresholdMid"> </label> <input type="range" id="thresholdMid" min="0" max="1" step="0.01" class="svelte-1r5mxlw"></div> <div class="svelte-1r5mxlw"><label for="thresholdDark"> </label> <input type="range" id="thresholdDark" min="0" max="1" step="0.01" class="svelte-1r5mxlw"></div>',1),$e=P('<div class="svelte-1r5mxlw"><label for="grayscaleIntensity"> </label> <input type="range" id="grayscaleIntensity" min="0" max="1" step="0.01" class="svelte-1r5mxlw"></div>'),Ge=P('<input type="file" accept="image/*" class="svelte-1r5mxlw"> <select class="svelte-1r5mxlw"><option>Hope Filter</option><option>Grayscale Filter</option></select> <!> <div class="svelte-1r5mxlw"><label for="aspectWidth"> </label> <input type="range" id="aspectWidth" min="1" max="2000" step="1" class="svelte-1r5mxlw"></div> <div class="svelte-1r5mxlw"><label for="aspectHeight"> </label> <input type="range" id="aspectHeight" min="1" max="2000" step="1" class="svelte-1r5mxlw"></div> <canvas class="svelte-1r5mxlw"></canvas>',1);function Pe(j,z){se(z,!1);let g=p(),H,r,x,v,T,h=p(1),c=p(1),y=1,f=p("hope"),M=p(.75),L=p(.5),W=p(.25),k=p(1);const X={hope:`
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
      `};function ce(a){const d=a.target.files[0];if(!d)return;const n=new Image;n.onload=()=>{s(h,n.width),s(c,n.height),y=e(h)/e(c),new Ie().load(n.src,w=>{T=w,T.minFilter=ne,T.magFilter=ne,v.uniforms.iChannel0.value=T;let o=Math.min(window.innerWidth/e(h),window.innerHeight/e(c));r.left=-o*y,r.right=o*y,r.top=o,r.bottom=-o,r.updateProjectionMatrix(),x.setSize(window.innerWidth,window.innerHeight)})},n.src=URL.createObjectURL(d)}function D(){v.fragmentShader=X[e(f)],v.uniforms.thresholdLight={value:e(M)},v.uniforms.thresholdMid={value:e(L)},v.uniforms.thresholdDark={value:e(W)},v.uniforms.intensity={value:e(k)},v.needsUpdate=!0}function Y(){y=e(h)/e(c);let a=Math.min(window.innerWidth/e(h),window.innerHeight/e(c));r.left=-a*y,r.right=a*y,r.top=a,r.bottom=-a,r.updateProjectionMatrix(),x.setSize(window.innerWidth,window.innerHeight)}function me(){x=new He({canvas:e(g)}),x.setSize(window.innerWidth,window.innerHeight),x.setClearColor(15658734,1),H=new Me,r=new Le(-1,1,1,-1,.1,10),r.position.z=1;const a=new We(2,2);v=new ke({uniforms:{iResolution:{value:new Re(window.innerWidth,window.innerHeight)},iChannel0:{value:new De},thresholdLight:{value:e(M)},thresholdMid:{value:e(L)},thresholdDark:{value:e(W)},intensity:{value:e(k)}},vertexShader:"void main() { gl_Position = vec4(position, 1.0); }",fragmentShader:X[e(f)]});const d=new Se(a,v);H.add(d)}function Z(){requestAnimationFrame(Z),x.render(H,r)}ve(()=>{me(),Z()}),he();var ee=Ge(),ae=le(ee),R=t(ae,2);$(()=>{e(f),xe(()=>{})});var A=i(R);A.value=A.__value="hope";var te=t(A);te.value=te.__value="grayscale",l(R);var re=t(R,2);{var pe=a=>{var d=Te(),n=le(d),m=i(n),w=i(m);l(m);var o=t(m,2);C(o),l(n);var S=t(n,2),_=i(S),J=i(_);l(_);var K=t(_,2);C(K),l(S);var ie=t(S,2),N=i(ie),_e=i(N);l(N);var Q=t(N,2);C(Q),l(ie),$(()=>{b(w,`Light Threshold: ${e(M)??""}`),b(J,`Mid Threshold: ${e(L)??""}`),b(_e,`Dark Threshold: ${e(W)??""}`)}),F(o,()=>e(M),I=>s(M,I)),u("input",o,D),F(K,()=>e(L),I=>s(L,I)),u("input",K,D),F(Q,()=>e(W),I=>s(W,I)),u("input",Q,D),G(a,d)},ue=(a,d)=>{{var n=m=>{var w=$e(),o=i(w),S=i(o);l(o);var _=t(o,2);C(_),l(w),$(()=>b(S,`Grayscale Intensity: ${e(k)??""}`)),F(_,()=>e(k),J=>s(k,J)),u("input",_,D),G(m,w)};oe(a,m=>{e(f)==="grayscale"&&m(n)},d)}};oe(re,a=>{e(f)==="hope"?a(pe):a(ue,!1)})}var U=t(re,2),B=i(U),ge=i(B);l(B);var O=t(B,2);C(O),l(U);var q=t(U,2),V=i(q),fe=i(V);l(V);var E=t(V,2);C(E),l(q);var we=t(q,2);Fe(we,a=>s(g,a),()=>e(g)),$(()=>{b(ge,`Width: ${e(h)??""}`),b(fe,`Height: ${e(c)??""}`)}),u("change",ae,ce),Ce(R,()=>e(f),a=>s(f,a)),u("change",R,D),F(O,()=>e(h),a=>s(h,a)),u("input",O,Y),F(E,()=>e(c),a=>s(c,a)),u("input",E,Y),G(j,ee),de()}var je=P('<main class="svelte-4wha66"><h1 class="svelte-4wha66">Hope Poster Filter</h1> <p class="svelte-4wha66">Upload an image and apply the "Hope" poster effect.</p> <!></main>');function Xe(j,z){se(z,!1),ve(()=>{document.title="Shaders & Filters"}),he();var g=je();be(r=>{ye.title="Shaders & Filters"});var H=t(i(g),4);Pe(H,{}),l(g),G(j,g),de()}export{Xe as component};
