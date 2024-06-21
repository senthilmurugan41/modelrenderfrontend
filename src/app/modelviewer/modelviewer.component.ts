import { Component, Input } from '@angular/core';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ObjectModel } from '../model/object-model';
import { ActivatedRoute, Router } from '@angular/router';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

@Component({
  selector: 'app-modelviewer',
  templateUrl: './modelviewer.component.html',
  styleUrls: ['./modelviewer.component.css']
})
export class ModelviewerComponent {

  flag =true;
  styleFlag=false;
  query: string | null | undefined;
  scene = new THREE.Scene();
  dataset!: Observable<ObjectModel>;
  progressBarValue!:string;
  constructor(private http:HttpClient, private route:ActivatedRoute, private router:Router)
  {
    this.flag=true;
    this.query= '';
    this.scene= new THREE.Scene();
    this.dataset = new Observable<ObjectModel>();
  }
  getRelatedComponent():Observable<ObjectModel>{
    console.log("query "+this.query);
    return this.http.get<ObjectModel>(`https://modelrender-gnqnh5vpla-uc.a.run.app/getRelatedComponent?query=${this.query}`);
  }
  ngOnInit()
  {
    this.query = this.route.snapshot.queryParamMap.get('query');
    this.pleaseRender();

  }

  pleaseRender()
  {
    var dataset = this.getRelatedComponent();
    this.scene = new THREE.Scene();
    const fileUrl = new URL('../assets/hand.glb', import.meta.url);
const renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);


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
    this.scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    this.scene.add(directionalLight);
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
const loadingManager = new THREE.LoadingManager();
loadingManager.onProgress = (url, loaded, total) =>{
  this.progressBarValue = ""+(loaded/total)*100;
}

loadingManager.onLoad = ()=>{
  this.styleFlag = true;
}
const assetLoader = new GLTFLoader(loadingManager);
const dracoLoader = new DRACOLoader;
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
assetLoader.setDRACOLoader(dracoLoader);
assetLoader.load('../assets/handModel2.glb', (gltf) => {
    const model = gltf.scene;
    this.scene.add(model);
    dataset.subscribe(data=>{
      if(data.courses.length!=0)
      {
        data.courses.forEach(i=> this.scene.add(model.getObjectByName(i)!));
      }
      if(data.intersections.length!=0)
      {
        data.intersections.forEach(i=> this.scene.add(model.getObjectByName(i)!));
      }
      if(data.muscles.length!=0)
      {
        data.muscles.forEach(i=>this.scene.add(model.getObjectByName(i)!))
      }
      if(data.nerves.length!=0)
      {
        data.nerves.forEach(i=>this.scene.add(model.getObjectByName(i)!))
      }
      if(data.origins.length!=0)
      {
        data.origins.forEach(i=> this.scene.add(model.getObjectByName(i)!))
      }
    });
    // scene.add(model.getObjectByName('Biceps')!);
    // scene.add(model.getObjectByName('Scapula')!);
    // scene.add(model.getObjectByName('Radius')!);
    // scene.add(model.getObjectByName('Humerus')!);
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

    const animate = () => {
      renderer.render(this.scene, camera);
  }
  renderer.setAnimationLoop(animate);
    window.addEventListener('resize', function() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
    this.flag = false;
  }
  clear()
  {

    this.scene = new THREE.Scene();
    this.scene.clear();

  }

  goToSearch()
  {
    this.clear();
    console.log("clicking the return to main menu");
    window.location.href= '/searchbar';
  }
}



