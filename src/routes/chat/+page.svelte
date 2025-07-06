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
  let blue18Count = 0;
  let yellow50Count = 0;
  let specialHearts: string[] = [];
  let openHeart: string | null = null;

  let exportRequested = false;

  let context: AudioContext | null = null;
  if (typeof window !== 'undefined') {
    context = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  const opToFreq: Record<number, number> = {
    1: 440,   // A4
    2: 494,   // B4
    3: 523,   // C5
    4: 587    // D5
  };

  function playTone(freq: number, duration = 0.3) {
    if (!context) return;
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(context.destination);
    osc.start();
    osc.stop(context.currentTime + duration);
  }

  function playChainSequence(chainStr: string) {
    const chain = chainStr.split('').map(Number);
    chain.forEach((op, i) => {
      setTimeout(() => {
        playTone(opToFreq[op] || 400);
      }, i * 400); // dial speed
    });
  }

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
    blue18Count = 0;
    yellow50Count = 0;
    specialHearts = [];

    let i = 0;

    const coordinateChains: number[][][] = [];
    const redHighlightChains: number[][][] = [];
    const blueHighlightChains: number[][][] = [];
    const greenHighlightChains: number[][][] = [];
    const yellowHighlightChains: number[][][] = [];
    const meanPath: Map<number, number[]> = new Map();

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
            yellowHighlightChains.push(coords);
            yellow50Count++;
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
            if (chain.length === 18) {
              blue18Count++;
            }
          } else {
            greenHighlightChains.push(coords);
            if (chain.length > greenLength) {
              greenLength = chain.length;
              longestGreenChain = chainStr;
            }
          }

          if (chain.length === 18) {
            console.log('💥 PING! Chain hit 18 with 18 digits!');
            specialHearts.push(chainStr);
            if (typeof window !== 'undefined') {
              playChainSequence(chainStr);
            }
          }
        }

        coords.forEach(([x, y]) => {
          if (!meanPath.has(x)) meanPath.set(x, []);
          meanPath.get(x)!.push(y);
        });

        progress.set(Math.floor((i / attempts) * 100));
      }

      if (i < attempts) {
        setTimeout(runBatch, 0);
      } else {
        generating.set(false);
        renderScene(coordinateChains, redHighlightChains, blueHighlightChains, greenHighlightChains, yellowHighlightChains, meanPath);
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

  function renderScene(data: number[][][], redLines: number[][][], blueLines: number[][][], greenLines: number[][][], yellowLines: number[][][], meanPath: Map<number, number[]>) {
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
    const yellowMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
    const meanMaterial = new THREE.LineBasicMaterial({ color: 0xaa00ff, linewidth: 10 });
    const momentumMaterial = new THREE.LineBasicMaterial({ color: 0xff69b4, linewidth: 4 });

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
    plotChains(yellowLines, yellowMaterial);

    const meanPoints: THREE.Vector3[] = [];
    const momentumPoints: THREE.Vector3[] = [];
    let prevAvgY = null;
    for (let [x, yList] of Array.from(meanPath.entries()).sort((a, b) => a[0] - b[0])) {
      const avgY = yList.reduce((sum, y) => sum + y, 0) / yList.length;
      meanPoints.push(new THREE.Vector3(x, avgY, 0));
      if (prevAvgY !== null) {
        const momentum = avgY - prevAvgY;
        momentumPoints.push(new THREE.Vector3(x, momentum * 10, 0));
      }
      prevAvgY = avgY;
    }

    const meanGeo = new THREE.BufferGeometry().setFromPoints(meanPoints);
    const meanLine = new THREE.Line(meanGeo, meanMaterial);
    scene.add(meanLine);

    if (momentumPoints.length > 1) {
      const momentumGeo = new THREE.BufferGeometry().setFromPoints(momentumPoints);
      const momentumLine = new THREE.Line(momentumGeo, momentumMaterial);
      scene.add(momentumLine);
    }

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
  <p><strong>Blue Chains Exactly 18 Steps:</strong> {blue18Count}</p>
  <p><strong>Yellow Chains Exactly 50 Steps:</strong> {yellow50Count}</p>

  <h3>💖 Heart Chains (Hit 18 in Exactly 18 Steps)</h3>
  <ul>
    {#each specialHearts as chain}
      <li
        on:click={() => openHeart = openHeart === chain ? null : chain}
        style="cursor: pointer; margin-bottom: 0.5rem;"
      >
        ❤️ {chain}
        {#if openHeart === chain}
          <pre style="margin-left: 1rem; color: #0ff; font-family: monospace;">
{chain.split('').join(' ')}
          </pre>
        {/if}
      </li>
    {/each}
  </ul>

  <h3>Legend</h3>
  <ul>
    <li><span style="color: #ff0000;">Red</span>: Hit 18 in ≤18 steps</li>
    <li><span style="color: #0000ff;">Blue</span>: Hit 18 in &lt;100 steps</li>
    <li><span style="color: #00ff00;">Green</span>: Hit 18 in ≥100 steps</li>
    <li><span style="color: #ffff00;">Yellow</span>: Hit 18 in exactly 50 steps</li>
    <li><span style="color: #aa00ff;">Purple</span>: Mean trajectory over steps</li>
    <li><span style="color: #ff69b4;">Pink</span>: Momentum of mean</li>
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
