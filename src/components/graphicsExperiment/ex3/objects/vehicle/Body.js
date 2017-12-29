/***
 * @author lph
 * @description 车身的Object3D对象
 */

import * as THREE from 'three'


// 单向的对象的值覆盖
let oneWayCover = (...objects) => {
    let result = Object.assign({}, objects[0])
    let resultKey = result.keys()
    objects.slice(1).forEach(object => {
        object.keys().filter(key => resultKey.contains(key)).forEach(key => {
            result[key] = object[key]
        })
    })
}

const bodySideShapeDefaultParams = {
    frontWidth: 30,
    backWidth: 30,
    driverRoomWidth: 30,
    height: 20,
    bottomHeight: 5,
    backWheelRadius: 10,
    frontWheelRadius: 10
}

function BodySideShape(params = {}) {
    THREE.Shape.call(this)

    this.params = Object.assign({}, bodySideShapeDefaultParams, params)
    params = this.params

    this.moveTo(0, 0)
    this.lineTo(0, params.height)
    this.lineTo(params.frontWidth, params.height)
    this.lineTo(params.frontWidth, params.bottomHeight)
    this.lineTo(params.frontWidth + params.driverRoomWidth / 2, params.bottomHeight)
    this.lineTo(params.frontWidth + params.driverRoomWidth, params.height)
    this.lineTo(params.frontWidth + params.driverRoomWidth + params.backWidth, params.height)
    this.lineTo(params.frontWidth + params.driverRoomWidth + params.backWidth, 0)
    this.lineTo(params.frontWidth + params.driverRoomWidth + params.backWheelRadius * 2, 0)
    this.arc(-params.backWheelRadius, 0, params.backWheelRadius, 0, Math.PI)
    this.lineTo(params.frontWheelRadius + params.frontWidth / 2, 0)
    this.arc(-params.frontWheelRadius, 0, params.frontWheelRadius, 0, Math.PI)
    this.lineTo(0, 0)


}

BodySideShape.prototype = Object.assign(Object.create(THREE.Shape.prototype), {
    constructor: BodySideShape
})


const bodyDefaultParams = {
    width: 30,
    windshieldHeight : 10
}

function Body(params) {
    this.params = Object.assign({}, bodyDefaultParams,bodySideShapeDefaultParams, params)
    params = this.params

    THREE.Group.call(this)



    let extrudeSettings = {amount: this.params.width, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1};
    let bodySideShape = new BodySideShape(params)
    let bodyFrameGeometry = new THREE.ExtrudeGeometry(bodySideShape,extrudeSettings)
    bodyFrameGeometry.translate(0,0,-params.width/2)

    let bodyFrameMesh = new THREE.Mesh(bodyFrameGeometry,
        [new THREE.MeshPhongMaterial({color:new THREE.Color(1,0,0), specular: 0x050505, shininess: 1000}),
        new THREE.MeshLambertMaterial()])
    this.add(bodyFrameMesh)


    let windshield = new THREE.PlaneGeometry(params.width,params.windshieldHeight)
    windshield.rotateY(Math.PI/2)
    windshield.translate(0,params.windshieldHeight/2,0)
    windshield.rotateZ(-Math.PI/8)
    let windshieldMesh = new THREE.Mesh(windshield,new THREE.MeshStandardMaterial({
        side:THREE.DoubleSide,
        opacity: .3,
        transparent: true,
        color:new THREE.Color(1,1,1)}))

    windshieldMesh.position.set(params.frontWidth,params.height,0)
    this.add(windshieldMesh)

    // this.referenceSize = params.frontWidth+params.driverRoomWidth+params.backWidth
}

Body.prototype = Object.assign(Object.create(THREE.Group.prototype), {
    constructor: Body
})

export {Body}
