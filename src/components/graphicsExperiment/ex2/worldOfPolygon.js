import * as THREE from 'three'
import * as util from './util'
import BasicWorld from './basicWorld'
import EventEmitter from 'events'
import consts from './consts'

function WordOfPolygon(options) {
  let basicWorld = null

  let activeDot = null

  let targetCanvas = null

  let mouseAction = null

  let state = consts.DISPLAY

  let dotPathStack = []
  let lineStack = []
  let curLine = null

  function wordOfPolygon(options) {

    targetCanvas = options.targetCanvas || document.createElement('canvas')

    basicWorld = new BasicWorld({targetCanvas})

    mouseAction = new EventEmitter()


    targetCanvas.addEventListener('mousemove', util.save((e) => {
      mouseAction.emit('move', e)
    }))
    targetCanvas.addEventListener('click', util.save(e => {
      mouseAction.emit('click', e)
    }))


    // 高亮移动到的点
    mouseAction.on('move', highlightDotPicked)
    // 更新各状态
    mouseAction.on('click', updateDotState)
    // 更新curLine的终点
    mouseAction.on('move', updateCurLineEnd)

  }

  wordOfPolygon.prototype = {
    constructor: wordOfPolygon,

    createNewShape() {
      this.state = consts.CREATE
      this.dotPathStack = []
      this.lineStack = []
    }
  }

  return new wordOfPolygon(options)


  function highlightDotPicked(event) {
    let pickdedDot = getPickedDotFromMouseEvent(event)
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
    basicWorld.render()
  }

  function updateDotState(event) {
    let pickedDot = getPickedDotFromMouseEvent(event)
    if (pickedDot) {
      // 选中了栈中某个点
      // 弹栈
      let  curDot = null,
        forwardLine = null
      do {
        curDot = dotPathStack.pop()
        forwardLine = lineStack.pop()
        basicWorld.remove(forwardLine)
        basicWorld.remove(curDot)
      }while (curDot!==pickedDot)
      dotPathStack.push(curDot)
      basicWorld.add(curDot)
      if (forwardLine){
        lineStack.push(forwardLine)
        basicWorld.add(forwardLine)
      }
      curLine.geometry.vertices[0].set(curDot.getVectorRepresented().x,curDot.getVectorRepresented().y,curDot.getVectorRepresented().z)
      curLine.geometry.verticesNeedUpdate = true


    } else {
      // 新建一个dot和一条边 更新相关数据
      let axis = util.getPositionInUnitAxis(event)
      let newDot = new util.DotPlusMesh(new util.DotPlus(10))
      newDot.position.set(axis.x * basicWorld.resolution / 2, axis.y * basicWorld.resolution * basicWorld.aspect / 2, 0)
      if (!curLine) {
        // 栈顶为空
        let lineGeo = new THREE.Geometry()
        lineGeo.vertices.push(newDot.getVectorRepresented(),newDot.getVectorRepresented())
        curLine = new THREE.Line(lineGeo)
        basicWorld.add(curLine)

        basicWorld.add(newDot)
        dotPathStack.push(newDot)
      } else {
        // 栈中有元素
        lineStack.push(curLine)
        let lineGeo = new THREE.Geometry()
        lineGeo.vertices.push(newDot.getVectorRepresented(),newDot.getVectorRepresented())
        curLine = new THREE.Line(lineGeo)
        basicWorld.add(curLine)

        basicWorld.add(newDot)
        dotPathStack.push(newDot)


      }


    }
    basicWorld.render()
  }

  function updateCurLineEnd(event) {
    if (!curLine) return
    let axis = util.getPositionInUnitAxis(event)
    let newEnd = new THREE.Vector3(axis.x * basicWorld.resolution / 2, axis.y * basicWorld.resolution * basicWorld.aspect / 2, 0)
    curLine.geometry.vertices.pop()
    curLine.geometry.vertices.push(newEnd)
    curLine.geometry.verticesNeedUpdate = true
    basicWorld.render()
  }

  function getPickedDotFromMouseEvent(event) {
    return basicWorld.pick(util.DotPlusMesh, util.getPositionInUnitAxis(event))[0]
  }


}

export default WordOfPolygon
