import * as THREE from 'three'
import grassImage from '../../../../assets/grass.jpg'
import {SCENE_DEPTH, SCENE_WIDTH} from "../consts";


const textureLoader = new THREE.TextureLoader()

function Ground() {
    let planeGeometry = new THREE.PlaneGeometry(SCENE_WIDTH, SCENE_DEPTH)

    THREE.Mesh.call(this, planeGeometry, new THREE.MeshLambertMaterial({color:new THREE.Color(1,1,1),side:THREE.DoubleSide}))
    textureLoader.load(grassImage, texture => {
        this.material.map = texture
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 20, 20 );
    })
}

Ground.prototype = Object.assign(Object.create(THREE.Mesh.prototype),{
    constructor:Ground
})


export default Ground
