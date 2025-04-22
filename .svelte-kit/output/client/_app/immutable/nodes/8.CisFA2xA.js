import{t as z,a as O}from"../chunks/fM_HHR7z.js";import{i as ve}from"../chunks/Dcs68N15.js";import{e as de,aJ as Ce,p as ue,o as he,ap as ne,aq as A,as as o,ar as l,x as e,a as ce,I as w,aK as Me,at as s,A as m,aw as Fe}from"../chunks/Cw_GAJ-8.js";import{l as Le,e as x,s as L,h as Se}from"../chunks/tsz7uQk5.js";import{i as oe}from"../chunks/JX9NnDbc.js";import{r as S}from"../chunks/5A2ZYZT-.js";import{b as H}from"../chunks/BlA1OJav.js";import{b as He}from"../chunks/C3V-GO8h.js";import{W as ke,S as Ie,O as We,P as De,a as Re,T as Te,V as $e,M as qe,b as Pe,L as se}from"../chunks/fooTKfNC.js";function me(a,v,i){if(a.multiple)return ze(a,v);for(var n of a.options){var t=P(n);if(Ce(t,v)){n.selected=!0;return}}(!i||v!==void 0)&&(a.selectedIndex=-1)}function Ae(a,v){de(()=>{var i=new MutationObserver(()=>{var n=a.__value;me(a,n)});return i.observe(a,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["value"]}),()=>{i.disconnect()}})}function Oe(a,v,i=v){var n=!0;Le(a,"change",t=>{var u=t?"[selected]":":checked",d;if(a.multiple)d=[].map.call(a.querySelectorAll(u),P);else{var y=a.querySelector(u)??a.querySelector("option:not([disabled])");d=y&&P(y)}i(d)}),de(()=>{var t=v();if(me(a,t,n),n&&t===void 0){var u=a.querySelector(":checked");u!==null&&(t=P(u),i(t))}a.__value=t,n=!1}),Ae(a)}function ze(a,v){for(var i of a.options)i.selected=~v.indexOf(P(i))}function P(a){return"__value"in a?a.__value:a.value}var Ge=z('<div class="svelte-1r5mxlw"><label for="thresholdLight"> </label> <input type="range" id="thresholdLight" min="0" max="1" step="0.01" class="svelte-1r5mxlw"></div> <div class="svelte-1r5mxlw"><label for="thresholdMid"> </label> <input type="range" id="thresholdMid" min="0" max="1" step="0.01" class="svelte-1r5mxlw"></div> <div class="svelte-1r5mxlw"><label for="thresholdDark"> </label> <input type="range" id="thresholdDark" min="0" max="1" step="0.01" class="svelte-1r5mxlw"></div>',1),Ue=z('<div class="svelte-1r5mxlw"><label for="grayscaleIntensity"> </label> <input type="range" id="grayscaleIntensity" min="0" max="1" step="0.01" class="svelte-1r5mxlw"></div>'),je=z('<input type="file" accept="image/*" class="svelte-1r5mxlw"> <select class="svelte-1r5mxlw"><option>Hope Filter</option><option>Grayscale Filter</option></select> <!> <div class="svelte-1r5mxlw"><label for="aspectWidth"> </label> <input type="range" id="aspectWidth" min="1" max="2000" step="1" class="svelte-1r5mxlw"></div> <div class="svelte-1r5mxlw"><label for="aspectHeight"> </label> <input type="range" id="aspectHeight" min="1" max="2000" step="1" class="svelte-1r5mxlw"></div> <canvas class="svelte-1r5mxlw"></canvas>',1);function Be(a,v){ue(v,!1);let i=w(),n,t,u,d,y,f=w(1),g=w(1),F=1,b=w("hope"),k=w(.75),I=w(.5),W=w(.25),D=w(1);const Y={hope:`
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
      `};function pe(r){const p=r.target.files[0];if(!p)return;const c=new Image;c.onload=()=>{m(f,c.width),m(g,c.height),F=e(f)/e(g),new Pe().load(c.src,C=>{y=C,y.minFilter=se,y.magFilter=se,d.uniforms.iChannel0.value=y;let h=Math.min(window.innerWidth/e(f),window.innerHeight/e(g));t.left=-h*F,t.right=h*F,t.top=h,t.bottom=-h,t.updateProjectionMatrix(),u.setSize(window.innerWidth,window.innerHeight)})},c.src=URL.createObjectURL(p)}function R(){d.fragmentShader=Y[e(b)],d.uniforms.thresholdLight={value:e(k)},d.uniforms.thresholdMid={value:e(I)},d.uniforms.thresholdDark={value:e(W)},d.uniforms.intensity={value:e(D)},d.needsUpdate=!0}function Z(){F=e(f)/e(g);let r=Math.min(window.innerWidth/e(f),window.innerHeight/e(g));t.left=-r*F,t.right=r*F,t.top=r,t.bottom=-r,t.updateProjectionMatrix(),u.setSize(window.innerWidth,window.innerHeight)}function fe(){u=new ke({canvas:e(i)}),u.setSize(window.innerWidth,window.innerHeight),u.setClearColor(15658734,1),n=new Ie,t=new We(-1,1,1,-1,.1,10),t.position.z=1;const r=new De(2,2);d=new Re({uniforms:{iResolution:{value:new $e(window.innerWidth,window.innerHeight)},iChannel0:{value:new Te},thresholdLight:{value:e(k)},thresholdMid:{value:e(I)},thresholdDark:{value:e(W)},intensity:{value:e(D)}},vertexShader:"void main() { gl_Position = vec4(position, 1.0); }",fragmentShader:Y[e(b)]});const p=new qe(r,d);n.add(p)}function ee(){requestAnimationFrame(ee),u.render(n,t)}he(()=>{fe(),ee()}),ve();var ae=je(),te=ne(ae),T=l(te,2);A(()=>{e(b),Me(()=>{})});var G=o(T);G.value=G.__value="hope";var re=l(G);re.value=re.__value="grayscale",s(T);var ie=l(T,2);{var ge=r=>{var p=Ge(),c=ne(p),_=o(c),C=o(_);s(_);var h=l(_,2);S(h),s(c);var $=l(c,2),M=o($),E=o(M);s(M);var N=l(M,2);S(N),s($);var le=l($,2),Q=o(le),be=o(Q);s(Q);var X=l(Q,2);S(X),s(le),A(()=>{L(C,`Light Threshold: ${e(k)??""}`),L(E,`Mid Threshold: ${e(I)??""}`),L(be,`Dark Threshold: ${e(W)??""}`)}),H(h,()=>e(k),q=>m(k,q)),x("input",h,R),H(N,()=>e(I),q=>m(I,q)),x("input",N,R),H(X,()=>e(W),q=>m(W,q)),x("input",X,R),O(r,p)},_e=(r,p)=>{{var c=_=>{var C=Ue(),h=o(C),$=o(h);s(h);var M=l(h,2);S(M),s(C),A(()=>L($,`Grayscale Intensity: ${e(D)??""}`)),H(M,()=>e(D),E=>m(D,E)),x("input",M,R),O(_,C)};oe(r,_=>{e(b)==="grayscale"&&_(c)},p)}};oe(ie,r=>{e(b)==="hope"?r(ge):r(_e,!1)})}var U=l(ie,2),j=o(U),we=o(j);s(j);var B=l(j,2);S(B),s(U);var V=l(U,2),J=o(V),xe=o(J);s(J);var K=l(J,2);S(K),s(V);var ye=l(V,2);He(ye,r=>m(i,r),()=>e(i)),A(()=>{L(we,`Width: ${e(f)??""}`),L(xe,`Height: ${e(g)??""}`)}),x("change",te,pe),Oe(T,()=>e(b),r=>m(b,r)),x("change",T,R),H(B,()=>e(f),r=>m(f,r)),x("input",B,Z),H(K,()=>e(g),r=>m(g,r)),x("input",K,Z),O(a,ae),ce()}var Ve=z('<main class="svelte-4wha66"><h1 class="svelte-4wha66">Hope Poster Filter</h1> <p class="svelte-4wha66">Upload an image and apply the "Hope" poster effect.</p> <!></main>');function aa(a,v){ue(v,!1),he(()=>{document.title="Shaders & Filters"}),ve();var i=Ve();Se(t=>{Fe.title="Shaders & Filters"});var n=l(o(i),4);Be(n,{}),s(i),O(a,i),ce()}export{aa as component};
