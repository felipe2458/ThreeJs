import { Component, ElementRef, ViewChildren } from '@angular/core';
import { OptionsReadyMadeComponent } from './component/options-ready-made/options-ready-made.component';
import { ReadyMadeObj } from 'src/app/interfaces/interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import * as THREE from 'three';

@Component({
  selector: 'app-ready-made-objects',
  standalone: true,
  imports: [CommonModule, FormsModule, OptionsReadyMadeComponent],
  templateUrl: './ready-made-objects.component.html',
  styleUrls: ['./ready-made-objects.component.scss'],
})
export class ReadyMadeObjectsComponent{
  objects: ReadyMadeObj[] = [
    {
      name: 'simple box',
      selected: false,
      enterOptions: false,
      obj: () => {
        const boxGeo = new THREE.BoxGeometry(1, 1, 1);
        const boxMat = new THREE.MeshStandardMaterial({ color: 0x00ff22, side: THREE.DoubleSide });
        return new THREE.Mesh(boxGeo, boxMat);
      }
    }
  ];

  get hasSelectedObject(): boolean{
    return this.objects.some(obj => obj.enterOptions);
  }

  @ViewChildren('object') objectRef!: ElementRef[] | undefined;

  ngAfterViewInit(){
    requestAnimationFrame(()=>{
      this.objectRef?.forEach((el, index)=>{
        const obj = this.objects[index];

        el.nativeElement.addEventListener('click', ()=>{
          this.objects.forEach((o)=>{
            o.selected = false;
          })

          obj.selected = true;
        })

        const width = el.nativeElement.offsetWidth;
        const height = el.nativeElement.offsetHeight;

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        el.nativeElement.appendChild(renderer.domElement);

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

        camera.lookAt(0, 0, 0);
        camera.position.set(0, 0, 2);

        const objMesh = obj.obj();
        scene.add(objMesh);

        const ambientLight = new THREE.AmbientLight(0x696969, 0.1);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 0, 1);
        scene.add(directionalLight);

        renderer.setClearColor(0x555555, 1);

        const animate = () =>{
          objMesh.rotation.x += 0.01;
          objMesh.rotation.y += 0.01;
          objMesh.rotation.z += 0.01;

          renderer.render(scene, camera);
        }

        renderer.setAnimationLoop(animate);
      })
    })
  }
}
