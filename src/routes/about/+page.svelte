<script>
    import Floating3DModel from '$lib/Floating3DModel.svelte';
    import { supabase } from '$lib/supabase';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    // --- Page Title ---
    const pageTitle = 'About Pexos';
    const pageDescription = 'Learn more about Pexos, its creators, and the mission behind it.';

    // --- Authentication State ---
    let user = null;
    let isCheckingAuth = true;

    // --- 3D Model Configuration ---
    const modelConfig = {
        stlFile: '/models/tshirt.stl',
        defaultTextureImage: '/texture/boom.png',
        width: '100%',
        height: '400px',
        backgroundColor: '#f0f0f0',
        modelColor: '#cccccc',
        floating: true,
        rotationSpeedY: 0.5,         // Only Y rotation (speed adjusted for OrbitControls)
        autoRotate: true,            // Enable auto-rotation by default
        enableZoom: true,            // Enable zoom controls
    };

    onMount(async () => {
        // Your authentication code here
        isCheckingAuth = false;
    });
</script>

<div class="page-wrapper">
    <div class="model-container">
        <Floating3DModel {...modelConfig} />
    </div>

    <div class="about-section">
        <h2>About Pexos</h2>
        <p>Wadim Seminsky and Bertin van Vliet, two passionate visionaries, crafted Pexos as a vibrant creative platform where artists can unleash their imaginations and bring drawings to life. This space is a celebration of art, innovation, and community.</p>
        <p>Right now, we’re rallying support for a heartfelt cause—raising funds to help a dear friend get new teeth, restoring their confidence and smile. Every small gesture counts, and you can make a difference! Join us in this mission by grabbing a virtual coffee for the cause at <a href="https://buymeacoffee.com/wadiem" target="_blank" class="coffee-button">buymeacoffee.com/wadiem</a>. Your support fuels both creativity and kindness!</p>
    </div>

    <p class="quote">"They hang me up to dry too many times" - Cold War Kids</p>
</div>

<style>
    .page-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 80vh;
        padding: 20px;
        background: linear-gradient(180deg, #f9fafb 0%, #e5e7eb 100%);
    }

    .page-title {
        font-size: 2.2em;
        margin-bottom: 20px;
        text-align: center;
        color: #1f2937;
    }

    .quote {
        margin-top: 40px;
        font-size: 1.2em;
        font-style: italic;
        color: #4b5563;
        text-align: center;
        opacity: 0.9;
    }

    .model-container {
        width: 100%;
        max-width: 800px;
        margin-bottom: 40px;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
        transition: transform 0.3s ease;
    }

    .model-container:hover {
        transform: translateY(-5px);
    }

    .about-section {
        max-width: 800px;
        text-align: center;
        margin-bottom: 40px;
        padding: 30px;
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
        position: relative;
        overflow: hidden;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .about-section:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    }

    .about-section::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 5px;
        background: linear-gradient(90deg, #3b82f6, #10b981);
    }

    .about-section h2 {
        font-size: 2em;
        margin-bottom: 20px;
        color: #1f2937;
        font-weight: 700;
        position: relative;
        display: inline-block;
    }

    .about-section h2::after {
        content: '';
        display: block;
        width: 50%;
        height: 3px;
        background: #3b82f6;
        margin: 10px auto 0;
        border-radius: 2px;
    }

    .about-section p {
        font-size: 1.15em;
        line-height: 1.7;
        color: #4b5563;
        margin-bottom: 20px;
    }

    .coffee-button {
        display: inline-block;
        padding: 10px 20px;
        background: linear-gradient(90deg, #f59e0b, #d97706);
        color: #ffffff;
        text-decoration: none;
        font-weight: 600;
        border-radius: 8px;
        transition: background 0.3s ease, transform 0.2s ease;
    }

    .coffee-button:hover {
        background: linear-gradient(90deg, #d97706, #b45309);
        transform: scale(1.05);
        text-decoration: none;
    }
</style>