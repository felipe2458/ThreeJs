import { Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-initial',
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.scss'],
})
export class InitialComponent{
  @ViewChild('container') containerEl!: ElementRef;

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
      camera.position.set(-10, 30, 30);
      controls.update();

      const axeHelper = new THREE.AxesHelper(5);
      scene.add(axeHelper);

      const mouse = new THREE.Vector2();
      const intersectionPoint = new THREE.Vector3();
      const planeNormal = new THREE.Vector3();
      const plane = new THREE.Plane();
      const raycaster = new THREE.Raycaster();

      window.addEventListener('mousemove', (e)=>{
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        planeNormal.copy(camera.position).normalize();
        plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
        raycaster.setFromCamera(mouse, camera);
        raycaster.ray.intersectPlane(plane, intersectionPoint);
      });

      window.addEventListener('click', ()=>{
        const sphereGeo = new THREE.SphereGeometry(0.125, 30, 30);
        const sphereMat = new THREE.MeshStandardMaterial({ color: 0x00ff95 });
        const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
        scene.add(sphereMesh);
        sphereMesh.position.copy(intersectionPoint);
      });

      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(10, 10, 10);
      scene.add(light);

      const ambientLight = new THREE.AmbientLight(0x404040, 1);
      scene.add(ambientLight);

      function animate(){
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
