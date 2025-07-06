<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

  let operationChains: string[] = [];
  let generating = writable(false);
  let progress = writable(0);
  let sceneEl: HTMLDivElement;
  let maxModulationChain = "";
  let maxModulations = 0;
  let shortestRedChain = "";
  let redLength = Infinity;
  let shortestBlueChain = "";
  let blueLength = Infinity;
  let longestGreenChain = "";
  let greenLength = 0;

  let exportRequested = false;

  function generateRandomOperatorChain(start = 2, target = 18, attempts = 60000) {
    const ops = [1, 2, 3, 4];

    function apply(val: number, op: number): number {
      if (op === 1) return val + 2;
      if (op === 2) return val - 2;
      if (op === 3) return val * 2;
      if (op === 4) return val % 2 === 0 ? val / 2 : val;
      return val;
    }

    generating.set(true);
    operationChains = [];
    maxModulationChain = "";
    maxModulations = 0;

    let i = 0;

    const positionMap: Record<string, number> = {};
    const coordinateChains: number[][][] = [];
    const redHighlightChains: number[][][] = [];
    const blueHighlightChains: number[][][] = [];
    const greenHighlightChains: number[][][] = [];
    const exactly50StepChains: string[] = [];
    let maxLength = 0;

    function runBatch() {
      for (let batch = 0; batch < 100 && i < attempts; batch++, i++) {
        let val = start;
        let chain: number[] = [];
        let coords: number[][] = [[0, val]];
        let step = 0;

        while (val !== target && step < 300) {
          const op = ops[Math.floor(Math.random() * ops.length)];
          const newVal = apply(val, op);
          if (newVal !== undefined) {
            val = newVal;
            chain.push(op);
            coords.push([step + 1, val]);
          }
          step++;
        }

        const chainStr = chain.join('');
        operationChains.push(chainStr);
        coordinateChains.push(coords);

        if (chain.length > maxModulations) {
          maxModulations = chain.length;
          maxModulationChain = chainStr;
        }

        if (val === target) {
          if (chain.length === 50) {
            exactly50StepChains.push(chainStr);
          }

          if (coords.length <= 18) {
            redHighlightChains.push(coords);
            if (chain.length < redLength) {
              redLength = chain.length;
              shortestRedChain = chainStr;
            }
          } else if (coords.length < 100) {
            blueHighlightChains.push(coords);
            if (chain.length < blueLength) {
              blueLength = chain.length;
              shortestBlueChain = chainStr;
            }
          } else {
            greenHighlightChains.push(coords);
            if (chain.length > greenLength) {
              greenLength = chain.length;
              longestGreenChain = chainStr;
            }
          }
        }

        progress.set(Math.floor((i / attempts) * 100));
      }

      if (i < attempts) {
        setTimeout(runBatch, 0);
      } else {
        generating.set(false);
        renderScene(coordinateChains, redHighlightChains, blueHighlightChains, greenHighlightChains);
        if (exportRequested) exportAsImage();
      }
    }

    runBatch();

    function exportAsImage() {
      const canvas = sceneEl.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.download = 'operator-paths.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    }
  }

  function renderScene(data: number[][][], redLines: number[][][], blueLines: number[][][], greenLines: number[][][]) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    sceneEl.innerHTML = '';
    sceneEl.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.z = 50;

    const material = new THREE.LineBasicMaterial({ color: 0x00ffcc });
    const redMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const blueMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const greenMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });

    const positionFrequency: Record<string, number> = {};

    for (const chain of data) {
      for (const [x, y] of chain) {
        const key = `${x},${y}`;
        positionFrequency[key] = (positionFrequency[key] || 0) + 1;
      }
    }

    function plotChains(chains: number[][][], lineMaterial: THREE.LineBasicMaterial) {
      for (const chain of chains) {
        const points: THREE.Vector3[] = [];
        for (const [x, y] of chain) {
          const freq = positionFrequency[`${x},${y}`];
          points.push(new THREE.Vector3(x, y, freq * 0.05));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, lineMaterial);
        scene.add(line);
      }
    }

    plotChains(data, material);
    plotChains(redLines, redMaterial);
    plotChains(blueLines, blueMaterial);
    plotChains(greenLines, greenMaterial);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();
  }

  function triggerExport() {
    exportRequested = true;
    generateRandomOperatorChain();
  }

  onMount(() => {
    generateRandomOperatorChain();
  });
</script>

<div bind:this={sceneEl} style="position: fixed; top: 0; left: 0; width: 70%; height: 100vh; background: black;"></div>

<div id="results">
  <h2>Random Operator Chains to 18 (60000 Attempts)</h2>
  <p>Progress: {$progress}%</p>
  {#if $generating}
    <p>Generating...</p>
  {/if}
  <p>{operationChains.length} chains generated</p>
  <p><strong>Longest Chain:</strong> {maxModulationChain} ({maxModulations} steps)</p>
  <p><strong>Shortest Red Chain (≤18 steps):</strong> {shortestRedChain} ({redLength} steps)</p>
  <p><strong>Shortest Blue Chain (&lt;100 steps):</strong> {shortestBlueChain} ({blueLength} steps)</p>
  <p><strong>Longest Green Chain (≥100 steps):</strong> {longestGreenChain} ({greenLength} steps)</p>
  <h3>Chains with Exactly 50 Steps to 18</h3>
  <ul>
    {#each operationChains.filter(c => c.length === 50) as chain}
      <li>{chain}</li>
    {/each}
  </ul>
  <button on:click={triggerExport}>Export as PNG</button>
</div>

<style>
  #results {
    position: fixed;
    top: 0;
    right: 0;
    width: 30%;
    height: 100vh;
    padding: 1rem;
    overflow-y: auto;
    background: #111;
    color: #0f0;
    font-family: monospace;
    font-size: 0.85rem;
    border-left: 2px solid #0f0;
  }
  button {
    background: #0f0;
    color: black;
    border: none;
    padding: 0.5rem;
    font-weight: bold;
    cursor: pointer;
    margin-top: 1rem;
  }
</style>
