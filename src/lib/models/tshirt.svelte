<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

  export let drawingData: string | null;
  export let zoomLevel: number = 1;

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

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
      directionalLight.position.set(1, 1, 1).normalize();
      scene.add(directionalLight);
      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
      directionalLight2.position.set(-1, -1, -1).normalize();
      scene.add(directionalLight2);
  }

  function loadModel() {
      console.log('Loading T-shirt model with drawingData:', drawingData);
      const loader = new STLLoader();
      loader.load(
          '/models/tshirt.stl',
          (geometry) => {
              console.log('STL model loaded successfully');
              // Generate simple planar UV map
              geometry.computeBoundingBox();
              const boundingBox = geometry.boundingBox;
              const size = new THREE.Vector3();
              boundingBox.getSize(size);

              const uvAttribute = geometry.getAttribute('position');
              const uv = [];
              const positions = uvAttribute.array;

              // Simple planar projection using x,y for T-shirt front
              for (let i = 0; i < positions.length; i += 3) {
                  const x = positions[i];
                  const y = positions[i + 1];
                  uv.push(
                      (x - boundingBox.min.x) / size.x,
                      (y - boundingBox.min.y) / size.y
                  );
              }

              console.log('Generated UVs sample:', uv.slice(0, 10));
              geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));

              // Create material
              let material;
              if (drawingData) {
                  textureLoading = true;
                  const textureLoader = new THREE.TextureLoader();
                  console.log('Attempting to load texture:', drawingData);
                  textureLoader.load(
                      drawingData,
                      (texture) => {
                          console.log('Texture loaded successfully');
                          texture.flipY = false;
                          texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
                          material = new THREE.MeshPhongMaterial({
                              map: texture,
                              color: 0xffffff,
                              specular: 0x111111,
                              shininess: 30
                          });
                          if (model) {
                              model.material = material;
                              model.material.needsUpdate = true;
                          }
                          textureLoading = false;
                      },
                      (progress) => {
                          console.log('Texture loading progress:', progress.loaded / progress.total);
                      },
                      (err) => {
                          console.error('Texture load error:', err);
                          textureError = true;
                          textureLoading = false;
                          material = new THREE.MeshPhongMaterial({
                              color: 0xffffff
                          });
                          if (model) {
                              model.material = material;
                              model.material.needsUpdate = true;
                          }
                      }
                  );
              } else {
                  console.warn('No drawingData provided, using default material');
                  material = new THREE.MeshPhongMaterial({
                      color: 0xffffff,
                      specular: 0x111111,
                      shininess: 30
                  });
              }

              // Create mesh
              model = new THREE.Mesh(geometry, material);
              geometry.computeBoundingBox();
              const center = new THREE.Vector3();
              boundingBox.getCenter(center);
              model.position.sub(center);
              model.scale.set(zoomLevel, zoomLevel, zoomLevel);
              scene.add(model);

              // Adjust camera
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
          (progress) => {
              console.log('Model loading progress:', progress.loaded / progress.total);
          },
          (err) => {
              console.error('STL load error:', err);
              loadingError = true;
          }
      );
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

  $: if (drawingData && model) {
      textureLoading = true;
      const textureLoader = new THREE.TextureLoader();
      console.log('Reactive texture update for drawingData:', drawingData);
      textureLoader.load(
          drawingData,
          (texture) => {
              console.log('Texture updated successfully');
              texture.flipY = false;
              texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
              const material = new THREE.MeshPhongMaterial({
                  map: texture,
                  color: 0xffffff,
                  specular: 0x111111,
                  shininess: 30
              });
              model.material = material;
              model.material.needsUpdate = true;
              textureLoading = false;
          },
          (progress) => {
              console.log('Texture update progress:', progress.loaded / progress.total);
          },
          (err) => {
              console.error('Texture update error:', err);
              textureError = true;
              textureLoading = false;
              model.material = new THREE.MeshPhongMaterial({
                  color: 0xffffff
              });
              model.material.needsUpdate = true;
          }
      );
  }

  onMount(() => {
      console.log('TshirtModel mounted with drawingData:', drawingData);
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
      color: #e74c3c;
      font-size: 0.9rem;
      text-align: center;
  }

  .loading-message {
      color: #333;
  }
</style>