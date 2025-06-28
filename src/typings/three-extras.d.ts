declare module 'three/examples/jsm/controls/PointerLockControls' {
  import type { Camera, Object3D } from 'three';
  import { EventDispatcher } from 'three';

  export class PointerLockControls extends EventDispatcher {
    constructor(object: InstanceType<typeof Camera>, domElement?: HTMLElement);
    domElement: HTMLElement;
    isLocked: boolean;
    connect(): void;
    disconnect(): void;
    dispose(): void;
    getObject(): InstanceType<typeof Object3D>;
    getDirection(): (v: any) => any;
    lock(): void;
    unlock(): void;
  }
}
