<script>
    import { onMount } from "svelte";
    import * as THREE from "three";
  
    let canvas;
    let scene, camera, renderer, material, texture;
    let imageWidth = 1, imageHeight = 1;
    let aspectRatio = 1; // Aspect ratio control
  
    // Initialize the currentFilter variable with a default value
    let currentFilter = 'hope'; // Default filter
  
    // Filter parameters
    let hopeThresholdLight = 0.75;
    let hopeThresholdMid = 0.5;
    let hopeThresholdDark = 0.25;
    let grayscaleIntensity = 1.0;
  
    // Shader sources for different filters
    const shaders = {
      hope: `
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
      `,
      grayscale: `
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
      `
    };
  
    // Handles image upload
    function loadImage(event) {
      const file = event.target.files[0];
      if (!file) return;
  
      const img = new Image();
      img.onload = () => {
        // Update the image dimensions and aspect ratio
        imageWidth = img.width;
        imageHeight = img.height;
        aspectRatio = imageWidth / imageHeight;
  
        const loader = new THREE.TextureLoader();
        loader.load(img.src, (loadedTexture) => {
          texture = loadedTexture;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          material.uniforms.iChannel0.value = texture;
  
          // Adjust the camera's orthographic projection based on the aspect ratio
          let scale = Math.min(window.innerWidth / imageWidth, window.innerHeight / imageHeight);
          
          // Set the camera's left, right, top, bottom to fit the image's aspect ratio
          camera.left = -scale * aspectRatio;
          camera.right = scale * aspectRatio;
          camera.top = scale;
          camera.bottom = -scale;
          camera.updateProjectionMatrix();
  
          // Set renderer size to match the window size
          renderer.setSize(window.innerWidth, window.innerHeight);
        });
      };
      img.src = URL.createObjectURL(file);
    }
  
    // Updates shader based on selected filter and parameters
    function updateFilter() {
      material.fragmentShader = shaders[currentFilter];
      material.uniforms.thresholdLight = { value: hopeThresholdLight };
      material.uniforms.thresholdMid = { value: hopeThresholdMid };
      material.uniforms.thresholdDark = { value: hopeThresholdDark };
      material.uniforms.intensity = { value: grayscaleIntensity };
      material.needsUpdate = true;
    }
  
    // Adjust the aspect ratio
    function updateAspectRatio() {
      aspectRatio = imageWidth / imageHeight;
  
      // Adjust the camera's orthographic projection based on the new aspect ratio
      let scale = Math.min(window.innerWidth / imageWidth, window.innerHeight / imageHeight);
  
      // Update the camera's left, right, top, bottom to match the new aspect ratio
      camera.left = -scale * aspectRatio;
      camera.right = scale * aspectRatio;
      camera.top = scale;
      camera.bottom = -scale;
      camera.updateProjectionMatrix();
  
      // Update renderer size to fit the window
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  
    function initScene() {
      renderer = new THREE.WebGLRenderer({ canvas });
      renderer.setSize(window.innerWidth, window.innerHeight); // Initial size
      renderer.setClearColor(0xeeeeee, 1);
  
      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      camera.position.z = 1;
  
      const geometry = new THREE.PlaneGeometry(2, 2);
  
      material = new THREE.ShaderMaterial({
        uniforms: {
          iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          iChannel0: { value: new THREE.Texture() }, // Default empty texture
          thresholdLight: { value: hopeThresholdLight },
          thresholdMid: { value: hopeThresholdMid },
          thresholdDark: { value: hopeThresholdDark },
          intensity: { value: grayscaleIntensity },
        },
        vertexShader: `void main() { gl_Position = vec4(position, 1.0); }`,
        fragmentShader: shaders[currentFilter], // Initial filter
      });
  
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    }
  
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
  
    onMount(() => {
      initScene();
      animate();
    });
  </script>
  
  <!-- Image upload input -->
  <input type="file" accept="image/*" on:change={loadImage} />
  
  <!-- Filter selection dropdown -->
  <select bind:value={currentFilter} on:change={updateFilter}>
    <option value="hope">Hope Filter</option>
    <option value="grayscale">Grayscale Filter</option>
  </select>
  
  <!-- Adjustable parameters for the filters -->
  {#if currentFilter === 'hope'}
    <div>
      <label for="thresholdLight">Light Threshold: {hopeThresholdLight}</label>
      <input type="range" id="thresholdLight" min="0" max="1" step="0.01" bind:value={hopeThresholdLight} on:input={updateFilter} />
    </div>
    <div>
      <label for="thresholdMid">Mid Threshold: {hopeThresholdMid}</label>
      <input type="range" id="thresholdMid" min="0" max="1" step="0.01" bind:value={hopeThresholdMid} on:input={updateFilter} />
    </div>
    <div>
      <label for="thresholdDark">Dark Threshold: {hopeThresholdDark}</label>
      <input type="range" id="thresholdDark" min="0" max="1" step="0.01" bind:value={hopeThresholdDark} on:input={updateFilter} />
    </div>
  {:else if currentFilter === 'grayscale'}
    <div>
      <label for="grayscaleIntensity">Grayscale Intensity: {grayscaleIntensity}</label>
      <input type="range" id="grayscaleIntensity" min="0" max="1" step="0.01" bind:value={grayscaleIntensity} on:input={updateFilter} />
    </div>
  {/if}
  
  <!-- Aspect Ratio Controls -->
  <div>
    <label for="aspectWidth">Width: {imageWidth}</label>
    <input type="range" id="aspectWidth" min="1" max="2000" step="1" bind:value={imageWidth} on:input={updateAspectRatio} />
  </div>
  <div>
    <label for="aspectHeight">Height: {imageHeight}</label>
    <input type="range" id="aspectHeight" min="1" max="2000" step="1" bind:value={imageHeight} on:input={updateAspectRatio} />
  </div>
  
  <canvas bind:this={canvas}></canvas>
  
  <style>
    canvas {
      display: block;
      margin: 0 auto;
      background-color: #fff;
    }
    select {
      position: absolute;
      top: 10px;
      left: 10px;
      padding: 8px;
      font-size: 16px;
    }
    input[type="file"] {
      position: absolute;
      top: 40px;
      left: 10px;
      padding: 8px;
    }
    input[type="range"] {
      width: 200px;
    }
    div {
      margin: 10px;
    }
  </style>
  