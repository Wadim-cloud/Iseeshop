import type { CubeCameraProps } from './types';
declare const CubeCamera: import("svelte").Component<CubeCameraProps, {
    camera: import("three").CubeCamera;
    renderTarget: import("three").WebGLCubeRenderTarget;
    update: () => void;
    restart: () => void;
}, "ref">;
export default CubeCamera;
