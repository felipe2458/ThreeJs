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

export interface ReadyMadeObj{
  name: string;
  selected: boolean;
  enterOptions: boolean;
  obj: (color?: string, colors?: string[], size?: number) => InstanceType<typeof THREE.Mesh>;
}

export interface ObjRotation{
  name: string;
  velocity: 'slow' | 'normal' | 'fast';
  active: boolean;
  rotationInWorld: boolean;
}

export interface ObjRotationVelocity{
  x: number;
  y: number;
  z: number;
}
export interface ColorSelect{
  name: string;
  color?: string;
  colors?: [string, string, string, string, string, string];
}

export interface ObjTexture{
  name: string;
  texture?: string | undefined;
  textures?: [string, string, string, string, string, string];
}

export type ColorComplexSelectedSide = 'top' | 'bottom' | 'left' | 'right' | 'front' | 'back';
