import * as THREE from 'three'
import * as util from './util'
import BasicWorld from './basicWorld'
import EventEmitter from 'events'
import consts from './consts'
import polygonStore from './polygonStore'

function WordOfPolygon(options) {
  let basicWorld = null

  let activeDot = null

  let targetCanvas = null

  let mouseAction = null

  let state = consts.DISPLAY

  // 当前正在绘制的图形的相关变量
  let dotStack = []
  let lineStack = []
  let curLine = null

  let shapeColor = new THREE.Color(1, 1, 1)


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

    polygonStore.takeOver(basicWorld)


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
      state = consts.CREATE
      clearWorkingStash()
      basicWorld.render()
    },
    display() {
      state = consts.DISPLAY
      clearWorkingStash()
      basicWorld.render()
    },
    edit() {
      state = consts.EDIT
      clearWorkingStash()
      basicWorld.render()
    },
    setColor(r, g, b, a) {
      shapeColor = new THREE.Color(r / 255, g / 255, b / 255)
    },
    downloadSavedPolygon() {
      createAndDownloadFile('data.txt', JSON.stringify(polygonStore.serialize()))
    },
    serializeSavedPolygon() {
      return polygonStore.serialize()
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
    console.log(state)

    if (state!==consts.CREATE) return

    let pickedDot = getPickedDotFromMouseEvent(event)
    if (pickedDot) {
      // 如果选中的是第一个点 则认为已经完成该多边形的绘制
      if (pickedDot === dotStack[0]) {
        let vertices = dotStack.map(dot => dot.getVectorRepresented())
        clearWorkingStash()

        // 存入store中
        polygonStore.addPolygon(vertices, shapeColor)

      } else {
        // 选中了栈中某个点
        // 弹栈
        let curDot = null,
          forwardLine = null
        do {
          curDot = dotStack.pop()
          forwardLine = lineStack.pop()
          basicWorld.remove(forwardLine)
          basicWorld.remove(curDot)
        } while (curDot !== pickedDot)
        dotStack.push(curDot)
        basicWorld.add(curDot)
        if (forwardLine) {
          lineStack.push(forwardLine)
          basicWorld.add(forwardLine)
        }
        curLine.geometry.vertices[0] = curDot.getVectorRepresented()
        curLine.geometry.verticesNeedUpdate = true

      }
    } else {
      // 新建一个dot和一条边 更新相关数据
      let axis = util.getPositionInUnitAxis(event)
      let newDot = new util.DotPlusMesh(new util.DotPlus(10))
      newDot.position.set(axis.x * basicWorld.resolution / 2, axis.y * basicWorld.resolution * basicWorld.aspect / 2, 0)
      if (!curLine) {
        // 栈顶为空
        let lineGeo = new THREE.Geometry()
        lineGeo.vertices.push(newDot.getVectorRepresented(), newDot.getVectorRepresented())
        curLine = new THREE.Line(lineGeo)
        basicWorld.add(curLine)

        basicWorld.add(newDot)
        dotStack.push(newDot)
      } else {
        // 栈中有元素
        lineStack.push(curLine)
        let lineGeo = new THREE.Geometry()
        lineGeo.vertices.push(newDot.getVectorRepresented(), newDot.getVectorRepresented())
        curLine = new THREE.Line(lineGeo)
        basicWorld.add(curLine)

        basicWorld.add(newDot)
        dotStack.push(newDot)


      }


    }
    basicWorld.render()
  }

  function updateCurLineEnd(event) {
    if (state!==consts.CREATE) return
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

  function clearWorkingStash() {
    dotStack.forEach(dot => {
      basicWorld.remove(dot)
    })
    dotStack = []

    lineStack.forEach(line => {
      basicWorld.remove(line)
    })
    lineStack = []

    basicWorld.remove(curLine)
    curLine = null
  }

  /**
   * 创建并下载文件
   * @param  {String} fileName 文件名
   * @param  {String} content  文件内容
   */
  function createAndDownloadFile(fileName, content) {
    var aTag = document.createElement('a');
    var blob = new Blob([content]);
    aTag.download = fileName;
    aTag.href = URL.createObjectURL(blob);
    aTag.click();
    URL.revokeObjectURL(blob);
  }


}

export default WordOfPolygon
