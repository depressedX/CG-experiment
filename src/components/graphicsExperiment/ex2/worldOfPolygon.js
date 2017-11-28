import * as THREE from 'three'
import * as util from './util'
import BasicWorld from './basicWorld'

function WordOfPolygon(options) {
  let basicWorld =null

  let activeDot = null

  let targetCanvas = null

  function wordOfPolygon(options) {

    targetCanvas = options.targetCanvas || document.createElement('canvas')

    basicWorld= new BasicWorld({targetCanvas})

    let dot = new util.DotPlusMesh(new util.DotPlus(10))
    dot.position.set(0, 0, 0)
    basicWorld.add(dot)



    targetCanvas.addEventListener('mousemove', util.save(mouseMoveHandler))


  }

  wordOfPolygon.prototype = {
    constructor: wordOfPolygon,

  }

  return new wordOfPolygon(options)


  function mouseMoveHandler(event) {
    let mouse = util.getPositionInUnitAxis(event)
    let pickdedDot = basicWorld.pick(util.DotPlusMesh,mouse)[0]
    if (pickdedDot) {
      console.log(pickdedDot)
    }
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


}

export default WordOfPolygon
