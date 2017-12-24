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
    this.hasHightlighted = false

    let that = this

    // 把顶点保存下来  方便修改顶点
    this.vertices = vertices
    // 定义verticesNeedUpdate 监测是否需要更新
    Object.defineProperty(this, 'verticesNeedUpdate', {
        $value: false,
        configurable: false,
        enumerable: true,
        get() {
            return this.$value
        },
        set(value) {
            if (value) {
                that._updateVertices()
                this.$value = false
            }
        }
    })


}

Polygon.prototype = Object.assign(Object.create(THREE.Mesh.prototype), {
    constructor: Polygon,
    toJSON() {
        return {
            vertices: this.geometry.vertices.map(vertice => ({
                x: vertice.x + this.position.x,
                y: vertice.y + this.position.y
            })),
            color: {r: this.material.color.r, g: this.material.color.g, b: this.material.color.b}

        }
    },
    highlight() {
        if (this.hasHightlighted) return
        this.hasHightlighted = true
        this.material.wireframe = true
        // let hsl = this.material.color.getHSL()
        // this.material.color.setHSL(1 - hsl.h, 1 - hsl.s, 1 - hsl.l)
    },
    recover() {
        if (!this.hasHightlighted) return
        this.hasHightlighted = false
        this.material.wireframe = false
        // let hsl = this.material.color.getHSL()
        // this.material.color.setHSL(1 - hsl.h, 1 - hsl.s, 1 - hsl.l)
    },
    hightlightRate: 1.1,


    // 通过更新的顶点数组更新geometry
    _updateVertices() {
        let vertices = this.vertices
        let path = new THREE.Shape()
        path.moveTo(vertices[0].x, vertices[0].y)
        vertices.forEach(vertice => {
            path.lineTo(vertice.x, vertice.y)
        })
        let geometry = new THREE.ShapeGeometry(path)
        this.geometry = geometry
    }
})
Polygon.fromJSON = (shapeInfo) => {
    let vertices = shapeInfo.vertices.map(vertices2 => new THREE.Vector3(vertices2.x, vertices2.y, vertices2.z))
    let color = new THREE.Color(shapeInfo.color.r, shapeInfo.color.g, shapeInfo.color.b)
    return new Polygon(vertices, color)
}


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

function removePolygon(polygon) {
    let index = shapes.indexOf(polygon)
    if (index === -1) {
        console.error('删除的元素不存在')
        return
    }
    shapes.splice(index, 1)
    scene.remove(polygon)
}

function serialize() {
    return shapes.map(shape => shape.toJSON())
}

/**
 * 清空当前存储的对象 然后从jsonObject解析相应对象
 * @param jsonObject
 */
function externalize(jsonObject) {
    shapes.forEach(shape => {
        scene.remove(shape)
    })
    shapes = []
    jsonObject.forEach(shapeInfo => {
        let polygon = Polygon.fromJSON(shapeInfo)
        shapes.push(polygon)
        scene.add(polygon)
    })
}


export default {
    addPolygon,
    removePolygon,
    takeOver,
    serialize,
    externalize,
}
export {Polygon}
