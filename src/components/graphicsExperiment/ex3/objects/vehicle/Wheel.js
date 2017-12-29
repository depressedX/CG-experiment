/***
 * @author lph
 * @description 车轮的Object3D对象
 */
import * as THREE from 'three'
import wheelBumpMap from '../../../../../assets/objects/wheel_bump_map.jpg'
import wheelColorMap from '../../../../../assets/objects/wheel_color_map.png'
import wheelBumpMap2 from '../../../../../assets/objects/wheel_bump_map2.jpg'
import wheelColorMap2 from '../../../../../assets/objects/wheel_color_map2.png'

const wheeldefaultParams = {
    radius:10,
    width:5
}
let textureLoader = new THREE.TextureLoader()

function Wheel(params) {
    this.params = {}
    Object.assign(this.params,wheeldefaultParams,params)
    params = this.params


    THREE.Group.call(this)

    let sideMesh = createSideFace(params)
    let frontMesh = createFrontFace(params),
        frontMesh2 = createFrontFace(params)
    frontMesh2.rotateY(Math.PI)
    frontMesh2.position.set(0,0,-params.width/2)
    frontMesh.position.set(0,0,params.width/2)

    this.add(sideMesh,frontMesh2,frontMesh)



}
Wheel.prototype = Object.assign(Object.create(THREE.Group.prototype),{
    constructor:Wheel
})

function createFrontFace(params) {
    let frontGeometry = new THREE.CircleGeometry(params.radius,params.radius*2)
    frontGeometry.rotateZ(Math.PI/2)
    let frontTextureColorMap = textureLoader.load(wheelColorMap2),
        frontTextureBumpMap = textureLoader.load(wheelBumpMap2)

    let frontMaterial = new THREE.MeshPhongMaterial({
        color:new THREE.Color(1,1,1),
        map:frontTextureColorMap,
        bumpMap:frontTextureBumpMap
    })
    let frontMesh = new THREE.Mesh(frontGeometry,frontMaterial)
    return frontMesh
}
function createSideFace(params) {
    let sideGeometry = new THREE.CylinderGeometry(params.radius,params.radius,params.width,params.radius*5,undefined,true)
    sideGeometry.rotateX(Math.PI/2)
    let sideTextureColorMap = textureLoader.load(wheelColorMap),
        sideTextureBumpMap = textureLoader.load(wheelBumpMap)
    sideTextureColorMap.wrapS = THREE.RepeatWrapping;
    sideTextureColorMap.wrapT = THREE.RepeatWrapping;
    sideTextureColorMap.repeat.set(10,1)
    sideTextureBumpMap.wrapS = THREE.RepeatWrapping;
    sideTextureBumpMap.wrapT = THREE.RepeatWrapping;
    sideTextureBumpMap.repeat.set(10,1)

    let sideMaterial = new THREE.MeshPhongMaterial({
        color:new THREE.Color(1,1,1),
        map:sideTextureColorMap,
        bumpMap:sideTextureBumpMap
    })
    let sideMesh = new THREE.Mesh(sideGeometry,sideMaterial)
    return sideMesh
}

export {Wheel}
