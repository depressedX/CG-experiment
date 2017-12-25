import * as THREE from 'three'

const trackParams = {
    aspect: 16/9,//纵横比
    size: 200,//尺寸  = 较长的边长
    width: 50,//跑道宽

    color: new THREE.Color().setHSL(Math.random(), .5, .5)
}

function Track(params = {}) {

    THREE.Group.call(this)

    let mergedParams = merge(trackParams, params)
    this._aspect = mergedParams.aspect
    this._size = mergedParams.size
    this._width = mergedParams.width
    this._color = mergedParams.color

    this._trackMaterial = new THREE.MeshLambertMaterial({color: this._color})


    this._objects = []
    let outerRadius = this._size/this._aspect/2
    let upHalfRingGeometry = new THREE.RingGeometry(outerRadius-this._width,outerRadius,this._size/10,this._size/10,Math.PI/2,Math.PI)
    let downHalfRingGeometry = new THREE.RingGeometry(outerRadius-this._width,outerRadius,this._size/10,this._size/10,-Math.PI/2,Math.PI)
    let upHalfRingMesh = new THREE.Mesh(upHalfRingGeometry,this._trackMaterial)
    let downHalfRingMesh = new THREE.Mesh(downHalfRingGeometry,this._trackMaterial)

    let restLength = this._size-2*outerRadius
    let upPlane = new THREE.PlaneGeometry(restLength,this._width),
        downPlane = upPlane.clone()
    let upPlaneMesh = new THREE.Mesh(upPlane,this._trackMaterial),
        downPlaneMesh = new THREE.Mesh(downPlane,this._trackMaterial)

    upHalfRingMesh.position.set(-restLength/2,0,0)
    downHalfRingMesh.position.set(restLength/2,0,0)
    upPlaneMesh.position.set(0,outerRadius-this._width/2,0)
    downPlaneMesh.position.set(0,-outerRadius+this._width/2,0)


    this._objects.push(upHalfRingMesh,downHalfRingMesh,upPlaneMesh,downPlaneMesh)
    this.add.apply(this,this._objects)



}
Track.prototype = Object.assign(Object.create(THREE.Group.prototype),{
    constructor:Track
})


function merge(o1, o2) {
    return Object.assign({}, o1, o2)
}


export default Track
