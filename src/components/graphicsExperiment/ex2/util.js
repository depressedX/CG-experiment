import * as THREE from 'three'

function DotPlus(radius = 5, segements = 8) {
  THREE.CircleGeometry.call(this, radius, radius)
}

DotPlus.prototype = Object.assign(Object.create(THREE.CircleGeometry.prototype), {

  constructor: DotPlus,

});


function DotPlusMesh(dotPlus) {
  let material = new THREE.MeshBasicMaterial({color: DotPlusMesh.prototype.normalColor})
  THREE.Mesh.call(this, dotPlus, material)

}

DotPlusMesh.prototype = Object.assign(Object.create(THREE.Mesh.prototype), {

  constructor: DotPlusMesh,

  active() {
    this.material.color.set(this.activeColor)
  },
  inActive() {
    this.material.color.set(this.normalColor)
  },
  activeColor: new THREE.Color(255, 0, 0),
  normalColor: new THREE.Color(255, 255, 255)
});


function ObjectPicker(camera, scene, type) {
  this.raycaster = new THREE.Raycaster()
  this.type = type
  this.scene = scene
  this.camera = camera
}

ObjectPicker.prototype = {
  constructor: ObjectPicker,
  pick(position) {

    this.raycaster.setFromCamera(position, this.camera);

    let intersectedObjects = this.raycaster.intersectObjects(this.scene.children)
    return intersectedObjects.filter(object => this.type === object.object.constructor).map(value => value.object);
  }
}

/**
 * 获取鼠标在canvas坐标系中的坐标
 * @param e
 * @returns {{x: number, y: number}}
 */
function getPositionInUnitAxis(e) {


  let mouse = new THREE.Vector2();
  let canvasPosition = getElementPosition(e.target)
  var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
  var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
  mouse.x = ( (event.clientX + scrollX - canvasPosition.x) / e.target.width ) * 2 - 1;
  mouse.y = -( (event.clientY + scrollY - canvasPosition.y) / e.target.height ) * 2 + 1;

  return mouse


  function getElementPosition(e) {
    var x = 0;
    var y = 0;
    while (e !== null) {
      x += e.offsetLeft;
      y += e.offsetTop;
      e = e.offsetParent;
    }
    return {x: x, y: y};
  }
}



function save(func, limit = 10) {
  let lastTime = 0

  return function (...args) {
    let thisTime = new Date()
    if (thisTime - lastTime > limit) {
      lastTime = thisTime
      func.apply(this, args)
    }
  }
}

export {DotPlus, DotPlusMesh, ObjectPicker, getPositionInUnitAxis,save}
