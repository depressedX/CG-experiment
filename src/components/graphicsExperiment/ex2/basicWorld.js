import * as THREE from 'three'
import {ObjectPicker} from './util'

function BasicWorld(options) {
  Object.assign(this, {
    _scene: null,
    _camera: null,
    _renderer: null,
    targetCanvas: null,


    aspect: .75,
    resolution: 720
  })


  this.targetCanvas = options.targetCanvas || document.createElement('canvas')
  this.targetCanvas.width = this.resolution
  this.targetCanvas.height = this.resolution * this.aspect


  this._scene = new THREE.Scene()

  const fov = 45,
    offsetCamera = this.resolution * this.aspect / 2 / Math.tan(fov / 360 * Math.PI)
  this._camera = new THREE.PerspectiveCamera(fov, 1 / this.aspect, 1, offsetCamera + this.resolution * this.aspect / 2)
  this._camera.position.set(0, 0, offsetCamera)
  this._camera.lookAt(new THREE.Vector3(0, 0, -10))


  let plane = new THREE.PlaneGeometry(this.resolution, this.resolution * this.aspect);
  let planeMesh = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({
    color: new THREE.Color().setHSL(Math.random(), .5, .5),
    wireframe: true
  }))
  this._scene.add(planeMesh)
  console.log('IOJ')
  planeMesh.position.set(0, 0, -10)


  this._renderer = new THREE.WebGLRenderer({canvas: this.targetCanvas, antialias: true})


  this.render()
  console.log('基础世界建设完毕!')
}

BasicWorld.prototype = {
  constructor: BasicWorld,

  get Objects() {
    return this._scene.children
  },

  render() {
    this._renderer.render(this._scene, this._camera)
  },
  add(...objects) {
    this._scene.add.apply(this._scene, objects)
  },
  pick(type,position){
    let objectPicker = new ObjectPicker(this._camera,this._scene,type)
    return objectPicker.pick(position)
  }
}


export default BasicWorld
