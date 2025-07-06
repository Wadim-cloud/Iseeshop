<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

  export let drawingData: string | null;
  export let zoomLevel: number = 1;
  export let selectedColor: string = 'white';

  let container: HTMLDivElement;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let controls: OrbitControls;
  let model: THREE.Mesh;
  let animationFrameId: number;
  let textureLoading = false;
  let textureError = false;
  let loadingError = false;

  const rainbowShader = {
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform sampler2D map;
      uniform vec3 baseColor;

      vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }

      void main() {
        vec4 texColor = texture2D(map, vUv);
        float hue = vUv.x;
        vec3 rainbow = hsv2rgb(vec3(hue, 1.0, 1.0));
        gl_FragColor = vec4(texColor.rgb * rainbow * baseColor, texColor.a);
      }
    `
  };

  function setupScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    scene.background = new THREE.Color(0xffffff);
    container.appendChild(renderer.domElement);

    camera.position.z = 8;

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.1;
    controls.minDistance = 3;
    controls.maxDistance = 15;

    const warmLightColor = 0xff9999;
    const lightIntensity = 0.4;
    [
      new THREE.Vector3(1, 0, 1),
      new THREE.Vector3(-1, 0, 1),
      new THREE.Vector3(1, 0, -1),
      new THREE.Vector3(-1, 0, -1),
      new THREE.Vector3(0, 1, 0)
    ].forEach((pos) => {
      const light = new THREE.DirectionalLight(warmLightColor, lightIntensity);
      light.position.copy(pos).normalize();
      scene.add(light);
    });
  }

  function loadModel() {
    const loader = new STLLoader();
    loader.load(
      '/models/tshirt.stl',
      (geometry) => {
        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox;
        const size = new THREE.Vector3();
        boundingBox.getSize(size);

        const uvAttribute = geometry.getAttribute('position');
        const uv = [];
        const positions = uvAttribute.array;

        for (let i = 0; i < positions.length; i += 3) {
          const x = positions[i];
          const y = positions[i + 1];
          uv.push(
            (x - boundingBox.min.x) / size.x,
            (y - boundingBox.min.y) / size.y
          );
        }

        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));

        let material: THREE.Material;
        if (drawingData) {
          textureLoading = true;
          const textureLoader = new THREE.TextureLoader();
          textureLoader.load(
            drawingData,
            (texture) => {
              texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
              material = createMaterial(texture);
              if (model) {
                model.material = material;
                model.material.needsUpdate = true;
              }
              textureLoading = false;
            },
            undefined,
            (err) => {
              console.error('Texture load error:', err);
              textureError = true;
              textureLoading = false;
              material = createMaterial(null);
              if (model) {
                model.material = material;
                model.material.needsUpdate = true;
              }
            }
          );
        } else {
          material = createMaterial(null);
        }

        model = new THREE.Mesh(geometry, material);
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);
        model.position.sub(center);
        model.scale.set(zoomLevel, zoomLevel, zoomLevel);
        scene.add(model);

        const box = geometry.boundingBox;
        const sizeBox = new THREE.Vector3();
        box.getSize(sizeBox);
        const diameter = Math.max(sizeBox.x, sizeBox.y, sizeBox.z);
        if (diameter > 10 || diameter < 0.1) {
          camera.position.z = Math.max(diameter * 2, 8);
          controls.minDistance = camera.position.z * 0.5;
          controls.maxDistance = camera.position.z * 2;
        }

        animate();
      },
      undefined,
      (err) => {
        console.error('STL load error:', err);
        loadingError = true;
      }
    );
  }

  function createMaterial(texture: THREE.Texture | null): THREE.Material {
    const isRainbowColor = ['green', 'black', 'white'].includes(selectedColor);
    if (isRainbowColor && texture) {
      return new THREE.ShaderMaterial({
        uniforms: {
          map: { value: texture },
          baseColor: { value: new THREE.Color(getColorHex(selectedColor)) }
        },
        vertexShader: rainbowShader.vertexShader,
        fragmentShader: rainbowShader.fragmentShader
      });
    }
    return new THREE.MeshPhongMaterial({
      map: texture,
      color: getColorHex(selectedColor),
      specular: 0x111111,
      shininess: 30
    });
  }

  function getColorHex(color: string): number {
    switch (color) {
      case 'red':
        return 0xff0000;
      case 'blue':
        return 0x0000ff;
      case 'green':
        return 0x00ff00;
      case 'black':
        return 0x000000;
      case 'white':
      default:
        return 0xffffff;
    }
  }

  function animate() {
    animationFrameId = requestAnimationFrame(animate);
    if (model) {
      model.scale.set(zoomLevel, zoomLevel, zoomLevel);
    }
    controls.update();
    renderer.render(scene, camera);
  }

  function resizeRenderer() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  $: if (zoomLevel && model) {
    model.scale.set(zoomLevel, zoomLevel, zoomLevel);
  }

  $: if ((drawingData || selectedColor) && model) {
    textureLoading = true;
    if (drawingData) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        drawingData,
        (texture) => {
          texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
          model.material = createMaterial(texture);
          model.material.needsUpdate = true;
          textureLoading = false;
        },
        undefined,
        (err) => {
          console.error('Texture update error:', err);
          textureError = true;
          textureLoading = false;
          model.material = createMaterial(null);
          model.material.needsUpdate = true;
        }
      );
    } else {
      model.material = createMaterial(null);
      model.material.needsUpdate = true;
      textureLoading = false;
    }
  }

  onMount(() => {
    setupScene();
    loadModel();
    window.addEventListener('resize', resizeRenderer);
    resizeRenderer();
    return () => {
      window.removeEventListener('resize', resizeRenderer);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      if (model?.material) {
        if (Array.isArray(model.material)) {
          model.material.forEach(m => m.dispose());
        } else {
          model.material.dispose();
        }
      }
    };
  });

  onDestroy(() => {
    if (model) {
      scene.remove(model);
    }
  });
</script>

<div class="model-container" bind:this={container}>
  {#if loadingError}
    <p class="error-message">Error loading 3D model.</p>
  {:else if textureLoading}
    <p class="loading-message">Loading texture...</p>
  {:else if textureError}
    <p class="error-message">Error loading texture.</p>
  {/if}
</div>

<style>
  .model-container {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .error-message,
  .loading-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.9rem;
    text-align: center;
  }

  .loading-message {
    color: #333;
  }
</style>
