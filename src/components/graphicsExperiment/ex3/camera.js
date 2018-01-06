import * as THREE from 'three'
import {TRACK_SIZE, ASPECT, FOV} from "./consts"
// import {vehicle} from "./scene";


const offsetCamera = 100
const camera = new THREE.PerspectiveCamera(FOV, ASPECT, 1, offsetCamera * 2)
camera.lookAt(new THREE.Vector3(0, 0, -10))
camera.position.set(0, 0, offsetCamera)


const fullSceneCamera = new THREE.OrthographicCamera(-TRACK_SIZE, TRACK_SIZE, TRACK_SIZE / ASPECT, -TRACK_SIZE / ASPECT, 1, 1000)
fullSceneCamera.position.set(0, 500, 0)
fullSceneCamera.lookAt(new THREE.Vector3(0, 0, 0))


const followUpCamera = new THREE.PerspectiveCamera(FOV, ASPECT, 0.01, 1000)
//
// let offsetRotation = {
//     x: 0,
//     y: -Math.PI / 2,
//     z: 0
// }
// let offsetPosition = new THREE.Vector3(
//     // vehicle.mesh.components.body.params.backWheelRadius + vehicle.mesh.components.body.params.driverRoomWidth / 3,
//     -50,
//     (vehicle.mesh.components.body.params.height + vehicle.mesh.components.frontWheel1.params.radius) * 1.2,
//     0)
// 随时更新相机
// setInterval(() => {
//     let orientation = vehicle.curOrientation
//     let position = vehicle.mesh.position
//     // 与X轴夹角
//     let angleHorizontal = orientation.angleTo(new THREE.Vector3(1, 0, 0))
//     if (orientation.z < 0) angleHorizontal = 2 * Math.PI - angleHorizontal
//     let rotatedOffsetPosition = offsetPosition.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), -angleHorizontal)
//
//
//     followUpCamera.rotation.set(0, offsetRotation.y - angleHorizontal, 0)
//     followUpCamera.position.setX(rotatedOffsetPosition.x + position.x)
//     followUpCamera.position.setY(rotatedOffsetPosition.y + position.y)
//     followUpCamera.position.setZ(rotatedOffsetPosition.z + position.z)
//
// console.log('OK',followUpCamera.position.x)
// }, 1000)
function updateFollowUpCamera(vehicle) {
    let offsetRotation = {
        x: 0,
        y: -Math.PI / 2,
        z: 0
    }
    let offsetPosition = new THREE.Vector3(
        vehicle.mesh.components.body.params.backWheelRadius + vehicle.mesh.components.body.params.driverRoomWidth / 3,
        // -50,
        (vehicle.mesh.components.body.params.height + vehicle.mesh.components.frontWheel1.params.radius) * 1.2,
        0)

    let orientation = vehicle.curOrientation
    let position = vehicle.mesh.position
    // 与X轴夹角
    let angleHorizontal = orientation.angleTo(new THREE.Vector3(1, 0, 0))
    if (orientation.z < 0) angleHorizontal = 2 * Math.PI - angleHorizontal
    let rotatedOffsetPosition = offsetPosition.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), -angleHorizontal)


    followUpCamera.rotation.set(0, offsetRotation.y - angleHorizontal, 0)
    followUpCamera.position.setX(rotatedOffsetPosition.x + position.x)
    followUpCamera.position.setY(rotatedOffsetPosition.y + position.y)
    followUpCamera.position.setZ(rotatedOffsetPosition.z + position.z)
}

export {fullSceneCamera as camera, followUpCamera,updateFollowUpCamera}
