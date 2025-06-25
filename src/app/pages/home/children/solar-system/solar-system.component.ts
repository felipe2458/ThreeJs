import { Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CelestialBodyTextures } from 'src/app/interfaces/interface';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-solar-system',
  templateUrl: './solar-system.component.html',
  styleUrls: ['./solar-system.component.scss'],
})
export class SolarSystemComponent{
  @ViewChild('container') private containerElement!: ElementRef;

  constructor(){}

  ngAfterViewInit(){
    setTimeout(()=>{
      const texturas: CelestialBodyTextures = {
        mercury: 'assets/images/solar-system/mercury.jpg',
        venus: 'assets/images/solar-system/venus.jpg',
        earth: 'assets/images/solar-system/earth.jpg',
        mars: 'assets/images/solar-system/mars.jpg',
        jupiter: 'assets/images/solar-system/jupiter.jpg',
        saturn: {
          texture: 'assets/images/solar-system/saturn.jpg',
          rings: 'assets/images/solar-system/saturn-ring.png',
        },
        uranus: {
          texture: 'assets/images/solar-system/uranus.jpg',
          rings: 'assets/images/solar-system/uranus-ring.png',
        },
        neptune: 'assets/images/solar-system/neptunejpg',
        pluto: 'assets/images/solar-system/pluto.jpg',
        sun: 'assets/images/solar-system/sun.jpg',
        moon: 'assets/images/solar-system/2k_moon.jpg',
      }

      const stars: string[] = [
        'assets/images/solar-system/stars.jpg',
        'assets/images/solar-system/stars.jpg',
        'assets/images/solar-system/stars.jpg',
        'assets/images/solar-system/stars.jpg',
        'assets/images/solar-system/stars.jpg',
        'assets/images/solar-system/stars.jpg',
      ];

      const renderer = new THREE.WebGLRenderer();

      const width = this.containerElement.nativeElement.offsetWidth;
      const height = this.containerElement.nativeElement.offsetHeight;

      renderer.setSize(width, height);

      this.containerElement.nativeElement.appendChild(renderer.domElement);

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

      const orbit = new OrbitControls(camera, renderer.domElement);

      camera.lookAt(0, 0, 0);
      camera.position.set(-300, 30, 30);
      orbit.update();

      const CubeTextureloader = new THREE.CubeTextureLoader();
      const skybox = CubeTextureloader.load(stars);
      scene.background = skybox;

      const textureLoader = new THREE.TextureLoader();

      const sunGeo = new THREE.SphereGeometry(16, 30, 30);
      const sunMat = new THREE.MeshBasicMaterial({
        map: textureLoader.load(texturas.sun)
       });
      const sun = new THREE.Mesh(sunGeo, sunMat);
      scene.add(sun);

      function createPlanet(
        size: number,
        texture: string,
        distance: number,
        ring: {
          innerRadius: number,
          outerRadius: number,
          texture: string
        } | null
      ){
        const geo = new THREE.SphereGeometry(size, 30, 30);
        const mat = new THREE.MeshStandardMaterial({
          map: textureLoader.load(texture)
        });

        const mesh = new THREE.Mesh(geo, mat);
        const pivot = new THREE.Object3D();

        mesh.position.x = distance;
        pivot.add(mesh);

        if(ring){
          const ringGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32);
          const ringMat = new THREE.MeshStandardMaterial({
            map: textureLoader.load(ring.texture),
            side: THREE.DoubleSide
          });

          const ringMesh = new THREE.Mesh(ringGeo, ringMat);

          ringMesh.position.set(distance, 0, 0);
          ringMesh.rotation.x = Math.PI / 2.2;
          pivot.add(ringMesh);
        }

        scene.add(pivot);

        return { mesh, pivot };
      }

      const mercury = createPlanet(3.2, texturas.mercury, 30, null);
      const venus = createPlanet(5.8, texturas.venus, 44, null);
      const earth = createPlanet(6, texturas.earth, 62, null);
      const mars = createPlanet(4, texturas.mars, 78, null);
      const jupiter = createPlanet(12, texturas.jupiter, 100, null);
      const saturn = createPlanet(10, texturas.saturn.texture, 138, {
         innerRadius: 10,
         outerRadius: 20,
         texture: texturas.saturn.rings
      });
      const uranus = createPlanet(8, texturas.uranus.texture, 180, {
         innerRadius: 7,
         outerRadius: 12,
         texture: texturas.uranus.rings
      });
      const neptune = createPlanet(7, texturas.neptune, 200, null);
      const pluto = createPlanet(2.8, texturas.pluto, 216, null);

      const ambientLight = new THREE.AmbientLight(0x282828);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 5000, 1000);
      scene.add(pointLight);

      const lightHelper = new THREE.PointLightHelper(pointLight);
      scene.add(lightHelper);

      function animate(){
        sun.rotateY(0.004)

        mercury.mesh.rotateY(0.004);
        venus.mesh.rotateY(0.002);
        earth.mesh.rotateY(0.02);
        mars.mesh.rotateY(0.018);
        jupiter.mesh.rotateY(0.04);
        saturn.mesh.rotateY(0.038);
        uranus.mesh.rotateY(0.03);
        neptune.mesh.rotateY(0.032);
        pluto.mesh.rotateY(0.008);

        mercury.pivot.rotateY(0.04);
        venus.pivot.rotateY(0.015);
        earth.pivot.rotateY(0.01);
        mars.pivot.rotateY(0.008);
        jupiter.pivot.rotateY(0.002);
        saturn.pivot.rotateY(0.0009);
        uranus.pivot.rotateY(0.0001);
        neptune.pivot.rotateY(0.0009);
        pluto.pivot.rotateY(0.00007);

        renderer.render(scene, camera);
      }

      renderer.setAnimationLoop(animate);

      window.addEventListener('resize', ()=>{
        const width = this.containerElement.nativeElement.offsetWidth;
        const height = this.containerElement.nativeElement.offsetHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      })
    }, 0)
  }

  ngOnDestroy(){}
}
