import type { Scene, Texture } from 'three';
type EnvironmentOptions = {
    scene: Scene;
    texture?: Texture;
    isBackground?: boolean;
};
export declare const useEnvironment: (options: EnvironmentOptions) => void;
export {};
