import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent {

  value:string = ''
  scene = new THREE.Scene();
  constructor(private router: Router)
  {

  }
  ngOnInit()
  {
    const assetLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader;
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
assetLoader.setDRACOLoader(dracoLoader);

    assetLoader.load('../assets/handModel2.glb', (gltf) => {
      const model = gltf.scene;
    });
  }
  onEnter(value:string)
  {
    this.value= value;
    this.router.navigate(['/modelViewer'],{queryParams:{query:this.value}});
  }
}
