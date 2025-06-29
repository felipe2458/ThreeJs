import { ColorComplexSelectedSide, ObjTexture } from './../../../../../../../../../../interfaces/interface';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ColorSelect, ObjRotation, ObjRotationVelocity, ReadyMadeObj } from 'src/app/interfaces/interface';
import { FormsModule } from '@angular/forms';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-options-ready-made',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule],
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

  expandsOptions = {
    rotation: true,
    color_and_texture: {
      all: true,
      color: true,
      texture: true
    }
  }

  objColor!: string;
  colorSelect!: ColorSelect[];
  colorSelected: string = 'simple-color';

  objTexture: ObjTexture[] = [
    { name: 'simple-texture', texture: undefined },
    { name: 'complex-texture', textures: ['', '', '', '', '', ''] }
  ]

  textureSel: string = 'simple-texture';

  renderer: InstanceType<typeof THREE.WebGLthis.Renderer>;
  scene: InstanceType<typeof THREE.Scene>;
  camera: InstanceType<typeof THREE.PerspectiveCamera>;
  mesh: InstanceType<typeof THREE.Mesh>;

  ngOnInit(){
    this.objColor = '#' + this.obj.obj().material.color.getHexString();

    this.colorSelect = [
      { name: 'simple-color', color: this.objColor },
      { name: 'complex-color', colors: [this.objColor, this.objColor, this.objColor, this.objColor, this.objColor, this.objColor] }
    ]
  }

  colorComplexSelectedSide: ColorComplexSelectedSide = 'front';
  textureComplexSelectedSide: ColorComplexSelectedSide = 'front';

  get selectedColorComplex(): string | undefined{
    const index = this.getIndexComplexSelect(this.colorComplexSelectedSide);
    return this.colorSelect[1].colors?.[index];
  }

  set selectedColorComplex(val: string){
    const index = this.getIndexComplexSelect(this.colorComplexSelectedSide);
    if(this.colorSelect[1].colors) {
      this.colorSelect[1].colors[index] = val;
    }
  }

  get selectedTextureComplex(): string | undefined{
    const index = this.getIndexComplexSelect(this.textureComplexSelectedSide);
    return this.objTexture[1].textures?.[index];
  }

  set selectedTextureComplex(val: string){
    const index = this.getIndexComplexSelect(this.textureComplexSelectedSide);
    if(this.objTexture[1].textures){
      this.objTexture[1].textures[index] = val;
    }
  }

  objColorsToHex!: number[];
  objColorToHex!: number;

  updateMeshColor(colorSel: string){
    let rotationMesh = this.mesh.rotation;

    this.scene.remove(this.mesh);

    if(colorSel === 'simple-color'){
      this.mesh = this.obj.obj(this.colorSelect[0].color);
    }else{
      this.mesh = this.obj.obj(undefined, this.colorSelect[1].colors);
    }

    this.mesh.rotation.set(rotationMesh.x, rotationMesh.y, rotationMesh.z);
    this.mesh.position.set(0, 0, 0);
    this.scene.add(this.mesh);
  }

  updateTexture(e: Event, Obj: ObjTexture){
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];

    if(file && file.type.startsWith('image/')){
      if(Obj.name === 'simple-texture'){
        Obj.texture = URL.createObjectURL(file);
      }else{
        const index = this.getIndexComplexSelect(this.textureComplexSelectedSide);
        if(Obj.textures){
          Obj.textures[index] = URL.createObjectURL(file);
        }
      }
    }
  }

  getIndexComplexSelect(side: string): number{
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

      this.renderer = new THREE.WebGLRenderer({ alpha: true });
      this.renderer.setSize(width, height);

      this.objEl.nativeElement.appendChild(this.renderer.domElement);

      this.scene = new THREE.Scene();

      this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      this.camera.position.set(0, 0, 2);

      const controls = new OrbitControls(this.camera, this.renderer.domElement);
      controls.enableZoom = false;
      controls.enablePan = false;

      this.mesh = this.obj.obj();
      this.mesh.position.set(0, 0, 0);
      this.scene.add(this.mesh);

      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(0, 0, 1);
      this.scene.add(light);

      const ambientLight = new THREE.AmbientLight(0xafafaf, 0.5);
      this.scene.add(ambientLight);

      this.renderer.setClearColor(0x000000, 0);

      const animate = ()=>{
        const objRot = this.objRotation;

        const velocityRotation: ObjRotationVelocity = {
          x: objRot[0].velocity === 'slow' ? 0.002 : objRot[0].velocity === 'normal' ? 0.01 : 0.05,
          y: objRot[1].velocity === 'slow' ? 0.002 : objRot[1].velocity === 'normal' ? 0.01 : 0.05,
          z: objRot[2].velocity === 'slow' ? 0.002 : objRot[2].velocity === 'normal' ? 0.01 : 0.05
        }

        if(this.objRotation[0].active){
          this.mesh.rotation.x += velocityRotation.x;
        }else{
          this.mesh.rotation.x = 0;
        };

        if(this.objRotation[1].active){
          this.mesh.rotation.y += velocityRotation.y;
        }else{
          this.mesh.rotation.y = 0;
        };

        if(this.objRotation[2].active){
          this.mesh.rotation.z += velocityRotation.z;
        }else{
          this.mesh.rotation.z = 0;
        };

        this.renderer.render(this.scene, this.camera);
      }

      this.renderer.setAnimationLoop(animate);

      window.addEventListener('resize', () => {
      const newWidth = this.objEl.nativeElement.offsetWidth;
      const newHeight = this.objEl.nativeElement.offsetHeight;

        this.camera.aspect = newWidth / newHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(newWidth, newHeight);
      });
    })
  }
}
