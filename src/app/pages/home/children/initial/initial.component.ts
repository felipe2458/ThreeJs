import { Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-initial',
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.scss'],
})
export class InitialComponent{
  @ViewChild('container') container!: ElementRef;

  ngAfterViewInit(){
    const renderer = new THREE.WebGLRenderer()

    renderer.setSize(this.container.nativeElement.offsetWidth, this.container.nativeElement.offsetHeight)

    this.container.nativeElement.appendChild(renderer.domElement)
  }
}
