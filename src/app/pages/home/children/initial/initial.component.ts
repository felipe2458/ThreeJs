import { Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GLTFResult } from 'src/app/interfaces/interface';
@Component({
  selector: 'app-initial',
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.scss'],
})
export class InitialComponent {
  @ViewChild('container', { static: true }) container!: ElementRef;

  //* Arrumando erro de duplicação do gui
  private gui: dat.GUI | null = null;

  ngAfterViewInit(){
    //* Chamando a função requestAnimationFrame para que o código seja executado após a renderização(previne erros)
    requestAnimationFrame(() => {
      //* Pegando a largura e a altura do container
      const width = this.container.nativeElement.offsetWidth;
      const height = this.container.nativeElement.offsetHeight;

      //* Importando objeto 3D
      const object3D = new URL('assets/3D/Duck.glb', import.meta.url);

      //* Criando o renderizador
      const renderer = new THREE.WebGLRenderer();

      //* Definindo as sombras
      renderer.shadowMap.enabled = true;

      renderer.setSize(width, height);

      //* Adicionando o renderizador ao container
      this.container.nativeElement.appendChild(renderer.domElement);

      //* Criando o cenário
      const scene = new THREE.Scene();

      //* Criando a câmera
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

      //* Criando o controle de orbitação(permite o usuário mover a câmera)
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
      const boxMaterial = new THREE.MeshLambertMaterial({ color: 0x10aab3 });
      const box = new THREE.Mesh(boxGeometry, boxMaterial);
      scene.add(box);
      box.receiveShadow = true;
      //box.position.set(0, 2, 0);

      //* Criando e adicionando o plano ao cenário
      const planeGeometry = new THREE.PlaneGeometry(30, 30);
      //* Para o plano receber a sombra de outros elementos, é necessário mudar o material dele(não funciona com MeshBasicMaterial)
      const planeMaterial = new THREE.MeshStandardMaterial({
        color: 0x10676b,
        //* criando o "outro" lado do plano. Sem isso, quando você olha atrás do plano, não aparece a cor
        side: THREE.DoubleSide,
       });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      scene.add(plane)
      plane.rotation.x = -Math.PI / 2;
      //* Habilitando a sombra (recebida)
      plane.receiveShadow = true;

      //* Criando e adicionando uma grade ao cenário
      const gridHelper = new THREE.GridHelper(30); //* Pode-se passar um segundo argumento para definir a quantidade de divisões da grade
      scene.add(gridHelper);

      //* Criando e adicionando uma esfera ao cenário
      //* Pode-se passar 3 argumentos, o primeiro define o tamanho da esfera, o segundo define a quantidade de subdivisões horizontal(em outras palavras, a segunda definie o tanto de lados que a "esfera" vai ter na horizontal) e o terceiro define a quantidade de subdivisões vertical(em outras palavras, a terceira definie o tanto de lados que a "esfera" vai ter na vertival)
      const sphereGeometry = new THREE.SphereGeometry(3, 30, 40);
      //* Para a esfera ser alterada pela luz de ambiente, é necessário mudar o material dela(não funciona com MeshBasicMaterial)
      const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff62,
        //* Mostra a grade do elemento ao invés de pinta-la por completo (true)
        wireframe: false
       });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      scene.add(sphere);
      sphere.position.set(-10, 10, 0);
      //* Habilitando sombra (recebida e enviada)
      sphere.castShadow = true;

      //* Crindo uma segunda caixa com texture
      const textureLoader = new THREE.TextureLoader();
      const urlImagem = 'assets/images/Wood/Wood007_1K-JPG_Color.jpg';
      const urlNormal = 'assets/images/Wood/Wood007_1K-JPG_Roughness.jpg';

      //* Criando caixa com varias texturas
      const box2Material = [
        new THREE.MeshBasicMaterial({
          map: textureLoader.load(urlImagem)
        }),
        new THREE.MeshBasicMaterial({
          map: textureLoader.load(urlImagem)
        }),
        new THREE.MeshBasicMaterial({
          map: textureLoader.load(urlNormal)
        }),
        new THREE.MeshBasicMaterial({
          map: textureLoader.load(urlImagem)
        }),
        new THREE.MeshBasicMaterial({
          map: textureLoader.load(urlNormal)
        }),
        new THREE.MeshBasicMaterial({
          map: textureLoader.load(urlImagem)
        }),
      ]

      const boxGeometry2 = new THREE.BoxGeometry(4, 4, 4);
      /*const boxMaterial2 = new THREE.MeshBasicMaterial({
        color: 0x3b2b17,
        map: textureLoader.load('assets/images/Wood/Wood007_1K-JPG_Color.jpg')
       });*/
      const box2 = new THREE.Mesh(boxGeometry2, box2Material);
      scene.add(box2);
      box2.position.set(5, 5, 5);
      box2.receiveShadow = true;

      /*
      //* Adicionando uma luz de ambiente
      const ambientLight = new THREE.AmbientLight(0x333333);
      scene.add(ambientLight);
      */

      /*
      //* Adicionando uma luz direcional
      const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.6);
      scene.add(directionalLight);
      //* Posição da luz direcional
      directionalLight.position.set(-30, 50, 0);
      //* Habilitando sombra (enviada)
      directionalLight.castShadow = true;
      //* Alterando o tamanho da sombra
      directionalLight.shadow.camera.bottom = -12;

      //* Adicionando um ajudante pra a luz direcional
      const dLigthHelper = new THREE.DirectionalLightHelper(directionalLight);
      scene.add(dLigthHelper);

      //* Adicionando ajudando para a sombra
      const dlightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
      scene.add(dlightShadowHelper);
      */

      //* Adicionando uma luz holofote
      const spotLight = new THREE.SpotLight(0xFFFFFF);
      scene.add(spotLight);
      spotLight.position.set(-100, 350, 0);
      spotLight.castShadow = true;
      spotLight.angle = 0.05;

      //* Adicionando ajudante pra a luz holofote
      const sLightHelper = new THREE.SpotLightHelper(spotLight);
      scene.add(sLightHelper);

      //* Adicionando neblina
      //* 1 opção: Pode-se passar 3 argumentos, o primeiro define a cor da neblina, o segundo define a distancia minima onde a neblina começa a aparecer a partir da posição da câmera(terceiro argumento), o terceiro define a distancia onde onde a neblina atinge o seu máximo de intensidade
      //scene.fog = new THREE.Fog(0x000000, 0, 200);
      //* 2 opção: Pode-se passar 2 argumentos, o primeiro define a cor da neblina e o segundo controla a densidade da neblina de acordo com a distância da câmera
      scene.fog = new THREE.FogExp2(0x000000, 0.005);

      //* Mudando o background
      //* Cor solida
      renderer.setClearColor(0x5100ff);
      //* Imagem como background
      /*const textureLoader = new THREE.TextureLoader();
      scene.background = textureLoader.load('assets/images/bg-renderer.jpg');*/

      //* Adicionando a biblioteca de controle de animação
      this.gui = new dat.GUI()

      //* Adicionando objeto 3D ao cenário
      const assetsLoader = new GLTFLoader();
      assetsLoader.load(object3D.href, function(gltf: GLTFResult){
        const model = gltf.scene;
        scene.add(model);
        model.position.set(-12, 4, 10);
      }, undefined, function(err: any){
          console.error(err);
      })

      //* Adicionando o painel de controle
      const options = {
        sphereColor: "#00ff62",
        wireframe: false,
        speed: 0.01,
        angle: 0.2,
        penumbra: 0,
        intensity: 10000,
        axle: {  x: -100, y: 100, z: 0 },
      }

      /*gui.addColor(options, 'sphereColor').onChange(function(e){
        sphere.material.color.set(e)
      })*/

      this.gui.add(options, 'wireframe').onChange(function(e){
        sphere.material.wireframe = e
      })

      //* Fazendo a esfera "saltar"
      this.gui.add(options, 'speed', 0, 0.1)

      //* Opções de sombra
      this.gui.add(options, 'angle', 0, 1)
      this.gui.add(options, 'penumbra', 0, 1)
      this.gui.add(options, 'intensity', 0, 300000)
      this.gui.add(options.axle, 'x', -200, 200)
      this.gui.add(options.axle, 'y', -200, 200)
      this.gui.add(options.axle, 'z', -200, 200)

      let step = 0;

      //* Executando algo quando o usuário passa o mouse por cima do objeto
      /*const mousePosition = new THREE.Vector2();

      window.addEventListener('mousemove', function(e){
        mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
        mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
      })

      const rayCaster = new THREE.Raycaster();

      box2.name = 'box2';*/

      function animate(){
        //* Animação para a caixa ficar girando
        box.rotation.x += 0.01;
        box.rotation.y += 0.01;

        //* Fazendo o holofote girar
        options.axle.x += 0.1;
        options.axle.y += 0.1;
        spotLight.position.set(options.axle.x, options.axle.y, options.axle.z)
        sLightHelper.update()

        //* Fazendo a esfera saltar
        step += options.speed
        //* O primeiro valor é o quanto a esfera vai subir
        sphere.position.y = 10 * Math.abs(Math.sin(step))

        //* Opções de sombra
        spotLight.angle = options.angle
        spotLight.penumbra = options.penumbra
        spotLight.intensity = options.intensity
        sLightHelper.update()

        //* Opções de eixo do holofote
        spotLight.position.set(options.axle.x, options.axle.y, options.axle.z)
        sLightHelper.update()

        //* Executando algo quando o usuário passa o mouse por cima do objeto
        /*rayCaster.setFromCamera(mousePosition, camera);
        const intersects = rayCaster.intersectObjects(scene.children);


        for(let i = 0; i < intersects.length; i++){
          const obj = intersects[i].object;
          if(obj instanceof THREE.Mesh){
            const mat = obj.material;
            if(Array.isArray(mat)){
              mat.forEach(m => {
                if(m instanceof THREE.MeshStandardMaterial || m instanceof THREE.MeshBasicMaterial || m instanceof THREE.MeshLambertMaterial){
                  m.color.set(0xff0000);
                }
              });
            }else{
              if(mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshBasicMaterial || mat instanceof THREE.MeshLambertMaterial){
                mat.color.set(0x00b6f3);
              }
            }
          }

          if(obj.name === 'box2'){
            obj.rotation.x += 0.01;
            obj.rotation.y += 0.01;
          }
        }*/

        renderer.render(scene, camera);
      }

      //* Chamando a animação no renderer
      renderer.setAnimationLoop(animate);

      //* Mudando o tamanho da tela quando o usuário redimensionar a janela
      window.addEventListener('resize', ()=>{
        const width = this.container.nativeElement.offsetWidth;
        const height = this.container.nativeElement.offsetHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      })
    });
  }

  //* Arrumando erro de duplicação do gui
  ngOnDestroy(){
    if(this.gui){
      this.gui.destroy();
      this.gui = null;
    }

    const guiDom = document.querySelector('#dat-gui');
    if(guiDom) guiDom.remove();
  }
}
