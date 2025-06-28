import { ColorComplexSelectedSide } from './../../../../../../../../../../interfaces/interface';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ColorSelect, ObjRotation, ObjRotationVelocity, ReadyMadeObj } from 'src/app/interfaces/interface';
import { FormsModule } from '@angular/forms';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-options-ready-made',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './options-ready-made.component.html',
  styleUrls: ['./options-ready-made.component.scss'],
})
export class OptionsReadyMadeComponent implements OnInit{
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

  objColor!: string;
  colorSelect!: ColorSelect[];
  colorSelected: 'simple-color' | 'complex-color' = 'simple-color';

  ngOnInit(){
    this.objColor = '#' + this.obj.obj().material.color.getHexString();

    this.colorSelect = [
      { name: 'simple-color', color: this.objColor },
      { name: 'complex-color', colors: [this.objColor, this.objColor, this.objColor, this.objColor, this.objColor, this.objColor] }
    ]
  }

  colorComplexSelectedSide: ColorComplexSelectedSide = 'front';

  get selectedColorComplex(): string | undefined{
    const index = this.getIndexColorComplexSelect(this.colorComplexSelectedSide);
    return this.colorSelect[1].colors?.[index];
  }

  set selectedColorComplex(val: string){
    const index = this.getIndexColorComplexSelect(this.colorComplexSelectedSide);
    if(this.colorSelect[1].colors) {
      this.colorSelect[1].colors[index] = val;
    }
  }

  getIndexColorComplexSelect(side: string): number{
    switch(side){
      case 'right': return 0;
      case 'left': return 1;
      case 'top': return 2;
      case 'bottom': return 3;
      case 'front': return 4;
      case 'back': return 5;
      default: throw new Error(`Lado inválido: ${side}`);
    }
  }

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

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false;
      controls.enablePan = false;

      const mesh = this.obj.obj();
      mesh.position.set(0, 0, 0);
      scene.add(mesh);

      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(0, 0, 1);
      scene.add(light);

      const ambientLight = new THREE.AmbientLight(0xafafaf, 0.5);
      scene.add(ambientLight);

      renderer.setClearColor(0x000000, 0);

      const animate = ()=>{
        const objRot = this.objRotation;

        const velocityRotation: ObjRotationVelocity = {
          x: objRot[0].velocity === 'slow' ? 0.002 : objRot[0].velocity === 'normal' ? 0.01 : 0.05,
          y: objRot[1].velocity === 'slow' ? 0.002 : objRot[1].velocity === 'normal' ? 0.01 : 0.05,
          z: objRot[2].velocity === 'slow' ? 0.002 : objRot[2].velocity === 'normal' ? 0.01 : 0.05
        }

        if(this.objRotation[0].active){
          mesh.rotation.x += velocityRotation.x;
        }else{
          mesh.rotation.x = 0;
        };

        if(this.objRotation[1].active){
          mesh.rotation.y += velocityRotation.y;
        }else{
          mesh.rotation.y = 0;
        };

        if(this.objRotation[2].active){
          mesh.rotation.z += velocityRotation.z;
        }else{
          mesh.rotation.z = 0;
        };

        renderer.render(scene, camera);
      }

      renderer.setAnimationLoop(animate);
    })
  }
}
