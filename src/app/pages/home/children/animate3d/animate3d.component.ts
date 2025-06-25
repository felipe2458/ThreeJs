import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { GLTFResult } from 'src/app/interfaces/interface';
import * as THREE from 'three';

@Component({
  selector: 'app-animate3d',
  templateUrl: './animate3d.component.html',
  styleUrls: ['./animate3d.component.scss'],
})
export class Animate3dComponent{
  @ViewChild('container') private containerEl!: ElementRef;

  ngAfterViewInit(){
    requestAnimationFrame(()=>{
      const width = this.containerEl.nativeElement.offsetWidth;
      const height = this.containerEl.nativeElement.offsetHeight;

      const object3D = new URL('assets/3D/cabinet/cabinet.glb', import.meta.url);

      const renderer = new THREE.WebGLRenderer();

      renderer.setSize(width, height);

      this.containerEl.nativeElement.appendChild(renderer.domElement);

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

      const orbit = new OrbitControls(camera, renderer.domElement);

      camera.lookAt(0, 0, 0);
      camera.position.set(-30, 30, 30);
      orbit.update();

      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(30, 30),
        new THREE.MeshStandardMaterial({
          color: 0x10676b,
          side: THREE.DoubleSide,
        })
      );
      scene.add(plane);
      plane.rotation.x = -Math.PI / 2;

      const gridHelper = new THREE.GridHelper(30);
      scene.add(gridHelper);

      const assetsLoader = new GLTFLoader();

      //* Carregando animação
      let mixer: InstanceType<typeof THREE.AnimationMixer>;
      assetsLoader.load(object3D.href, function(gltf: GLTFResult){
          const model = gltf.scene;
          scene.add(model);

          mixer = new THREE.AnimationMixer(model);
          //* Pegando a(s) animação(ões) do modelo
          const clips = gltf.animations;
          //* Ativando apenas uma animação
          /*const clip = THREE.AnimationClip.findByName(clips, 'Door01_low__0Action');

          if(clip){
            const action = mixer.clipAction(clip);
            action.play();
          }*/

          //* Ativando todas as animações
          clips.forEach(clip => {
            const action = mixer.clipAction(clip);
            action.play();
          });

        }, undefined, function(err: any){
          console.error(err);
      })

      const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
      scene.add(directionalLight);
      directionalLight.position.set(-30, 50, 0);
      directionalLight.castShadow = true;
      directionalLight.shadow.camera.bottom = -12;

      renderer.setClearColor(0x5100ff);

      const clock = new THREE.Clock();
      function animate(){
        mixer?.update(clock.getDelta());
        renderer.render(scene, camera);
      }

      renderer.setAnimationLoop(animate);

      window.addEventListener('resize', ()=>{
        const width = this.containerEl.nativeElement.offsetWidth;
        const height = this.containerEl.nativeElement.offsetHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      })
    });
  }
}
