import {scene} from "./scene";
import {fullSceneCamera,followUpCamera} from "./camera";
import {renderer} from "./renderer";

let curCamera = followUpCamera

function switchCamera(camera) {
    if (camera===undefined){
        console.log('curcamera',curCamera===fullSceneCamera?'fullScenecamera':'foo=llow')
        curCamera = curCamera===fullSceneCamera?followUpCamera:fullSceneCamera
        console.log('curcamera',curCamera===fullSceneCamera?'fullScenecamera':'foo=llow')
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
