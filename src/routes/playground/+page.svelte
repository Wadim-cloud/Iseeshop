<script>
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

  // State for models and UI controls
  let models = [
    { id: 1, name: 'Model 1', file: null, object: null, color: '#ff0000', texture: null, position: [0, 0, 0], visible: true, path: '/models/Dobbelsteen.stl' },
    { id: 2, name: 'Model 2', file: null, object: null, color: '#00ff00', texture: null, position: [3, 0, 0], visible: true, path: '/models/test.stl' },
    { id: 3, name: 'Model 3', file: null, object: null, color: '#0000ff', texture: null, position: [-3, 0, 0], visible: true, path: '/models/tshirt.stl' }
  ];

  let selectedModel = models[0];
  let zoomLevel = 50; // 0 (closest) to 100 (furthest)
  let canvas;
  let scene, camera, renderer, controls;
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };

  // Scene setup
  onMount(async () => {
    // Initialize scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color('#e0e0e0');

    // Initialize camera
    camera = new THREE.PerspectiveCamera(50, 600 / 400, 0.1, 10000);
    camera.position.set(10, 10, 20);
    camera.lookAt(0, 0, 0);

    // Initialize renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(600, 400);
    renderer.shadowMap.enabled = true;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Add grid helper
    const gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0x444444);
    scene.add(gridHelper);

    // Custom orbit controls
    controls = {
      target: new THREE.Vector3(0, 0, 0),
      minDistance: 5,
      maxDistance: 50,
      zoomSpeed: 1.0,
      rotateSpeed: 0.05,
      panSpeed: 0.1
    };

    // Mouse event handlers
    const onMouseDown = (event) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onMouseMove = (event) => {
      if (!isDragging) return;
      const deltaX = event.clientX - previousMousePosition.x;
      const deltaY = event.clientY - previousMousePosition.y;

      if (event.buttons === 1) { // Left click: rotate
        const phi = deltaY * controls.rotateSpeed;
        const theta = deltaX * controls.rotateSpeed;
        const position = camera.position.clone().sub(controls.target);
        const radius = position.length();
        position.applyAxisAngle(new THREE.Vector3(0, 1, 0), -theta);
        const axis = new THREE.Vector3().crossVectors(position, new THREE.Vector3(0, 1, 0)).normalize();
        position.applyAxisAngle(axis, -phi);
        camera.position.copy(controls.target).add(position.normalize().multiplyScalar(radius));
        camera.lookAt(controls.target);
      } else if (event.buttons === 2) { // Right click: pan
        const offset = new THREE.Vector3(-deltaX * controls.panSpeed, deltaY * controls.panSpeed, 0);
        controls.target.add(offset);
        camera.position.add(offset);
        camera.lookAt(controls.target);
      }

      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (event) => {
      event.preventDefault();
      const delta = event.deltaY > 0 ? -1 : 1;
      zoomLevel = Math.max(0, Math.min(100, zoomLevel + delta * controls.zoomSpeed));
    };

    // Add event listeners
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    // Load models sequentially
    const loader = new STLLoader();
    for (const model of models) {
      if (model.path) {
        try {
          console.log(`Loading model: ${model.name}`);
          const response = await fetch(model.path);
          if (!response.ok) throw new Error(`Failed to fetch ${model.path}`);
          const arrayBuffer = await response.arrayBuffer();
          const geometry = loader.parse(arrayBuffer);
          geometry.center();

          // Generate basic UV mapping if none exists
          if (!geometry.attributes.uv) {
            geometry.computeVertexNormals();
            geometry.computeBoundingBox();
            const box = geometry.boundingBox;
            const size = new THREE.Vector3();
            box.getSize(size);
            const uv = new Float32Array(geometry.attributes.position.count * 2);
            for (let i = 0; i < geometry.attributes.position.count; i++) {
              const x = geometry.attributes.position.array[i * 3];
              const y = geometry.attributes.position.array[i * 3 + 1];
              uv[i * 2] = (x - box.min.x) / size.x;
              uv[i * 2 + 1] = (y - box.min.y) / size.y;
            }
            geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
          }

          const material = new THREE.MeshStandardMaterial({
            color: model.color,
            roughness: 0.7,
            metalness: 0.2,
            map: null
          });

          model.object = new THREE.Mesh(geometry, material);
          model.object.position.set(...model.position);
          model.object.castShadow = true;
          model.object.receiveShadow = true;
          if (model.visible) scene.add(model.object);
          models = [...models];
          console.log(`Successfully loaded model: ${model.name}`);
        } catch (error) {
          console.error(`Error loading model ${model.name}:`, error);
        }
      }
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('wheel', onWheel);
      renderer.dispose();
    };
  });

  // Update zoom based on slider
  $: if (camera && controls) {
    const distance = controls.minDistance + (controls.maxDistance - controls.minDistance) * (zoomLevel / 100);
    const direction = camera.position.clone().sub(controls.target).normalize();
    camera.position.copy(controls.target).add(direction.multiplyScalar(distance));
    camera.lookAt(controls.target);
  }

  // Handle file upload (STL)
  function handleFileUpload(event, modelId) {
    const file = event.target.files[0];
    if (!file) return;

    const model = models.find((m) => m.id === modelId);
    if (!model) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const loader = new STLLoader();
      const geometry = loader.parse(e.target.result);
      geometry.center();

      // Generate basic UV mapping if none exists
      if (!geometry.attributes.uv) {
        geometry.computeVertexNormals();
        geometry.computeBoundingBox();
        const box = geometry.boundingBox;
        const size = new THREE.Vector3();
        box.getSize(size);
        const uv = new Float32Array(geometry.attributes.position.count * 2);
        for (let i = 0; i < geometry.attributes.position.count; i++) {
          const x = geometry.attributes.position.array[i * 3];
          const y = geometry.attributes.position.array[i * 3 + 1];
          uv[i * 2] = (x - box.min.x) / size.x;
          uv[i * 2 + 1] = (y - box.min.y) / size.y;
        }
        geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
      }

      if (model.object) scene.remove(model.object);
      const material = new THREE.MeshStandardMaterial({
        color: model.color,
        roughness: 0.7,
        metalness: 0.2,
        map: model.texture ? model.texture : null
      });

      model.object = new THREE.Mesh(geometry, material);
      model.object.position.set(...model.position);
      model.object.castShadow = true;
      model.object.receiveShadow = true;
      if (model.visible) scene.add(model.object);
      model.file = file;
      models = [...models];
    };
    reader.readAsArrayBuffer(file);
  }

  // Handle texture upload
  function handleTextureUpload(event, modelId) {
    const file = event.target.files[0];
    if (!file) return;

    const model = models.find((m) => m.id === modelId);
    if (!model || !model.object) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(e.target.result);
      texture.colorSpace = THREE.SRGBColorSpace;

      model.texture = texture;
      model.object.material.map = texture;
      model.object.material.needsUpdate = true;
      models = [...models];
    };
    reader.readAsDataURL(file);
  }

  // Update model color
  function updateModelColor(modelId, color) {
    const model = models.find((m) => m.id === modelId);
    if (model && model.object) {
      model.color = color;
      model.object.material.color.set(color);
      model.object.material.needsUpdate = true;
      models = [...models];
    }
  }

  // Toggle model visibility
  function toggleModelVisibility(modelId) {
    const model = models.find((m) => m.id === modelId);
    if (model && model.object) {
      model.visible = !model.visible;
      if (model.visible) {
        scene.add(model.object);
      } else {
        scene.remove(model.object);
      }
      models = [...models];
    }
  }

  // Reset camera
  function resetCamera() {
    zoomLevel = 50;
    camera.position.set(10, 10, 20);
    controls.target.set(0, 0, 0);
    camera.lookAt(controls.target);
  }

  // Export viewport as PNG
  function exportViewport() {
    renderer.render(scene, camera); // Ensure the scene is rendered
    const dataURL = renderer.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'viewport-snapshot.png';
    link.click();
  }
</script>

<main>
  <div class="app-container">
    <div class="sidebar">
      <h2>STL Viewer</h2>
      <div class="models-section">
        <h3>Models</h3>
        {#each models as model}
          <div
            class="model-item"
            class:selected={selectedModel.id === model.id}
            on:click={() => (selectedModel = model)}
          >
            <div class="model-header">
              <input
                type="checkbox"
                checked={model.visible}
                on:change={() => toggleModelVisibility(model.id)}
              />
              <span>{model.name}</span>
            </div>
            <div class="model-controls">
              <div class="file-upload">
                <label for={`file-${model.id}`}>Upload STL</label>
                <input
                  type="file"
                  id={`file-${model.id}`}
                  accept=".stl"
                  on:change={(e) => handleFileUpload(e, model.id)}
                />
              </div>
              <div class="file-upload">
                <label for={`texture-${model.id}`}>Upload Texture</label>
                <input
                  type="file"
                  id={`texture-${model.id}`}
                  accept="image/*"
                  on:change={(e) => handleTextureUpload(e, model.id)}
                />
              </div>
              <div class="color-picker">
                <span>Color:</span>
                <input
                  type="color"
                  value={model.color}
                  on:input={(e) => updateModelColor(model.id, e.target.value)}
                />
              </div>
            </div>
          </div>
        {/each}
      </div>
      <div class="scene-controls">
        <h3>Controls</h3>
        <div class="control-group">
          <label for="zoom-level">Zoom Level</label>
          <input
            type="range"
            id="zoom-level"
            min="0"
            max="100"
            step="1"
            bind:value={zoomLevel}
          />
          <span>{Math.round(zoomLevel)}</span>
        </div>
        <button on:click={resetCamera}>Reset Camera</button>
        <button on:click={exportViewport}>Export as PNG</button>
      </div>
    </div>
    <div class="canvas-container">
      <canvas bind:this={canvas}></canvas>
    </div>
  </div>
</main>

<style>
  .app-container {
    display: flex;
    height: 100vh;
  }
  .sidebar {
    width: 250px;
    padding: 20px;
    background-color: #fff;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
  }
  .canvas-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #e0e0e0;
  }
  canvas {
    width: 600px;
    height: 400px;
    border: 1px solid #ccc;
  }
  h2,
  h3 {
    margin: 0 0 15px;
  }
  .models-section,
  .scene-controls {
    margin-bottom: 20px;
  }
  .model-item {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
  }
  .model-item.selected {
    border-color: #007bff;
    background-color: #e7f1ff;
  }
  .model-header {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }
  .model-header span {
    margin-left: 8px;
    font-weight: bold;
  }
  .model-controls {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .file-upload {
    display: flex;
    flex-direction: column;
  }
  .file-upload label {
    background-color: #007bff;
    color: white;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    margin-bottom: 5px;
  }
  .file-upload input[type="file"] {
    display: none;
  }
  .color-picker {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .control-group {
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
  }
  button:hover {
    background-color: #0056b3;
  }
  input[type="range"] {
    width: 100%;
  }
</style>