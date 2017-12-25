import * as THREE from 'three'
import Track from './objects/Track'
import consts, {ASPECT, TRACK_SIZE} from './consts'
import Ground from "./objects/Ground";

const scene= new THREE.Scene()

// let axesHelper = new THREE.AxesHelper(1000)
// scene.add(axesHelper)


var light = new THREE.AmbientLight(0xffffff,.1)
scene.add(light);

var light = new THREE.PointLight();
light.position.set( 100, 100, 100 );
scene.add(light);
setInterval(()=>{
    light.position.z+=10
    light.position.z = light.position.z>200?100:light.position.z
},20)

const track = new Track({width:consts.TRACK_WIDTH,size:consts.TRACK_SIZE})
track.rotateX(-Math.PI/2)
track.position.set(0,1,0)
scene.add(track)

const ground = new Ground()
ground.rotateX(-Math.PI/2)
scene.add(ground)






export { scene}
