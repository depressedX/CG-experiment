import * as THREE from 'three'
import {TRACK_SIZE,ASPECT} from "./consts"
import './refreshController'
import {OrbitControls} from "../../../lib/OrbitControls";
import {camera,followUpCamera} from "./camera";

let renderer = null


function init(params) {
    params.canvas.width = TRACK_SIZE*2
    params.canvas.height = TRACK_SIZE*2/ASPECT
    renderer = new THREE.WebGLRenderer(params)
    renderer.setClearColor(new THREE.Color(.9,.9,.9),1)


    // 自由视角控制
    // let controls = new OrbitControls( camera, params.canvas);
    // controls.enableZoom = true;
}


export  {
    init,renderer
}
