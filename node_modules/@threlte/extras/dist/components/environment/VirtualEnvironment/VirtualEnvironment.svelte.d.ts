import type { VirtualEnvironmentProps } from './types';
declare const VirtualEnvironment: import("svelte").Component<VirtualEnvironmentProps, {
    camera: import("three").CubeCamera;
    renderTarget: import("three").WebGLCubeRenderTarget;
    update: () => void;
    restart: () => void;
}, "">;
export default VirtualEnvironment;
