import * as THREE from 'three'
import * as util from './util'

function WordOfPolygon(options) {
  /*私有变量*/
  let targetCanvas = null,          //要渲染的canvas
    camera = null,                  //相机
    renderer = null,                //渲染器
    scene = null                    //场景

  const resolution = 720            //横向分辨率
  let aspect = .75                  //canvas宽高比


  let activeDot = null

  function wordOfPolygon(options) {
    targetCanvas = options.targetCanvas || document.createElement('canvas')
    targetCanvas.width = resolution
    targetCanvas.height = resolution * aspect


    scene = new THREE.Scene()
    const fov = 45,
      offsetCamera = resolution * aspect / 2 / Math.tan(fov / 360 * Math.PI)
    camera = new THREE.PerspectiveCamera(fov, 1 / aspect, 1, offsetCamera + resolution * aspect / 2)
    camera.position.set(0, 0, offsetCamera)
    camera.lookAt(new THREE.Vector3(0, 0, -10))


    let box = new THREE.PlaneGeometry(resolution, resolution * aspect);
    let materials = []
    for (let i = 0; i < 12; i++) {
      materials.push(new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(Math.random(), .5, .5),
        wireframe: true
      }))
    }
    box.faces.forEach((value, index) => {
      value.materialIndex = parseInt(index / 2)
    })
    let boxMesh = new THREE.Mesh(box, materials)
    scene.add(boxMesh)
    boxMesh.position.set(0, 0, -10)


    renderer = new THREE.WebGLRenderer({canvas: targetCanvas, antialias: true})


    let dot = new util.DotPlusMesh(new util.DotPlus(50))
    dot.position.set(0, 0, 0)
    scene.add(dot)


    targetCanvas.addEventListener('mousemove', util.save(mouseMoveHandler))

    requestRerender()
    // window.requestAnimationFrame(renderFunc)
  }

  wordOfPolygon.prototype = {
    constructor: wordOfPolygon,

  }

  return new wordOfPolygon(options)

  function renderFunc() {
    renderer.render(scene, camera)
    renderFunc()
  }

  function requestRerender() {
    renderer.render(scene, camera)
  }

  function mouseMoveHandler(event) {
    let dotPicker = new util.ObjectPicker(camera, scene, util.DotPlusMesh),
      mouse = util.getPositionInUnitAxis(event)
    let pickdedDot = dotPicker.pick(mouse)[0]
    console.log(pickdedDot)
    if (pickdedDot) {
      if (activeDot) {
        activeDot.inActive()
      }
      activeDot = pickdedDot
      activeDot.active()
    } else {
      if (activeDot) {
        activeDot.inActive()
        activeDot = null
      }
    }
    requestRerender()

  }


}

export default WordOfPolygon


