<script lang="ts">
  import { onMount } from 'svelte';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  import * as THREE from 'three';

  let container: HTMLDivElement;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let controls: OrbitControls;

  const numDrones = 140;
  const PHI = (1 + Math.sqrt(5)) / 2;
  const DELTA_S = 1 + Math.sqrt(2);
  const PHI_OVER_DELTA_S = PHI / DELTA_S;

  let baseSpeed = 0.5;
  let k = 0.15;
  let amplitude = 20;

  let drones: THREE.Mesh[] = [];
  let time = 0;
  let mouse = { x: 0, y: 0 };

  // Heatmap with decay
  let heatmap = new THREE.Vector3(0, 0, 0);
  let forecastFactor = 3.0; // 300% projected path

  function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 150;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);

    const geometry = new THREE.SphereGeometry(0.7, 8, 8);

    for (let i = 0; i < numDrones; i++) {
      const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(`hsl(${(i / numDrones) * 360}, 100%, 50%)`) });
      const drone = new THREE.Mesh(geometry, material);
      scene.add(drone);
      drones.push(drone);
    }
  }

  function updateDrones() {
    const currentMouse = new THREE.Vector3(mouse.x * 5, mouse.y * 5, 10);
    heatmap.lerp(currentMouse, 0.1); // slowly track mouse heat
    const forecast = currentMouse.clone().add(currentMouse.clone().sub(heatmap).multiplyScalar(forecastFactor));

    for (let i = 0; i < numDrones; i++) {
      const localTime = time - i * 0.5;
      const theta = 2 * Math.PI * i * PHI_OVER_DELTA_S + localTime * 0.2;
      const radius = 10 * Math.pow(1.03, i % 60);
      let z = amplitude * Math.sin(localTime * 0.3 + i);

      const fwdX = Math.cos(theta);
      const fwdY = Math.sin(theta);

      const prevZ = i === 0 ? 0 : amplitude * Math.sin((localTime + 0.5) * 0.3 + i - 1);
      const dz = z - prevZ;

      const vx = baseSpeed * fwdX + k * dz * fwdX;
      const vy = baseSpeed * fwdY + k * dz * fwdY;

      let x = radius * fwdX + vx * 10;
      let y = radius * fwdY + vy * 10;

      const dronePos = new THREE.Vector3(x, y, z);
      const dist = dronePos.distanceTo(forecast);

      if (dist < 30) {
        const evade = dronePos.clone().sub(forecast).normalize().multiplyScalar((30 - dist) * 0.4);
        x += evade.x;
        y += evade.y;
        z = z + evade.z;
      }

      x += mouse.x * 0.2;
      y += mouse.y * 0.2;

      drones[i].position.set(x, y, z);
    }
  }

  function animate() {
    time += 0.05;
    updateDrones();
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  function handleMouse(e: MouseEvent) {
    mouse.x = (e.clientX - window.innerWidth / 2) / 50;
    mouse.y = (e.clientY - window.innerHeight / 2) / 50;
  }

  onMount(() => {
    initScene();
    window.addEventListener('mousemove', handleMouse);
    animate();
    return () => {
      window.removeEventListener('mousemove', handleMouse);
    };
  });
</script>

<style>
  .swarm {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  .controls {
    position: fixed;
    bottom: 10px;
    left: 10px;
    background: rgba(0, 0, 0, 0.5);
    padding: 8px;
    border-radius: 6px;
    color: white;
  }

  .controls input {
    width: 100px;
  }
</style>

<div bind:this={container} class="swarm"></div>

<!-- Optional controls -->
<div class="controls">
  <label>Transposition k<br><input type="range" min="0.05" max="0.5" step="0.01" bind:value={k}></label><br>
  <label>Amplitude<br><input type="range" min="5" max="50" step="1" bind:value={amplitude}></label>
</div>