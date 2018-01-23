import {scene} from "./scene";
import {fullSceneCamera,followUpCamera} from "./camera";
import {renderer} from "./renderer";

let curCamera = followUpCamera

function switchCamera(camera) {
    if (camera===undefined){
        curCamera = curCamera===fullSceneCamera?followUpCamera:fullSceneCamera
    }else {
        curCamera = camera
    }
}


function render(timeStamp) {
    if (renderer) {
        renderer.render(scene, curCamera)
    }
    requestAnimationFrame(render)
}
requestAnimationFrame(render)


export {switchCamera}
