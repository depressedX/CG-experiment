import * as THREE from 'three'
import {TRACK_SIZE, ASPECT, FOV} from "./consts"


const offsetCamera = 100
const camera = new THREE.PerspectiveCamera(FOV, ASPECT, 1, offsetCamera * 2)
camera.lookAt(new THREE.Vector3(0, 0, -10))
camera.position.set(0, 0, offsetCamera)


const fullSceneCamera = new THREE.OrthographicCamera(-TRACK_SIZE, TRACK_SIZE, TRACK_SIZE / ASPECT, -TRACK_SIZE / ASPECT, 1, 1000)
fullSceneCamera.position.set(0, 500, 0)
fullSceneCamera.lookAt(new THREE.Vector3(0, 0, 0))
// setInterval(()=>{
//     fullSceneCamera.position.y+=10
//     renderer.render(scene,fullSceneCamera)
//     console.log(fullSceneCamera.position.y)
//
// },1000)

export {fullSceneCamera as camera}
