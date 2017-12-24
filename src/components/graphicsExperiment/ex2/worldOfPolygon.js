import * as THREE from 'three'
import * as util from './util'
import BasicWorld from './basicWorld'
import EventEmitter from 'events'
import consts from './consts'
import polygonStore from './polygonStore'
import {Polygon} from "./polygonStore";
import {DotPlus} from "./util";
import {DotPlusMesh} from "./util";

function WordOfPolygon(options) {
    let basicWorld = null

    let activeDot = null

    let targetCanvas = null

    // 鼠标事件
    let mouseAction = null

    // 当前动作状态
    let state = consts.DISPLAY

    // 当前正在绘制的图形的相关变量
    let dotStack = []
    let lineStack = []
    let curLine = null

    let shapeColor = new THREE.Color(1, 1, 1)

    //正在编辑的图形的相关变量
    let curPolygon = null//鼠标落在的多边形
    let operatingPolygon = null//正在编辑的多边形

    let editDotPlusHelper = []
    let movingObject = null
    let isMoving = false
    let startV, objectV


    function wordOfPolygon(options) {

        targetCanvas = options.targetCanvas || document.createElement('canvas')

        basicWorld = new BasicWorld({targetCanvas})

        mouseAction = new EventEmitter()

        // 注册mouseAction要管理的鼠标事件
        targetCanvas.addEventListener('mousemove', util.save((e) => {
            mouseAction.emit('move', e)
        }))
        targetCanvas.addEventListener('click', util.save(e => {
            mouseAction.emit('click', e)
        }))
        targetCanvas.addEventListener('mousedown', util.save(e => {
            mouseAction.emit('down', e)
        }))
        targetCanvas.addEventListener('mouseup', util.save(e => {
            mouseAction.emit('up', e)
        }))

        // store要接管的scene
        polygonStore.takeOver(basicWorld)


        // 右键删除多边形
        targetCanvas.addEventListener('contextmenu', e => {
            e.preventDefault()
            deletePolygon(event)
        })
        /*
        DISPLAY+CREATE+EDIT
         */
        // 高亮移动到的点
        mouseAction.on('move', highlightDotPicked)

        /*
        CREATE
         */
        // 更新各状态
        mouseAction.on('click', updateDotState)
        // 更新curLine的终点
        mouseAction.on('move', updateCurLineEnd)

        /*
        EDIT
         */
        mouseAction.on('move', highlightPolygonPicked)
        mouseAction.on('up', moveDotOrPolygonUp)
        mouseAction.on('up', updateOperatingPolygon)
        mouseAction.on('down', moveDotOrPolygonDown)
        mouseAction.on('move', moveDotOrPolygonMove)


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
        },
        externalizeFromJSON(jsonObject) {
            polygonStore.externalize(jsonObject)
            basicWorld.render()
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

    function highlightPolygonPicked(event) {
        if (state !== consts.EDIT) return
        let pickedPolygon = getPickedPolygonFromMouseEvent(event)
        if (curPolygon) {
            curPolygon.recover()
        }
        if (pickedPolygon) {
            curPolygon = pickedPolygon
            curPolygon.highlight()
        } else {
            curPolygon = null
        }
    }

    function updateDotState(event) {

        if (state !== consts.CREATE) return


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
        if (state !== consts.CREATE) return
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

    function getPickedPolygonFromMouseEvent(event) {
        return basicWorld.pick(Polygon, util.getPositionInUnitAxis(event))[0]
    }

    function updateOperatingPolygon(event) {
        if (state !== consts.EDIT) return
        let pickedPolygon = getPickedPolygonFromMouseEvent(event)
        if (!pickedPolygon) {
            // 确认之前编辑完成的多边形
            finishEdit()
        } else if (pickedPolygon !== operatingPolygon) {
            // 确认之前编辑完成的多边形
            finishEdit()
            // 将选中的多边形切换进入编辑状态
            Edit(pickedPolygon)
        } else {
            // 选中的还是正在编辑的图形  不作响应
        }

    }

    function moveDotOrPolygonDown(e) {
        if (state !== consts.EDIT) return


        let pickedDot = getPickedDotFromMouseEvent(e)
        if (pickedDot) {
            isMoving = true
            movingObject = pickedDot
            objectV = movingObject.position.clone()
            let axis = util.getPositionInUnitAxis(e)
            startV = new THREE.Vector3(axis.x * basicWorld.resolution / 2, axis.y * basicWorld.resolution / 2 * basicWorld.aspect, 0)
        } else {
            let pickedPolygon = getPickedPolygonFromMouseEvent(e)
            if (pickedPolygon) {
                isMoving = true
                movingObject = pickedPolygon
                objectV = movingObject.position.clone()
                let axis = util.getPositionInUnitAxis(e)
                startV = new THREE.Vector3(axis.x * basicWorld.resolution / 2, axis.y * basicWorld.resolution / 2 * basicWorld.aspect, 0)
            }
        }
    }

    function moveDotOrPolygonMove(e) {
        if (state !== consts.EDIT || !isMoving) return

        let curPosition = util.getPositionInUnitAxis(e)
        let endV = new THREE.Vector3(curPosition.x*basicWorld.resolution/2,curPosition.y*basicWorld.resolution/2*basicWorld.aspect,0)

        if (movingObject instanceof DotPlusMesh) {
            //    正在移动顶点
            let newPos =  util.add(objectV,util.sub(endV,startV))
            movingObject.position.set(newPos.x,newPos.y,newPos.z)
            basicWorld.render()
        } else if (movingObject instanceof Polygon) {
            //    正在移动多边形
            let newPos =  util.add(objectV,util.sub(endV,startV))
            movingObject.position.set(newPos.x,newPos.y,newPos.z)
            updateDotPlusHelper()
            basicWorld.render()
        } else {
            throw new Error('aaaaaaaaaaaaaaaaaaaaa')
        }
    }

    function moveDotOrPolygonUp(e) {
        if (state !== consts.EDIT || !isMoving) return

        isMoving = false

        let curPosition = util.getPositionInUnitAxis(e)

        if (movingObject instanceof DotPlusMesh) {
            //    顶点
            let vertexIndex = editDotPlusHelper.findIndex(vertex => vertex === movingObject)
            operatingPolygon.vertices[vertexIndex].set(curPosition.x * basicWorld.resolution / 2-operatingPolygon.position.x,
                curPosition.y * basicWorld.resolution * basicWorld.aspect / 2-operatingPolygon.position.y, 0)
            operatingPolygon.verticesNeedUpdate = true
            basicWorld.render()
        } else if (movingObject instanceof Polygon) {
            //    多边形
            finishEdit()
        } else {
            throw new Error('aaaaaaaaaaaaaaaaaaaaa')
        }
    }


    /**
     * 从mouseevent接受信息决定删除某个多边形
     * 需要state = EDIT
     * @param event
     */
    function deletePolygon(event) {
        if (state !== consts.EDIT) return
        let pickedPolygon = getPickedPolygonFromMouseEvent(event)
        if (!pickedPolygon) return
        polygonStore.removePolygon(pickedPolygon)
        finishEdit()
        basicWorld.render()
    }

    function finishEdit() {
        operatingPolygon = null
        updateDotPlusHelper()
    }

    /**
     * 开始编辑某个多边形
     * @param polygon
     * @constructor
     */
    function Edit(polygon) {
        operatingPolygon = polygon

        // 更改颜色
        operatingPolygon.material.color.set(shapeColor)

        updateDotPlusHelper()
        basicWorld.render()
    }

    function clearWorkingStash() {
        // state=CREATE
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


        // state=EDIT
        if (curPolygon) {
            curPolygon.recover()
        }
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

    function updateDotPlusHelper() {
        basicWorld.remove.apply(basicWorld, editDotPlusHelper)
        editDotPlusHelper = []
        if (curPolygon === null) {
            return
        }
        editDotPlusHelper = curPolygon.vertices.map(vertex => {
            let mesh = new DotPlusMesh(new DotPlus(10))
            mesh.position.set(vertex.x+curPolygon.position.x, vertex.y+curPolygon.position.y, 0)
            basicWorld.add(mesh)
            return mesh
        })
    }


}

export default WordOfPolygon
