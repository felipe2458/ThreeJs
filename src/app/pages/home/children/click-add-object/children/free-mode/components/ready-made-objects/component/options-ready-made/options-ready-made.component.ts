import { Component, ElementRef, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ObjRotation, ReadyMadeObj } from 'src/app/interfaces/interface';
import { FormsModule } from '@angular/forms';
import * as THREE from 'three';

@Component({
  selector: 'app-options-ready-made',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './options-ready-made.component.html',
  styleUrls: ['./options-ready-made.component.scss'],
})
export class OptionsReadyMadeComponent{
  @Input() obj!: ReadyMadeObj;

  @ViewChild('object') objEl!: ElementRef;

  objRotation: ObjRotation[] = [
    {
      name: 'X',
      velocity: 'normal',
      active: true,
      rotationInWorld: false
    },
    {
      name: 'Y',
      velocity: 'normal',
      active: true,
      rotationInWorld: false
    },
    {
      name: 'Z',
      velocity: 'normal',
      active: false,
      rotationInWorld: false
    }
  ]

  ngAfterViewInit(){
    requestAnimationFrame(()=>{
      const width = this.objEl.nativeElement.offsetWidth;
      const height = this.objEl.nativeElement.offsetHeight;

      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(width, height);

      this.objEl.nativeElement.appendChild(renderer.domElement);

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(0, 0, 2);

      const mesh = this.obj.obj();
      mesh.position.set(0, 0, 0);
      scene.add(mesh);

      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(0, 0, 1);
      scene.add(light);

      const ambientLight = new THREE.AmbientLight(0x363636, 0.1);
      scene.add(ambientLight);

      renderer.setClearColor(0x000000, 0);

      function animate(){
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;

        renderer.render(scene, camera);
      }

      renderer.setAnimationLoop(animate);
    })
  }
}
