import { Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-initial',
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.scss'],
})
export class InitialComponent {
  @ViewChild('container', { static: true }) container!: ElementRef;

  ngAfterViewInit(){
    //* Chamando a função requestAnimationFrame para que o código seja executado após a renderização(previne erros)
    requestAnimationFrame(() => {
      //* Pegando a largura e a altura do container
      const width = this.container.nativeElement.offsetWidth;
      const height = this.container.nativeElement.offsetHeight;

      //* Criando o renderizador
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(width, height);

      //* Adicionando o renderizador ao container
      this.container.nativeElement.appendChild(renderer.domElement);

      //* Criando o cenário
      const scene = new THREE.Scene();

      //* Criando a câmera
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

      //* Criando o controle de orbitação
      const orbit = new OrbitControls(camera, renderer.domElement);

      //* Auxiliar para ver os eixos: x, y, z
      const axeHelper = new THREE.AxesHelper(3);
      scene.add(axeHelper);

      //* Posição e rotação da câmera
      camera.lookAt(0, 0, 0);
      camera.position.set(0, 1, 5);
      orbit.update();

      //* Criando e adicionando a caixa ao cenário
      const boxGeometry = new THREE.BoxGeometry();
      const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x10aab3 });
      const box = new THREE.Mesh(boxGeometry, boxMaterial);
      scene.add(box);

      //* Animação para a caixa ficar girando
      function animate(){
        box.rotation.x += 0.01;
        box.rotation.y += 0.01;
        renderer.render(scene, camera);
      }

      //* Chamando a animação no renderer
      renderer.setAnimationLoop(animate);
    });
  }
}
