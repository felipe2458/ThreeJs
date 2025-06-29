import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { OptionsReadyMadeComponent } from './component/options-ready-made/options-ready-made.component';
import { ReadyMadeObj } from 'src/app/interfaces/interface';
import { CommonModule } from '@angular/common';
import { FormsModule, NonNullableFormBuilder } from '@angular/forms'
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
      obj: (color = "#00e2b1", colors, size = 1) => {
        const boxGeo = new THREE.BoxGeometry(size, size, size);
        let boxMat: InstanceType<typeof THREE.MeshStandardMaterial> | InstanceType<typeof THREE.MeshStandardMaterial>[];

        if(colors){
          boxMat = [
            new THREE.MeshStandardMaterial({ color: colors[0] }),
            new THREE.MeshStandardMaterial({ color: colors[1] }),
            new THREE.MeshStandardMaterial({ color: colors[2] }),
            new THREE.MeshStandardMaterial({ color: colors[3] }),
            new THREE.MeshStandardMaterial({ color: colors[4] }),
            new THREE.MeshStandardMaterial({ color: colors[5] })
          ];
        }else{
          boxMat = new THREE.MeshStandardMaterial({ color: color });
        }

        return new THREE.Mesh(boxGeo, boxMat);
      }
    }
  ];

  get hasSelectedObject(): boolean{
    return this.objects.some(obj => obj.enterOptions);
  }

  @ViewChildren('object') objectRef!: QueryList<ElementRef>;

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

        window.addEventListener('resize', () => {
          this.objectRef.forEach((el)=>{
            const newWidth = el.nativeElement.offsetWidth;
            const newHeight = el.nativeElement.offsetHeight;

            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
          })
        });
      })
    })
  }
}
