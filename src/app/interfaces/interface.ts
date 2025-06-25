import * as THREE from 'three';

export interface GLTFResult {
  scene: InstanceType<typeof THREE.Group>;
  animations: InstanceType<typeof THREE.AnimationClip>[];
}
