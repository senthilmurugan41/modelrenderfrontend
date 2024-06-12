import { Component } from '@angular/core';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'modelRenderer';
  flag = true;



  pleaseRender()
  {
    const fileUrl = new URL('../assets/handModel.glb', import.meta.url);

const renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// renderer.setClearColor(0xA3A3A3);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(10, 10, 10);
orbit.update();

// const grid = new THREE.GridHelper(30, 30);
// scene.add(grid);

const ambientLight = new THREE.AmbientLight(0xededed, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
scene.add(directionalLight);
directionalLight.position.set(10, 11, 7);

const gui = new dat.GUI();

const options = {
    'Main': 0x2F3130,
    'Main light': 0x7C7C7C,
    'Main dark': 0x0A0A0A,
    'Hooves': 0x0F0B0D,
    'Hair': 0x0A0A0A,
    'Muzzle': 0x0B0804,
    'Eye dark': 0x020202,
    'Eye white': 0xBEBEBE
}

const assetLoader = new GLTFLoader();

assetLoader.load('../assets/handModel.glb', function(gltf) {
    const model = gltf.scene;
    scene.add(model);
    scene.add(model.getObjectByName('Biceps')!);
    scene.add(model.getObjectByName('Scapula')!);
    scene.add(model.getObjectByName('Radius')!);
    scene.add(model.getObjectByName('Humerus')!);
    model.visible=false;
    var boundingBox = new THREE.Box3().setFromObject(model);

    // Calculate the center of the bounding box
    var center = new THREE.Vector3();
    boundingBox.getCenter(center);

    // Calculate the size of the bounding box
    var size = new THREE.Vector3();
    boundingBox.getSize(size);

    // Determine the distance to move the camera back based on the size of the bounding box
    var distance = Math.max(size.x, size.y, size.z) * 2;

    // Set the camera position and look at the center of the bounding box
    camera.position.copy(center.clone().add(new THREE.Vector3(0, 0, distance)));
    camera.lookAt(center);

    // Optionally, you may want to update the camera's near and far clipping planes
    camera.near = distance / 100;
    camera.far = distance * 100;
    camera.updateProjectionMatrix();
    });

    function animate() {
      renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animate);
    window.addEventListener('resize', function() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
    this.flag = false;
  }
}
