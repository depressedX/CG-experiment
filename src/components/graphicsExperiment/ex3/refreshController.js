import {scene} from "./scene";
import {camera} from "./camera";
import {renderer} from "./renderer";

let curCamera = camera

function switchCamera(camera) {
    curCamera = camera
}


function render(timeStamp) {
    if (renderer) {
        renderer.render(scene, curCamera)
    }
    requestAnimationFrame(render)
}
requestAnimationFrame(render)


export {switchCamera}
