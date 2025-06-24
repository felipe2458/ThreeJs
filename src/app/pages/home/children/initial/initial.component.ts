import { Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
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
      camera.position.set(-10, 30, 30);
      orbit.update();

      //* Criando e adicionando a caixa ao cenário
      const boxGeometry = new THREE.BoxGeometry();
      const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x10aab3 });
      const box = new THREE.Mesh(boxGeometry, boxMaterial);
      scene.add(box);

      //* Criando e adicionando o plano ao cenário
      const planeGeometry = new THREE.PlaneGeometry(30, 30);
      const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0x10676b,
        //* criando o "outro" lado do plano. Sem isso, quando você olha atrás do plano, não aparece a cor
        side: THREE.DoubleSide,
       });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      scene.add(plane)
      plane.rotation.x = -Math.PI / 2;

      //* Criando e adicionando uma grade ao cenário
      const gridHelper = new THREE.GridHelper(30); //* Pode-se passar um segundo argumento para definir a quantidade de divisões da grade
      scene.add(gridHelper);

      //* Criando e adicionando uma esfera ao cenário

      //* Pode-se passar 3 argumentos, o primeiro define o tamanho da esfera, o segundo define a quantidade de subdivisões horizontal(em outras palavras, a segunda definie o tanto de lados que a "esfera" vai ter na horizontal) e o terceiro define a quantidade de subdivisões vertical(em outras palavras, a terceira definie o tanto de lados que a "esfera" vai ter na vertival)
      const sphereGeometry = new THREE.SphereGeometry(3, 30, 40);
      const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff62,
        //* Mostra a grade do elemento ao invés de pinta-la por completo (true)
        wireframe: false
       });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      scene.add(sphere);

      sphere.position.set(-10, 10, 0);

      //* Adicionando a biblioteca de controle de animação
      const gui = new dat.GUI()

      //* Adicionando o painel de controle
      const options = {
        sphereColor: "#00ff62",
        wireframe: false,
        speed: 0.01
      }

      gui.addColor(options, 'sphereColor').onChange(function(e){
        sphere.material.color.set(e)
      })

      gui.add(options, 'wireframe').onChange(function(e){
        sphere.material.wireframe = e
      })

      //* Fazendo a esfera "saltar"
      gui.add(options, 'speed', 0, 0.1)

      let step = 0;

      //* Animação para a caixa ficar girando
      function animate(){
        box.rotation.x += 0.01;
        box.rotation.y += 0.01;

        step += options.speed
        sphere.position.y = 10 * Math.abs(Math.sin(step))

        renderer.render(scene, camera);
      }

      //* Chamando a animação no renderer
      renderer.setAnimationLoop(animate);
    });
  }
}
