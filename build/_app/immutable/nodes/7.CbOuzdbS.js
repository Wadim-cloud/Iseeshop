import{t as P,a as O}from"../chunks/DPmhzSt5.js";import{i as ve}from"../chunks/CHpTJ84V.js";import{e as de,aQ as Ce,p as ue,o as ce,ax as ne,ay as A,Y as o,az as l,t as e,a as he,A as w,aR as Fe,Z as s,a1 as m,aB as Me}from"../chunks/BDHGhfTE.js";import{l as He,e as x,d as Le}from"../chunks/CvTsB6m-.js";import{s as H}from"../chunks/CTjs_13Y.js";import{i as oe}from"../chunks/1K336M6a.js";import{r as L}from"../chunks/D02H29ki.js";import{b as S}from"../chunks/BvDJoXBx.js";import{b as Se}from"../chunks/RZ2m-Vl7.js";import{W as ke,g as Re,O as We,l as De,m as Ie,n as Te,e as $e,i as qe,j as ze,o as se}from"../chunks/B2jQ_eJN.js";function me(a,v,i){if(a.multiple)return Pe(a,v);for(var n of a.options){var t=z(n);if(Ce(t,v)){n.selected=!0;return}}(!i||v!==void 0)&&(a.selectedIndex=-1)}function Ae(a,v){de(()=>{var i=new MutationObserver(()=>{var n=a.__value;me(a,n)});return i.observe(a,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["value"]}),()=>{i.disconnect()}})}function Oe(a,v,i=v){var n=!0;He(a,"change",t=>{var u=t?"[selected]":":checked",d;if(a.multiple)d=[].map.call(a.querySelectorAll(u),z);else{var y=a.querySelector(u)??a.querySelector("option:not([disabled])");d=y&&z(y)}i(d)}),de(()=>{var t=v();if(me(a,t,n),n&&t===void 0){var u=a.querySelector(":checked");u!==null&&(t=z(u),i(t))}a.__value=t,n=!1}),Ae(a)}function Pe(a,v){for(var i of a.options)i.selected=~v.indexOf(z(i))}function z(a){return"__value"in a?a.__value:a.value}var je=P('<div class="svelte-1r5mxlw"><label for="thresholdLight"> </label> <input type="range" id="thresholdLight" min="0" max="1" step="0.01" class="svelte-1r5mxlw"></div> <div class="svelte-1r5mxlw"><label for="thresholdMid"> </label> <input type="range" id="thresholdMid" min="0" max="1" step="0.01" class="svelte-1r5mxlw"></div> <div class="svelte-1r5mxlw"><label for="thresholdDark"> </label> <input type="range" id="thresholdDark" min="0" max="1" step="0.01" class="svelte-1r5mxlw"></div>',1),Ge=P('<div class="svelte-1r5mxlw"><label for="grayscaleIntensity"> </label> <input type="range" id="grayscaleIntensity" min="0" max="1" step="0.01" class="svelte-1r5mxlw"></div>'),Ue=P('<input type="file" accept="image/*" class="svelte-1r5mxlw"> <select class="svelte-1r5mxlw"><option>Hope Filter</option><option>Grayscale Filter</option></select> <!> <div class="svelte-1r5mxlw"><label for="aspectWidth"> </label> <input type="range" id="aspectWidth" min="1" max="2000" step="1" class="svelte-1r5mxlw"></div> <div class="svelte-1r5mxlw"><label for="aspectHeight"> </label> <input type="range" id="aspectHeight" min="1" max="2000" step="1" class="svelte-1r5mxlw"></div> <canvas class="svelte-1r5mxlw"></canvas>',1);function Be(a,v){ue(v,!1);let i=w(),n,t,u,d,y,f=w(1),g=w(1),M=1,b=w("hope"),k=w(.75),R=w(.5),W=w(.25),D=w(1);const N={hope:`
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
      `};function pe(r){const p=r.target.files[0];if(!p)return;const h=new Image;h.onload=()=>{m(f,h.width),m(g,h.height),M=e(f)/e(g),new ze().load(h.src,C=>{y=C,y.minFilter=se,y.magFilter=se,d.uniforms.iChannel0.value=y;let c=Math.min(window.innerWidth/e(f),window.innerHeight/e(g));t.left=-c*M,t.right=c*M,t.top=c,t.bottom=-c,t.updateProjectionMatrix(),u.setSize(window.innerWidth,window.innerHeight)})},h.src=URL.createObjectURL(p)}function I(){d.fragmentShader=N[e(b)],d.uniforms.thresholdLight={value:e(k)},d.uniforms.thresholdMid={value:e(R)},d.uniforms.thresholdDark={value:e(W)},d.uniforms.intensity={value:e(D)},d.needsUpdate=!0}function X(){M=e(f)/e(g);let r=Math.min(window.innerWidth/e(f),window.innerHeight/e(g));t.left=-r*M,t.right=r*M,t.top=r,t.bottom=-r,t.updateProjectionMatrix(),u.setSize(window.innerWidth,window.innerHeight)}function fe(){u=new ke({canvas:e(i)}),u.setSize(window.innerWidth,window.innerHeight),u.setClearColor(15658734,1),n=new Re,t=new We(-1,1,1,-1,.1,10),t.position.z=1;const r=new De(2,2);d=new Ie({uniforms:{iResolution:{value:new $e(window.innerWidth,window.innerHeight)},iChannel0:{value:new Te},thresholdLight:{value:e(k)},thresholdMid:{value:e(R)},thresholdDark:{value:e(W)},intensity:{value:e(D)}},vertexShader:"void main() { gl_Position = vec4(position, 1.0); }",fragmentShader:N[e(b)]});const p=new qe(r,d);n.add(p)}function ee(){requestAnimationFrame(ee),u.render(n,t)}ce(()=>{fe(),ee()}),ve();var ae=Ue(),te=ne(ae),T=l(te,2);A(()=>{e(b),Fe(()=>{})});var j=o(T);j.value=j.__value="hope";var re=l(j);re.value=re.__value="grayscale",s(T);var ie=l(T,2);{var ge=r=>{var p=je(),h=ne(p),_=o(h),C=o(_);s(_);var c=l(_,2);L(c),s(h);var $=l(h,2),F=o($),Z=o(F);s(F);var E=l(F,2);L(E),s($);var le=l($,2),J=o(le),be=o(J);s(J);var K=l(J,2);L(K),s(le),A(()=>{H(C,`Light Threshold: ${e(k)??""}`),H(Z,`Mid Threshold: ${e(R)??""}`),H(be,`Dark Threshold: ${e(W)??""}`)}),S(c,()=>e(k),q=>m(k,q)),x("input",c,I),S(E,()=>e(R),q=>m(R,q)),x("input",E,I),S(K,()=>e(W),q=>m(W,q)),x("input",K,I),O(r,p)},_e=(r,p)=>{{var h=_=>{var C=Ge(),c=o(C),$=o(c);s(c);var F=l(c,2);L(F),s(C),A(()=>H($,`Grayscale Intensity: ${e(D)??""}`)),S(F,()=>e(D),Z=>m(D,Z)),x("input",F,I),O(_,C)};oe(r,_=>{e(b)==="grayscale"&&_(h)},p)}};oe(ie,r=>{e(b)==="hope"?r(ge):r(_e,!1)})}var G=l(ie,2),U=o(G),we=o(U);s(U);var B=l(U,2);L(B),s(G);var Q=l(G,2),V=o(Q),xe=o(V);s(V);var Y=l(V,2);L(Y),s(Q);var ye=l(Q,2);Se(ye,r=>m(i,r),()=>e(i)),A(()=>{H(we,`Width: ${e(f)??""}`),H(xe,`Height: ${e(g)??""}`)}),x("change",te,pe),Oe(T,()=>e(b),r=>m(b,r)),x("change",T,I),S(B,()=>e(f),r=>m(f,r)),x("input",B,X),S(Y,()=>e(g),r=>m(g,r)),x("input",Y,X),O(a,ae),he()}var Qe=P('<main class="svelte-4wha66"><h1 class="svelte-4wha66">Hope Poster Filter</h1> <p class="svelte-4wha66">Upload an image and apply the "Hope" poster effect.</p> <!></main>');function ta(a,v){ue(v,!1),ce(()=>{document.title="Shaders & Filters"}),ve();var i=Qe();Le(t=>{Me.title="Shaders & Filters"});var n=l(o(i),4);Be(n,{}),s(i),O(a,i),he()}export{ta as component};
