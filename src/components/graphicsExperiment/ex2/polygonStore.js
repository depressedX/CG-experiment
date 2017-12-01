import * as THREE from 'three'

/***
 *
 * @param vertices 顶点数组  自动忽略z坐标
 * @param color 多边形颜色
 * @constructor
 */
function Polygon(vertices, color) {
  let path = new THREE.Shape()
  path.moveTo(vertices[0].x, vertices[0].y)
  vertices.forEach(vertice => {
    path.lineTo(vertice.x, vertice.y)
  })
  let geometry = new THREE.ShapeGeometry(path)
  let material = new THREE.MeshBasicMaterial({color})
  THREE.Mesh.call(this, geometry, material)
}

Polygon.prototype = Object.assign(Object.create(THREE.Mesh.prototype), {
  constructor: Polygon,
  valueOf() {
    return {
      vertices: this.geometry.vertices.map(vertice => ({x: vertice.x, y: vertice.y})),
      color: {r:this.material.color.r,g:this.material.color.g,b:this.material.color.b}

    }
  }
})


let scene = null
let shapes = []

/**
 * 穿入scene  将会remove之前加入的polygon  并且迁移到新的scene
 */
function takeOver(newScene) {
  if (scene) {
    shapes.forEach(shape => {
      scene.remove(shape)
    })
  }
  scene = newScene
  shapes.forEach(shape => {
    scene.add(shape)
  })
}

function addPolygon(vertices, color) {
  let newPolygon = new Polygon(vertices, color)
  shapes.push(newPolygon)
  scene.add(newPolygon)
}

function serialize() {
  return shapes.map(shape => shape.valueOf())
}


export default {
  addPolygon,
  takeOver,
  serialize
}
