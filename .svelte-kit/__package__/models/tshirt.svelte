<script lang="ts">
  import * as THREE from 'three';
  import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  import { onMount, onDestroy } from 'svelte';

  export let drawingData: string | null = null; // Supabase image URL
  export let modelUrl: string = '/models/test.stl'; // STL model URL

  let container: HTMLDivElement;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let controls: OrbitControls;
  let model: THREE.Mesh | null = null;
  let animationFrameId: number;

  onMount(() => {
    initScene();
    loadModel();
    animate();
    window.addEventListener('resize', onWindowResize);
    return () => {
      window.removeEventListener('resize', onWindowResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  });

  const initScene = () => {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x333333);

    // Camera setup
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 5);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 1;
    controls.maxDistance = 50;

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.6);
    pointLight.position.set(-5, 3, -5);
    scene.add(pointLight);
  };

  const generateUVs = (geometry: THREE.BufferGeometry) => {
    geometry.computeBoundingBox();
    geometry.computeVertexNormals(); // For better lighting
    const { min, max } = geometry.boundingBox!;
    const size = new THREE.Vector3().subVectors(max, min);
    const positionAttr = geometry.getAttribute('position');
    const uvArray: number[] = [];

    // Project UVs based on vertex positions for better texture mapping
    for (let i = 0; i < positionAttr.count; i++) {
      const x = positionAttr.getX(i);
      const y = positionAttr.getY(i);
      const z = positionAttr.getZ(i);
      // Use spherical UV mapping for better texture distribution
      const u = (Math.atan2(x, z) / (2 * Math.PI)) + 0.5;
      const v = (y - min.y) / size.y;
      uvArray.push(u, v);
    }

    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvArray, 2));
    geometry.attributes.uv.needsUpdate = true;
  };

  const loadModel = async () => {
    try {
      const loader = new STLLoader();
      const geometry = await new Promise<THREE.BufferGeometry>((resolve, reject) => {
        loader.load(modelUrl, resolve, undefined, reject);
      });

      // Process geometry
      generateUVs(geometry);
      geometry.center();
      geometry.computeVertexNormals();

      // Material setup
      let material: THREE.Material;
      try {
        const texture = drawingData
          ? await new THREE.TextureLoader().loadAsync(drawingData)
          : null;
        
        if (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        }

        material = texture
          ? new THREE.MeshStandardMaterial({
              map: texture,
              metalness: 0.2,
              roughness: 0.8,
              side: THREE.DoubleSide
            })
          : new THREE.MeshStandardMaterial({
              color: 0xcccccc,
              metalness: 0.2,
              roughness: 0.8,
              side: THREE.DoubleSide
            });
      } catch (error) {
        console.error('Texture loading failed:', error);
        material = new THREE.MeshStandardMaterial({
          color: 0xcccccc,
          metalness: 0.2,
          roughness: 0.8
        });
      }

      // Create and add model
      model = new THREE.Mesh(geometry, material);
      model.scale.set(0.5, 0.5, 0.5);
      scene.add(model);

      // Add bounding box helper
      const bounds = new THREE.Box3().setFromObject(model);
      scene.add(new THREE.Box3Helper(bounds, 0xffff00));

      // Adjust camera to fit model
      const size = bounds.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
      cameraZ *= 1.5; // Zoom out a bit
      camera.position.z = cameraZ;
      controls.update();

    } catch (error) {
      console.error('Model loading failed:', error);
      const fallback = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({ color: 0xff0000 })
      );
      scene.add(fallback);
    }
  };

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);
    if (model) model.rotation.y += 0.005; // Slower rotation
    controls.update();
    renderer.render(scene, camera);
  };

  const onWindowResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };
</script>

<div bind:this={container} class="canvas-container"></div>

<style>
  .canvas-container {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
    z-index: 0;
  }
</style>