import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import * as CANNON from 'cannon-es'

@Component({
  selector: 'app-physics',
  templateUrl: './physics.component.html',
  styleUrls: ['./physics.component.scss'],
})
export class PhysicsComponent{
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

      camera.position.set(100, 100, 100);
      controls.update();

      const boxGeo = new THREE.BoxGeometry(5, 5, 5);
      const boxMat = new THREE.MeshBasicMaterial({ color: 0xc300ff, wireframe: true });
      const boxMesh = new THREE.Mesh(boxGeo, boxMat);
      scene.add(boxMesh);

      const sphereGeo = new THREE.SphereGeometry(5);
      const sphereMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      scene.add(sphereMesh);

      const plane = new THREE.PlaneGeometry(100, 100);
      const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x006c86, side: THREE.DoubleSide, wireframe: true });
      const planeMesh = new THREE.Mesh(plane, planeMaterial);
      scene.add(planeMesh);

      //* Criando a física com Cannon.js
      const world = new CANNON.World({
        gravity: new CANNON.Vec3(0, -9.82, 0),
      })

      const timeStep = 1 / 60;

      const planePhysMat = new CANNON.Material();

      const planeBody = new CANNON.Body({
        //shape: new CANNON.Plane(),
        //* Usando uma caixa para representar o plano. Assim qunado um objeto passar pela borda do plano, ela cairá
        shape: new CANNON.Box(new CANNON.Vec3(50, 50, 0.1)),
        type: CANNON.Body.STATIC,
        material: planePhysMat
      })
      world.addBody(planeBody);
      planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

      const boxPhysMat = new CANNON.Material();

      const boxBody = new CANNON.Body({
        shape: new CANNON.Box(new CANNON.Vec3(2.5, 2.5, 2.5)),
        position: new CANNON.Vec3(1, 20, 0),
        mass: 20,
        material: boxPhysMat
      });
      world.addBody(boxBody);

      boxBody.linearDamping = 0.31;

      boxBody.angularVelocity.set(0, 100, 0); //* Definindo a velocidade de rotação
      boxBody.angularDamping = 0.5; //* Definindo a resistência à rotação(tipo um freio, em outras palavras, a resistência do ar)

      //* Mudando o contato entre um objeto e outro
      const planeBoxContactMaterial = new CANNON.ContactMaterial(
        planePhysMat,
        boxPhysMat,
        { friction: 0.04 }
      );

      world.addContactMaterial(planeBoxContactMaterial);

      const spherePhysMat = new CANNON.Material();

      const sphereBody = new CANNON.Body({
        shape: new CANNON.Sphere(5),
        position: new CANNON.Vec3(10, 50, 0),
        mass: 50,
        material: spherePhysMat
      });
      world.addBody(sphereBody);

      sphereBody.angularVelocity.set(0, 0, 10);

      sphereBody.linearDamping = 0.31; //* Definindo a resistência à movimentação linear

      const planeSphereContactMaterial = new CANNON.ContactMaterial(
        spherePhysMat,
        planePhysMat,
        { restitution: 0.9, friction: 0.5 }
      );

      world.addContactMaterial(planeSphereContactMaterial);

      function animate(){
        world.step(timeStep);

        planeMesh.position.copy(planeBody.position);
        planeMesh.quaternion.copy(planeBody.quaternion);

        boxMesh.position.copy(boxBody.position);
        boxMesh.quaternion.copy(boxBody.quaternion);

        sphereMesh.position.copy(sphereBody.position);
        sphereMesh.quaternion.copy(sphereBody.quaternion);

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
    })
  }
}
