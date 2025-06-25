import * as THREE from 'three';
export interface GLTFResult {
  scene: InstanceType<typeof THREE.Group>;
  animations: InstanceType<typeof THREE.AnimationClip>[];
}
export interface CelestialBodyTextures{
  mercury: string;
  venus: string;
  earth: string;
  mars: string;
  jupiter: string;
  saturn: {
    texture: string;
    rings: string;
  };
  uranus: {
    texture: string;
    rings: string;
  };
  neptune: string;
  pluto: string;
  sun: string;
  moon: string;
}
