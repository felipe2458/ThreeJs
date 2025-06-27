import { Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es';
import { FormsModule } from '@angular/forms';
import { ReadyMadeObjectsComponent } from './components/ready-made-objects/ready-made-objects.component';
import { ImportsObjectsComponent } from './components/imports-objects/imports-objects.component';

@Component({
  selector: 'app-free-mode',
  standalone: true,
  imports: [FormsModule, ReadyMadeObjectsComponent, ImportsObjectsComponent],
  templateUrl: './free-mode.component.html',
  styleUrls: ['./free-mode.component.scss'],
})
export class FreeModeComponent{
  @ViewChild('container') containerEl!: ElementRef;

  firstInputActive: boolean = true;

  ngAfterViewInit(){
    requestAnimationFrame(()=>{
        const width = this.containerEl.nativeElement.offsetWidth;
        const height = this.containerEl.nativeElement.offsetHeight;

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        this.containerEl.nativeElement.appendChild(renderer.domElement);

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

        const controls = new OrbitControls(camera, renderer.domElement);

        camera.lookAt(0, 0, 0);
        camera.position.set(10, 5, 10);
        controls.update();

        const planeGeo = new THREE.PlaneGeometry(200, 200);
        const planeMat = new THREE.MeshBasicMaterial({ color: 0x004a63, side: THREE.DoubleSide});
        const plane = new THREE.Mesh(planeGeo, planeMat);
        plane.rotation.x = -Math.PI / 2;
        scene.add(plane);

        const grid = new THREE.GridHelper(200, 200, 0x9e9e9e, 0x9e9e9e);
        scene.add(grid);

        const world = new CANNON.World({
          gravity: new CANNON.Vec3(0, -9.82, 0),
        })

        const timeStep = 1 / 60;

        const planePhysMat = new CANNON.Material();
        const planeBody = new CANNON.Body({
          shape: new CANNON.Box(new CANNON.Vec3(100, 0.1, 100)),
          type: CANNON.Body.STATIC,
          material: planePhysMat
        });
        planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        world.addBody(planeBody);

        renderer.setClearColor(0x4b4b4b, 1);

        function animate(){
          world.step(timeStep);

          plane.position.copy(planeBody.position);
          plane.quaternion.copy(planeBody.quaternion);

          renderer.render(scene, camera);
        }

        renderer.setAnimationLoop(animate);

        window.addEventListener('resize', () => {
          const newWidth = this.containerEl.nativeElement.offsetWidth;
          const newHeight = this.containerEl.nativeElement.offsetHeight;

          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        });
    });
  }
}
