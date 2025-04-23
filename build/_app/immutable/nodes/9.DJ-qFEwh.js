import{t as z,a as P}from"../chunks/DxolCNix.js";import"../chunks/Ci8d3Fat.js";import{l as ve,aI as Ce,p as de,o as ue,av as ne,aq as O,as as o,ar as l,x as e,a as ce,I as w,A as m,aJ as Fe,at as s,aK as Me}from"../chunks/B668RH8u.js";import{l as He,e as x,s as H,h as Le}from"../chunks/DhXqswRN.js";import{i as he}from"../chunks/CHu_v1B0.js";import{i as oe}from"../chunks/CoxfEDN7.js";import{r as L}from"../chunks/DGKrTPFL.js";import{b as S}from"../chunks/AOsgo3jW.js";import{b as Se}from"../chunks/DF75DhTM.js";import{W as Ie,c as ke,O as We,m as De,n as Re,o as Te,i as $e,d as qe,T as Ae,p as se}from"../chunks/DV8XoEH0.js";function me(a,v,i){if(a.multiple)return ze(a,v);for(var n of a.options){var t=A(n);if(Ce(t,v)){n.selected=!0;return}}(!i||v!==void 0)&&(a.selectedIndex=-1)}function Oe(a,v){ve(()=>{var i=new MutationObserver(()=>{var n=a.__value;me(a,n)});return i.observe(a,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["value"]}),()=>{i.disconnect()}})}function Pe(a,v,i=v){var n=!0;He(a,"change",t=>{var u=t?"[selected]":":checked",d;if(a.multiple)d=[].map.call(a.querySelectorAll(u),A);else{var y=a.querySelector(u)??a.querySelector("option:not([disabled])");d=y&&A(y)}i(d)}),ve(()=>{var t=v();if(me(a,t,n),n&&t===void 0){var u=a.querySelector(":checked");u!==null&&(t=A(u),i(t))}a.__value=t,n=!1}),Oe(a)}function ze(a,v){for(var i of a.options)i.selected=~v.indexOf(A(i))}function A(a){return"__value"in a?a.__value:a.value}var Ge=z('<div class="svelte-1r5mxlw"><label for="thresholdLight"> </label> <input type="range" id="thresholdLight" min="0" max="1" step="0.01" class="svelte-1r5mxlw"></div> <div class="svelte-1r5mxlw"><label for="thresholdMid"> </label> <input type="range" id="thresholdMid" min="0" max="1" step="0.01" class="svelte-1r5mxlw"></div> <div class="svelte-1r5mxlw"><label for="thresholdDark"> </label> <input type="range" id="thresholdDark" min="0" max="1" step="0.01" class="svelte-1r5mxlw"></div>',1),Ue=z('<div class="svelte-1r5mxlw"><label for="grayscaleIntensity"> </label> <input type="range" id="grayscaleIntensity" min="0" max="1" step="0.01" class="svelte-1r5mxlw"></div>'),je=z('<input type="file" accept="image/*" class="svelte-1r5mxlw"> <select class="svelte-1r5mxlw"><option>Hope Filter</option><option>Grayscale Filter</option></select> <!> <div class="svelte-1r5mxlw"><label for="aspectWidth"> </label> <input type="range" id="aspectWidth" min="1" max="2000" step="1" class="svelte-1r5mxlw"></div> <div class="svelte-1r5mxlw"><label for="aspectHeight"> </label> <input type="range" id="aspectHeight" min="1" max="2000" step="1" class="svelte-1r5mxlw"></div> <canvas class="svelte-1r5mxlw"></canvas>',1);function Be(a,v){de(v,!1);let i=w(),n,t,u,d,y,f=w(1),g=w(1),M=1,b=w("hope"),I=w(.75),k=w(.5),W=w(.25),D=w(1);const Y={hope:`
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
      `};function pe(r){const p=r.target.files[0];if(!p)return;const h=new Image;h.onload=()=>{m(f,h.width),m(g,h.height),M=e(f)/e(g),new Ae().load(h.src,C=>{y=C,y.minFilter=se,y.magFilter=se,d.uniforms.iChannel0.value=y;let c=Math.min(window.innerWidth/e(f),window.innerHeight/e(g));t.left=-c*M,t.right=c*M,t.top=c,t.bottom=-c,t.updateProjectionMatrix(),u.setSize(window.innerWidth,window.innerHeight)})},h.src=URL.createObjectURL(p)}function R(){d.fragmentShader=Y[e(b)],d.uniforms.thresholdLight={value:e(I)},d.uniforms.thresholdMid={value:e(k)},d.uniforms.thresholdDark={value:e(W)},d.uniforms.intensity={value:e(D)},d.needsUpdate=!0}function Z(){M=e(f)/e(g);let r=Math.min(window.innerWidth/e(f),window.innerHeight/e(g));t.left=-r*M,t.right=r*M,t.top=r,t.bottom=-r,t.updateProjectionMatrix(),u.setSize(window.innerWidth,window.innerHeight)}function fe(){u=new Ie({canvas:e(i)}),u.setSize(window.innerWidth,window.innerHeight),u.setClearColor(15658734,1),n=new ke,t=new We(-1,1,1,-1,.1,10),t.position.z=1;const r=new De(2,2);d=new Re({uniforms:{iResolution:{value:new $e(window.innerWidth,window.innerHeight)},iChannel0:{value:new Te},thresholdLight:{value:e(I)},thresholdMid:{value:e(k)},thresholdDark:{value:e(W)},intensity:{value:e(D)}},vertexShader:"void main() { gl_Position = vec4(position, 1.0); }",fragmentShader:Y[e(b)]});const p=new qe(r,d);n.add(p)}function ee(){requestAnimationFrame(ee),u.render(n,t)}ue(()=>{fe(),ee()}),he();var ae=je(),te=ne(ae),T=l(te,2);O(()=>{e(b),Fe(()=>{})});var G=o(T);G.value=G.__value="hope";var re=l(G);re.value=re.__value="grayscale",s(T);var ie=l(T,2);{var ge=r=>{var p=Ge(),h=ne(p),_=o(h),C=o(_);s(_);var c=l(_,2);L(c),s(h);var $=l(h,2),F=o($),E=o(F);s(F);var N=l(F,2);L(N),s($);var le=l($,2),Q=o(le),be=o(Q);s(Q);var X=l(Q,2);L(X),s(le),O(()=>{H(C,`Light Threshold: ${e(I)??""}`),H(E,`Mid Threshold: ${e(k)??""}`),H(be,`Dark Threshold: ${e(W)??""}`)}),S(c,()=>e(I),q=>m(I,q)),x("input",c,R),S(N,()=>e(k),q=>m(k,q)),x("input",N,R),S(X,()=>e(W),q=>m(W,q)),x("input",X,R),P(r,p)},_e=(r,p)=>{{var h=_=>{var C=Ue(),c=o(C),$=o(c);s(c);var F=l(c,2);L(F),s(C),O(()=>H($,`Grayscale Intensity: ${e(D)??""}`)),S(F,()=>e(D),E=>m(D,E)),x("input",F,R),P(_,C)};oe(r,_=>{e(b)==="grayscale"&&_(h)},p)}};oe(ie,r=>{e(b)==="hope"?r(ge):r(_e,!1)})}var U=l(ie,2),j=o(U),we=o(j);s(j);var B=l(j,2);L(B),s(U);var J=l(U,2),K=o(J),xe=o(K);s(K);var V=l(K,2);L(V),s(J);var ye=l(J,2);Se(ye,r=>m(i,r),()=>e(i)),O(()=>{H(we,`Width: ${e(f)??""}`),H(xe,`Height: ${e(g)??""}`)}),x("change",te,pe),Pe(T,()=>e(b),r=>m(b,r)),x("change",T,R),S(B,()=>e(f),r=>m(f,r)),x("input",B,Z),S(V,()=>e(g),r=>m(g,r)),x("input",V,Z),P(a,ae),ce()}var Je=z('<main class="svelte-4wha66"><h1 class="svelte-4wha66">Hope Poster Filter</h1> <p class="svelte-4wha66">Upload an image and apply the "Hope" poster effect.</p> <!></main>');function ta(a,v){de(v,!1),ue(()=>{document.title="Shaders & Filters"}),he();var i=Je();Le(t=>{Me.title="Shaders & Filters"});var n=l(o(i),4);Be(n,{}),s(i),P(a,i),ce()}export{ta as component};
