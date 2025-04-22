<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import * as THREE from 'three';
    import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
    import { TextureLoader } from 'three';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

    // Input props
    export let stlFile: string = '/models/tshirt.stl';
    export let defaultTextureImage: string = '/texture/boom.png';
    export let width: string = '100%';
    export let height: string = '300px';
    export let backgroundColor: number = 0x000000;
    export let modelColor: number = 0x808080;
    export let floating: boolean = false;
    export let rotationSpeedY: number = 0.01;     // Only Y-axis rotation speed
    export let autoRotate: boolean = true;        // Control if model auto-rotates
    export let enableZoom: boolean = true;        // Enable zoom controls
    export let initialZoom: number = 8;           // Initial zoom level (higher = more zoomed out)
    export let drawingData: string | null = null; // Prop for gallery integration

    // Internal state
    let container: HTMLDivElement | null = null;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let model: THREE.Mesh | null = null;
    let controls: OrbitControls | null = null;
    let userUploadedTexture: THREE.Texture | null = null;
    let loadingError: boolean = false;
    let floatOffset: number = 0;
    const floatSpeed: number = 0.005;
    const floatAmplitude: number = 0.1;
    let textureLoading: boolean = false;
    let textureError: boolean = false;

    onMount(() => {
        setTimeout(() => {
            if (container) {
                init();
            }
        });
        window.addEventListener('resize', onResize);
    });

    onDestroy(() => {
        window.removeEventListener('resize', onResize);
        if (renderer) {
            renderer.dispose();
            renderer.forceContextLoss();
        }
        if (model?.material) {
            if (Array.isArray(model.material)) {
                model.material.forEach(m => m.dispose());
            } else {
                model.material.dispose();
            }
        }
        if (controls) {
            controls.dispose();
        }
    });

    function init() {
        const width = container?.offsetWidth || 800;
        const height = container?.offsetHeight || 600;

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = initialZoom; // Set initial zoom level

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setClearColor(backgroundColor, 1);
        container?.appendChild(renderer.domElement);

        // Initialize OrbitControls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = enableZoom;
        controls.enablePan = false;
        
        // Lock rotation to Y axis only
        controls.minPolarAngle = Math.PI / 2;
        controls.maxPolarAngle = Math.PI / 2;
        
        // Additional controls settings
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = autoRotate;
        controls.autoRotateSpeed = rotationSpeedY * 10; // Convert to OrbitControls speed format
        
        // Set zoom limits
        controls.minDistance = 3;  // Minimum zoom level (closest)
        controls.maxDistance = 15; // Maximum zoom level (furthest)

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight.position.set(1, 1, 1).normalize();
        scene.add(directionalLight);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
        directionalLight2.position.set(-1, -1, -1).normalize();
        scene.add(directionalLight2);

        const loader = new STLLoader();
        loader.load(
            stlFile,
            (geometry) => {
                // Generate UV coordinates
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
                    const z = positions[i + 2];
                    
                    uv.push(
                        (x - boundingBox.min.x) / size.x,
                        (y - boundingBox.min.y) / size.y
                    );
                }
                
                geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
                
                const material = createMaterial();
                model = new THREE.Mesh(geometry, material);
                
                // Center the model
                geometry.computeBoundingBox();
                const center = new THREE.Vector3();
                boundingBox.getCenter(center);
                model.position.sub(center);
                
                // Scale the model if needed
                // const modelScale = 1.0; // Adjust as needed
                // model.scale.set(modelScale, modelScale, modelScale);
                
                scene.add(model);
                
                // Adjust camera if needed based on model size
                fitCameraToModel(geometry);
                
                animate();
            },
            undefined,
            (error) => {
                console.error('STL Load Error:', error);
                loadingError = true;
            }
        );
    }
    
    // Function to adjust camera to properly frame the model
    function fitCameraToModel(geometry) {
        if (!geometry || !geometry.boundingBox) return;
        
        // Get model size
        const box = geometry.boundingBox;
        const size = new THREE.Vector3();
        box.getSize(size);
        
        // Get model diameter (approximation)
        const diameter = Math.max(size.x, size.y, size.z);
        
        // Adjust camera distance if needed
        if (diameter > 0) {
            // This is a backup adjustment - our initialZoom setting should take priority
            // Only adjust if model is unusually large or small
            if (diameter > 10 || diameter < 0.1) {
                const adjustedZoom = Math.max(diameter * 2, initialZoom);
                camera.position.z = adjustedZoom;
                
                // Also update control limits
                if (controls) {
                    controls.minDistance = adjustedZoom * 0.5;
                    controls.maxDistance = adjustedZoom * 2;
                }
            }
        }
    }

    function createMaterial() {
        textureLoading = true;
        textureError = false;

        try {
            if (drawingData) {
                const texture = new TextureLoader().load(drawingData);
                texture.anisotropy = renderer?.capabilities.getMaxAnisotropy() || 1;
                textureLoading = false;
                return new THREE.MeshPhongMaterial({ map: texture });
            }

            if (userUploadedTexture) {
                userUploadedTexture.anisotropy = renderer?.capabilities.getMaxAnisotropy() || 1;
                textureLoading = false;
                return new THREE.MeshPhongMaterial({ map: userUploadedTexture });
            }

            if (defaultTextureImage) {
                const texture = new TextureLoader().load(defaultTextureImage);
                texture.anisotropy = renderer?.capabilities.getMaxAnisotropy() || 1;
                textureLoading = false;
                return new THREE.MeshPhongMaterial({ map: texture });
            }
        } catch (error) {
            console.error('Texture load error:', error);
            textureError = true;
        }

        textureLoading = false;
        return new THREE.MeshPhongMaterial({
            color: modelColor,
            specular: 0x111111,
            shininess: 30,
        });
    }

    function animate() {
        if (!renderer || !scene || !camera) return;

        requestAnimationFrame(animate);

        // Update controls
        if (controls) {
            controls.update();
        }

        // Handle floating animation if enabled (independent of rotation)
        if (model && floating) {
            floatOffset += floatSpeed;
            model.position.y = Math.sin(floatOffset) * floatAmplitude;
        }

        renderer.render(scene, camera);
    }

    function onResize() {
        if (!camera || !renderer || !container) return;

        const width = container.offsetWidth;
        const height = container.offsetHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    function handleFileChange(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const textureLoader = new TextureLoader();
            userUploadedTexture = textureLoader.load(reader.result as string);
            if (model) {
                model.material = createMaterial();
                model.material.needsUpdate = true;
            }
        };
        reader.readAsDataURL(file);
    }
    
    // Optional function to toggle auto-rotation
    function toggleRotation() {
        if (controls) {
            controls.autoRotate = !controls.autoRotate;
        }
    }
    
    // Reset zoom to initial level
    function resetView() {
        if (camera && controls) {
            camera.position.z = initialZoom;
            camera.position.x = 0;
            camera.position.y = 0;
            controls.target.set(0, 0, 0);
            controls.update();
        }
    }

    $: if (drawingData && model) {
        model.material = createMaterial();
        model.material.needsUpdate = true;
    }
</script>

<div class="floating-model-container" bind:this={container}>
    {#if loadingError}
        <p class="error-message">Error loading 3D model.</p>
    {:else if textureLoading}
        <p class="loading-message">Loading texture...</p>
    {:else if textureError}
        <p class="error-message">Error loading texture.</p>
    {/if}
    
    <div class="controls">
        <button on:click={toggleRotation}>
            {controls?.autoRotate ? 'Stop Rotation' : 'Start Rotation'}
        </button>
        <button on:click={resetView}>
            Reset View
        </button>
    </div>
</div>

{#if !drawingData}
    <div class="upload-container">
        <input type="file" accept="image/*" on:change={handleFileChange} />
        <p>Upload your own picture to texture the model.</p>
    </div>
{/if}

<style>
    .floating-model-container {
        position: relative;
        width: var(--model-width, 100%);
        height: var(--model-height, 300px);
        overflow: hidden;
    }

    .floating-model-container canvas {
        display: block;
        width: 100%;
        height: 100%;
    }

    .error-message, .loading-message {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: red;
        text-align: center;
        padding: 20px;
    }

    .loading-message {
        color: white;
    }

    .upload-container {
        margin-top: 15px;
        text-align: center;
    }

    .upload-container input[type="file"] {
        margin-top: 5px;
    }
    
    .controls {
        position: absolute;
        bottom: 10px;
        right: 10px;
        z-index: 100;
    }
    
    .controls button {
        background-color: rgba(255, 255, 255, 0.7);
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 5px 10px;
        margin-left: 5px;
        cursor: pointer;
    }
    
    .controls button:hover {
        background-color: rgba(255, 255, 255, 0.9);
    }
</style>